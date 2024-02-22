import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-canvas-inline-container',
  standalone: true,
  imports: [],
  templateUrl: './canvas-inline-container.component.html',
  styleUrl: './canvas-inline-container.component.scss'
})
export class CanvasInlineContainerComponent implements OnDestroy, AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef }) container?: ViewContainerRef;

  private controlComponents: ComponentRef<any>[] = [];
  private insertionQueue: ComponentRef<any>[] = [];

  constructor(
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    for (const controlComponent of this.controlComponents)
      controlComponent.destroy();
    this.controlComponents = [];
  }

  ngAfterViewInit(): void {
    for (const queuedInsertion of this.insertionQueue)
      this.insertComponent(queuedInsertion);
    this.insertionQueue = [];
    this.cdRef.detectChanges();
  }

  insertComponent(component: ComponentRef<any>) {
    if (!this.container) {
      this.insertionQueue.push(component);
      return;
    }

    this.controlComponents.push(component);
    this.container.insert(component.hostView);
  }
}
