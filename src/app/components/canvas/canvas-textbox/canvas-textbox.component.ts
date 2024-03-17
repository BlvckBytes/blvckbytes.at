import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TextboxHandle } from 'canvas-draw/dist/types/controls/textbox-handle.interface';
import { MarkdownService } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-canvas-textbox',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './canvas-textbox.component.html',
  styleUrl: './canvas-textbox.component.scss'
})
export class CanvasTextboxComponent implements TextboxHandle, AfterViewChecked {

  @Input() updateCallback: (() => void) | null = null;

  invalidityMessage: string | null = null;

  @ViewChild('textElement', { read: ElementRef }) textElement?: ElementRef<HTMLDivElement>;

  private isTextDirty = false;

  text = "Textbox";
  value = "";
  placeholder = "";

  private debounceTimeMs = 0;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private markdownService: MarkdownService,
  ) {}

  setDebounceTime(timeMs: number): TextboxHandle {
    this.debounceTimeMs = timeMs;
    return this;
  }

  getDebounceTime(): number {
    return this.debounceTimeMs;
  }

  setPlaceholder(placeholder: string): TextboxHandle {
    this.placeholder = placeholder;
    return this;
  }

  getPlaceholder(): string {
    return this.placeholder;
  }

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

  setText(text: string): TextboxHandle {
    this.text = text;
    this.isTextDirty = true;
    return this;
  }

  setValue(value: string): TextboxHandle {
    this.value = value;
    return this;
  }

  getValue(): string {
    return this.value;
  }

  setInvalidityMessage(message: string | null): TextboxHandle {
    this.invalidityMessage = message;
    return this;
  }

  isValid(): boolean {
    return this.invalidityMessage == null;
  }

  onValueChange() {
    if (!this.updateCallback)
      return;

    if (this.debounceTimeMs == 0) {
      this.updateCallback();
      return;
    }

    if (this.debounceTimer != null)
      clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;

      if (this.updateCallback)
        this.updateCallback();
    }, this.debounceTimeMs);
  }
}
