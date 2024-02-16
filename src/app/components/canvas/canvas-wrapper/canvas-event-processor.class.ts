import { style } from '@angular/animations';
import { Renderer2 } from '@angular/core';
import { CanvasEventConsumer } from 'canvas-draw/dist/types/canvas-event-consumer.interface';
import { PointerPosition } from 'canvas-draw/dist/types/pointer-position.interface';
import { SubSink } from 'subsink';

export class CanvasEventProcessor {

  private static ZOOM_MULTIPLIER = 16;
  private static PAN_MULTIPLIER = 8;

  private static STYLE_POLL_INTERVAL_MS = 1000;
  private static CSS_VARIABLE_NAMES = this.collectCanvasCssVariableNames();

  private subs = new SubSink();

  private hammer: HammerManager;
  private pinchCenter: PointerPosition | null = null;
  private lastScaleValue: number | null = null;
  private lastDeltaX: number | null = null;
  private lastDeltaY: number | null = null;

  private sizeObserver: ResizeObserver | null = null;
  private stylePollTask: ReturnType<typeof setInterval> | null = null;
  private isFirstPollRun = true;
  private lastPolledStyles: { [key: string]: string } = {};

  constructor(
    private consumer: CanvasEventConsumer,
    private element: HTMLCanvasElement,
    private renderer: Renderer2
  ) {
    this.hammer = new Hammer(element);
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ enable: true });
  }

  bind() {
    this.bindInputEvents();
    this.bindObservers();
  }

  unbind() {
    this.subs.unsubscribe();
    this.unbindObservers();
  }

  private bindObservers() {
    this.stylePollTask = setInterval(() => {
      const computedStyle = getComputedStyle(this.element);
      let changedNames: string[] = [];

      for (const styleKey of CanvasEventProcessor.CSS_VARIABLE_NAMES) {
        const styleValue = computedStyle.getPropertyValue(styleKey);

        if (!this.isFirstPollRun) {
          const previousStyleValue = this.lastPolledStyles[styleKey];
          if (previousStyleValue != styleValue)
            changedNames.push(styleKey);
        }

        this.lastPolledStyles[styleKey] = styleValue;
      }

      if (changedNames.length > 0)
        this.consumer.onCSSVariableChange(changedNames);

      this.isFirstPollRun = false;
    }, CanvasEventProcessor.STYLE_POLL_INTERVAL_MS);

    this.sizeObserver = new ResizeObserver(() => {
      this.consumer.onCanvasResize();
    });

    this.sizeObserver.observe(this.element);
  }

  private unbindObservers() {
    this.sizeObserver?.disconnect();

    if (this.stylePollTask) {
      clearInterval(this.stylePollTask);
      this.isFirstPollRun = true;
    }
  }

  private bindInputEvents() {
    this.hammer.on('pinch', e => {
      if (this.pinchCenter == null)
        this.pinchCenter = this.getRelativeCenter(e);

      if (this.lastScaleValue != null && this.lastDeltaX != null && this.lastDeltaY != null) {
        const scaleDelta = (this.lastScaleValue - e.scale) * CanvasEventProcessor.ZOOM_MULTIPLIER;
        const xDelta = (this.lastDeltaX - e.deltaX) * CanvasEventProcessor.PAN_MULTIPLIER;
        const yDelta = (this.lastDeltaY - e.deltaY) * CanvasEventProcessor.PAN_MULTIPLIER;

        this.consumer.onZoom(this.pinchCenter, scaleDelta);
        this.consumer.onPan(this.pinchCenter, xDelta, yDelta);
      }

      this.lastScaleValue = e.scale;
      this.lastDeltaX = e.deltaX;
      this.lastDeltaY = e.deltaY;
    });

    this.hammer.on('pinchend', () => {
      this.lastScaleValue = null;
    });

    this.hammer.on('pan', e => {
      this.consumer.onPointerMove(this.getRelativeCenter(e));
    });

    this.hammer.on('tap', e => {
      this.consumer.onPointerUp(this.getRelativeCenter(e));
    });

    this.bindListener(this.element, "keydown", event => {
      this.consumer.onKeyDown(event as KeyboardEvent);
    });

    this.bindListener(this.element, "keyup", event => {
      this.consumer.onKeyUp(event as KeyboardEvent);
    });

    this.bindListener(this.element, "mousemove", event => {
      this.consumer.onPointerMove({ canvasRelativeX: event.offsetX, canvasRelativeY: event.offsetY });
    });

    this.bindListener(this.element, "mousedown", event => {
      this.consumer.onPointerDown({ canvasRelativeX: event.offsetX, canvasRelativeY: event.offsetY });
    });

    this.bindListener(this.element, "mouseup", event => {
      this.consumer.onPointerUp({ canvasRelativeX: event.offsetX, canvasRelativeY: event.offsetY });
    });

    this.bindListener(this.element, "wheel", event => {
      if (event.ctrlKey) {
        // Zoom, seems like deltaY is used to represent magnitude and direction
        this.consumer.onZoom({ canvasRelativeX: event.offsetX, canvasRelativeY: event.offsetY }, event.deltaY);
      } else {
        // Scroll
        this.consumer.onPan(
          { canvasRelativeX: event.offsetX, canvasRelativeY: event.offsetY },
          event.deltaX, event.deltaY
        );
      }
    });
  }

  private getRelativeCenter(input: HammerInput): PointerPosition {
    const clientRect = this.element.getBoundingClientRect();

    return {
      canvasRelativeX: input.center.x - clientRect.left,
      canvasRelativeY: input.center.y - clientRect.top,
    };
  }

  private bindListener(element: Element, name: string, handler: (event: any) => void) {
    const unbindFunction = this.renderer.listen(element, name, event => {
      event.preventDefault();
      event.stopPropagation();
      handler(event);
    });

    this.subs.sink = { unsubscribe: unbindFunction };
  }

  private static collectCanvasCssVariableNames(): string[] {
    const result: string[] = [];
    const stylesheets = document.styleSheets;

    for (let i = 0; i < stylesheets.length; ++i) {
      const stylesheet = stylesheets.item(i);

      if (stylesheet == null)
        continue;

      if (stylesheet.href != null && !stylesheet.href.startsWith(window.location.origin))
        continue;

      for (let j = 0; j < stylesheet.cssRules.length; ++j) {
        const rule = stylesheet.cssRules.item(j);

        if (rule == null)
          continue;

        if (rule.constructor.name != 'CSSStyleRule')
          continue;

        const ruleStyle = (rule as CSSStyleRule).style;

        for (let k = 0; k < ruleStyle.length; ++k) {
          const styleKey = ruleStyle.item(k);

          if (!styleKey.startsWith('--canvas'))
            continue;

          result.push(styleKey);
        }
      }
    }

    return result;
  }
}