import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { ButtonHandle } from 'canvas-draw';

@Component({
  selector: 'app-canvas-button',
  standalone: true,
  imports: [],
  templateUrl: './canvas-button.component.html',
  styleUrl: './canvas-button.component.scss'
})
export class CanvasButtonComponent implements ButtonHandle {

  @Input() clickCallback: (() => void) | null = null;

  active = false;
  text = "";

  setActive(state: boolean): ButtonHandle {
    this.active = state;
    return this;
  }

  isActive(): boolean {
    return this.active;
  }

  setText(text: string): ButtonHandle {
    this.text = text;
    return this;
  }

  onClick() {
    if (this.clickCallback)
      this.clickCallback();
  }
}
