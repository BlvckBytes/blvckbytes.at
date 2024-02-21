import { AfterViewInit, Component, ComponentRef, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, Renderer2, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ButtonHandle, Canvas, ControlRegistry, SliderHandle, TexRendererOptions } from 'canvas-draw';
import { CanvasSliderComponent } from '../canvas-slider/canvas-slider.component';
import { CanvasButtonComponent } from '../canvas-button/canvas-button.component';
import { HammerModule } from '@angular/platform-browser';
import { CanvasEventProcessor } from './canvas-event-processor.class';
import { TexRenderer } from 'canvas-draw/dist/types/tex-renderer.interface';
import { MarkdownService } from 'ngx-markdown';

export type CanvasScriptLoader = () => Promise<void>;

@Component({
  selector: 'app-canvas-wrapper',
  standalone: true,
  imports: [HammerModule],
  templateUrl: './canvas-wrapper.component.html',
  styleUrl: './canvas-wrapper.component.scss'
})
export class CanvasWrapperComponent implements OnDestroy, AfterViewInit, ControlRegistry, TexRenderer {

  @Input() scriptPath: string | null = null;
  @Input() scalingFactor: number = 10;
  @Input() sharpness: number = window.devicePixelRatio;

  @HostBinding('style.width')
  @Input() canvasWidth: string | null = null;

  // This is not ideal, but classes attached to the canvas should only contain a width anyways
  @HostBinding('class')
  @Input() canvasClass: string | null = null;

  @Output() loaderEmitter = new EventEmitter<CanvasScriptLoader>();

  @ViewChild('canvas', { read: ElementRef }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('controlsContainer', { read: ViewContainerRef }) controlsContainer!: ViewContainerRef;

  private temporaryScriptTags: HTMLScriptElement[] = [];
  private controlComponents: ComponentRef<any>[] = [];

  private canvas: Canvas | null = null;
  private eventProcessor: CanvasEventProcessor | null = null;

  constructor(
    private renderer: Renderer2,
    private markdownService: MarkdownService,
  ) {}

  ngAfterViewInit(): void {
    if (this.scriptPath === null)
      return;

    const canvasElement = this.canvasRef.nativeElement;

    this.loaderEmitter.emit(async () => {
      window.LastLoadedDrawingFactory = null;

      await this.loadJSFile(this.scriptPath!!);
      const drawingFactory = window.LastLoadedDrawingFactory;

      if (drawingFactory == null)
        throw `Script ${this.scriptPath} did not set the drawing factory`;

      this.canvas = new Canvas(this, drawingFactory, this, canvasElement, this.scalingFactor, this.sharpness);
      this.eventProcessor = new CanvasEventProcessor(this.canvas, canvasElement, this.renderer);
      this.eventProcessor.bind();
      this.canvas.start();
    });
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

  renderTexExpressionToImageDataUrl(expression: string, options?: TexRendererOptions | undefined): string {
    const container = document.createElement("div");
    container.innerText = expression;
    this.markdownService.render(container, { katex: true });

    const mathMLContainer = container.querySelector(".katex-mathml")

    if (!mathMLContainer)
      return this.makeForeignContentSvg("color: red", "<p>Error</p>");

    let fontSize = options?.fontSize

    if (fontSize == null) {
      const fontSizeString = this.canvasRef ? getComputedStyle(this.canvasRef.nativeElement).fontSize : "16px";
      fontSize = parseFloat(fontSizeString.substring(0, fontSizeString.length - 2));
    }

    let styleString = (
      `width: max-content;` +
      `font-size: ${fontSize}px;` +
      `padding: ${options?.paddingTop || 0}px ${options?.paddingRight || 0}px ${options?.paddingBottom || 0}px ${options?.paddingLeft || 0}px;`
    );

    if (options?.color)
      styleString += `color: ${options.color};`;

    if (options?.backgroundColor)
      styleString += `background-color: ${options.backgroundColor};`;

    return this.makeForeignContentSvg(styleString, mathMLContainer.innerHTML);
  }

  private makeForeignContentSvg(style: string, content: string): string {
    return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="1000px" height="1000px">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="${style}">${content}</div>
      </foreignObject>
      </svg>
    `
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
