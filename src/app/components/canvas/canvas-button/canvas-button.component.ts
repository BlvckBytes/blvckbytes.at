import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ButtonHandle } from 'canvas-draw';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-canvas-button',
  standalone: true,
  imports: [],
  templateUrl: './canvas-button.component.html',
  styleUrl: './canvas-button.component.scss'
})
export class CanvasButtonComponent implements ButtonHandle, AfterViewChecked {

  @Input() clickCallback: (() => void) | null = null;

  @ViewChild('text', { read: ElementRef }) textElement?: ElementRef<HTMLDivElement>;

  private isTextDirty = false;

  active = false;
  text = "";

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

  setActive(state: boolean): ButtonHandle {
    this.active = state;
    return this;
  }

  isActive(): boolean {
    return this.active;
  }

  setText(text: string): ButtonHandle {
    this.text = text;
    this.isTextDirty = true;
    return this;
  }

  onClick() {
    if (this.clickCallback)
      this.clickCallback();
  }
}
