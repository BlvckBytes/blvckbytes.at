import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderHandle } from 'canvas-draw';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-canvas-slider',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './canvas-slider.component.html',
  styleUrl: './canvas-slider.component.scss'
})
export class CanvasSliderComponent implements SliderHandle, AfterViewChecked {

  @Input() updateCallback: (() => void) | null = null;

  @ViewChild('textElement', { read: ElementRef }) textElement?: ElementRef<HTMLDivElement>;

  private isTextDirty = false;

  min = 1;
  max = 1;
  value = 1;
  step = 1;
  text = "Slider";

  constructor(
    private markdownService: MarkdownService,
  ) {}

  ngAfterViewChecked(): void {
    if (this.isTextDirty) {
      if (this.textElement) {
        const virtualParagraph = document.createElement("p");
        virtualParagraph.innerHTML = this.text;

        this.markdownService.render(virtualParagraph, { katex: true });
        this.textElement.nativeElement.innerHTML = virtualParagraph.innerHTML;
      }

      this.isTextDirty = false;
    }
  }

  setStep(step: number): SliderHandle {
    this.step = step;
    return this;
  }

  setValue(value: number): SliderHandle {

    if (value < this.min) {
      this.value = this.min;
      this.onSliderChange();
    } else if (value > this.max) {
      this.value = this.max;
      this.onSliderChange();
    } else {
      this.value = value;
    }

    return this;
  }

  getValue(): number {
    return this.value;
  }

  setMinMax(min: number, max: number): SliderHandle {
    this.min = min;
    this.max = max;

    if (this.value < min)
      this.value = min;

    if (this.value > max)
      this.value = max;

    return this;
  }

  setText(text: string): SliderHandle {
    this.text = text;
    this.isTextDirty = true;
    return this;
  }

  onSliderChange() {
    if (this.updateCallback)
      this.updateCallback();
  }

  onFirstClick() {
    this.setValue(this.min);
    this.onSliderChange();
  }

  onPreviousClick() {
    this.setValue(this.value - this.step);
    this.onSliderChange();
  }

  onNextClick() {
    this.setValue(this.value + this.step);
    this.onSliderChange();
  }

  onLastClick() {
    this.setValue(this.max);
    this.onSliderChange();
  }
}
