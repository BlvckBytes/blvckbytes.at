import { AfterViewInit, Component, ComponentRef, ElementRef, HostBinding, Input, OnDestroy, Renderer2, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ButtonHandle, Canvas, ControlRegistry, SliderHandle } from 'canvas-draw';
import { CanvasSliderComponent } from '../canvas-slider/canvas-slider.component';
import { CanvasButtonComponent } from '../canvas-button/canvas-button.component';
import { HammerModule } from '@angular/platform-browser';
import { CanvasEventProcessor } from './canvas-event-processor.class';

@Component({
  selector: 'app-canvas-wrapper',
  standalone: true,
  imports: [HammerModule],
  templateUrl: './canvas-wrapper.component.html',
  styleUrl: './canvas-wrapper.component.scss'
})
export class CanvasWrapperComponent implements OnDestroy, AfterViewInit, ControlRegistry {

  @Input() scriptPath: string | null = null;
  @Input() scalingFactor: number = 10;
  @Input() sharpness: number = window.devicePixelRatio;

  @HostBinding('style.width')
  @Input() canvasWidth: string | null = null;

  // This is not ideal, but classes attached to the canvas should only contain a width anyways
  @HostBinding('class')
  @Input() canvasClass: string | null = null;

  @ViewChild('canvas', { read: ElementRef }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('controlsContainer', { read: ViewContainerRef }) controlsContainer!: ViewContainerRef;

  private temporaryScriptTags: HTMLScriptElement[] = [];
  private controlComponents: ComponentRef<any>[] = [];

  private canvas: Canvas | null = null;
  private eventProcessor: CanvasEventProcessor | null = null;

  constructor(
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    if (this.scriptPath === null)
      return;

    const canvasElement = this.canvasRef.nativeElement;

    window.LastLoadedDrawingFactory = null;

    this.loadJSFile(this.scriptPath)
      .then(() => {
        const drawingFactory = window.LastLoadedDrawingFactory;

        if (drawingFactory != null) {
          this.canvas = new Canvas(this, drawingFactory, canvasElement, this.scalingFactor, this.sharpness);
          this.eventProcessor = new CanvasEventProcessor(this.canvas, canvasElement, this.renderer);
          this.eventProcessor.bind();
          this.canvas.start();
        }
      })
      .catch(error => console.error(error));
  }

  ngOnDestroy(): void {
    this.canvas?.stop();
    this.eventProcessor?.unbind();

    for (const controlComponent of this.controlComponents)
      controlComponent.destroy();
    this.controlComponents = [];

    this.deleteTemporaryScriptTags();
  }

  registerButton(
    onSetup: (button: ButtonHandle) => void,
    onClick: (button: ButtonHandle) => void,
  ): ButtonHandle {
    const component = this.createAndRegisterControl(CanvasButtonComponent);
    component.clickCallback = () => onClick(component);
    onSetup(component);
    return component;
  }

  registerSlider(
    onSetup: (button: SliderHandle) => void,
    onChange: (button: SliderHandle) => void,
  ): SliderHandle {
    const component = this.createAndRegisterControl(CanvasSliderComponent);
    component.updateCallback = () => onChange(component);
    onSetup(component);
    return component;
  }

  private createAndRegisterControl<C>(component: Type<C>): C {
    const control = this.controlsContainer.createComponent(component);

    this.controlsContainer.insert(control.hostView);
    this.controlComponents.push(control);

    return control.instance;
  }

  private loadJSFile(src: string): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
      const scriptTag = this.createTemporaryScriptTag();

      scriptTag.addEventListener("load", () => {
        resolve(scriptTag);
      });

      scriptTag.addEventListener("error", error => {
        reject(error);
      });

      scriptTag.src = src;
    });
  }

  private deleteTemporaryScriptTags() {
    for (const temporaryScriptTag of this.temporaryScriptTags)
      document.head.removeChild(temporaryScriptTag);

    this.temporaryScriptTags = [];
  }

  private createTemporaryScriptTag(): HTMLScriptElement {
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    document.head.appendChild(scriptTag);
    this.temporaryScriptTags.push(scriptTag);
    return scriptTag;
  }
}
