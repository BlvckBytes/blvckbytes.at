import { Component, ComponentRef, OnDestroy, Renderer2, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { KatexOptions, MarkdownComponent } from 'ngx-markdown';
import { NavigationData } from '../../components/navigation/navigation-data.interface';
import { NavigationEntry } from '../../components/navigation/navigation-entry.interface';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { sanitizeForUrl } from '../../utilities';
import { HttpClient } from '@angular/common/http';
import { SubSink } from 'subsink';
import { CanvasWrapperComponent } from '../../components/canvas/canvas-wrapper/canvas-wrapper.component';

type HeadingWithIndex = [HTMLHeadingElement, number];
type HeadingsBySize = { [key: number]: HeadingWithIndex[] };
type TOCNode = { self: HeadingWithIndex, members: TOCNode[] };

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MarkdownComponent, NavigationComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnDestroy {

  katexOptions: KatexOptions = {
    macros: {
      "\\rectangle": "{\\sqsubset \\! \\sqsupset}",
      "\\circled": "{\\raisebox{.5pt}{\\textcircled{\\raisebox{-.9pt} {#1}}}}",
    }
  }

  @ViewChild('markdown', { read: ViewContainerRef }) markdownRef?: ViewContainerRef;

  currentSource = signal<string | null>(null);

  private currentEntry: NavigationEntry | null = null;
  private temporaryScriptTags: HTMLScriptElement[] = []
  private canvasWrappers: ComponentRef<CanvasWrapperComponent>[] = [];
  private subs = new SubSink();

  navigationData = signal<NavigationData | null>(null)

  constructor(
    httpClient: HttpClient,
    private renderer: Renderer2,
  ) {
    this.subs.sink = httpClient
      .get<NavigationData>('/assets/navigation_data.json')
      .subscribe(data => this.navigationData.set(data));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onNavigationEntryClick(entry: NavigationEntry) {
    this.currentEntry = entry;
    this.currentSource.set(entry.src);
  }

  private destroyCanvasWrappers() {
    for (const canvasWrapper of this.canvasWrappers)
      canvasWrapper.destroy();
    this.canvasWrappers = [];
  }

  onMarkdownLoad() {
    if (!this.markdownRef)
      return;

    const markdownElement = this.markdownRef.element.nativeElement;

    this.destroyCanvasWrappers();
    this.patchScriptTags(markdownElement);
    this.patchAnchorTags(markdownElement);
    this.generateMainHeadline(markdownElement);
    this.generateTableOfContents(markdownElement);

    // Generating the table of contents (even without a placeholder element) causes
    // headlines to receive fully qualified IDs to jump to. As these are available at
    // this point and weren't when loading the page, scrolling has to be invoked manually.

    const currentHash = window.location.hash;

    if (currentHash != '') {
      const jumpedToElement = markdownElement.querySelector(window.location.hash);
      jumpedToElement?.scrollIntoView();
    }

    this.attachToCanvases(markdownElement);
  }

  onMarkdownError(message: string | Error) {
    console.error(`Could not load markdown from src "${this.currentSource()}":`);
    console.error(message);
  }

  private attachToCanvases(
    markdownElement: HTMLElement
  ) {
    if (!this.markdownRef)
      return;

    const canvasElements = markdownElement.querySelectorAll('canvas')

    for (let i = 0; i < canvasElements.length; ++i) {
      const canvasElement = canvasElements.item(i);
      const canvasParent = canvasElement.parentElement;

      if (canvasParent == null)
        continue;

      const scriptPath = canvasElement.getAttribute("script")?.trim()

      // Leave other canvases alone, they might be used for something else
      if (scriptPath == null || scriptPath == "")
        continue;

      const canvasWrapper = this.markdownRef.createComponent(CanvasWrapperComponent);

      canvasWrapper.instance.scriptPath = scriptPath;
      canvasWrapper.instance.canvasWidth = canvasElement.getAttribute("width");
      canvasWrapper.instance.canvasClass = canvasElement.getAttribute("class");
      this.tryGetNumericAttribute(canvasElement, "scaling-factor", v => canvasWrapper.instance.scalingFactor = v);
      this.tryGetNumericAttribute(canvasElement, "sharpness", v => canvasWrapper.instance.sharpness = v);

      let targetElement: HTMLElement;

      // Markdown seems to encapsulate the canvas in a paragraph for whatever odd reason
      if (canvasParent.tagName == "P")
        targetElement = canvasParent;
      else
        targetElement = canvasElement;

      const targetParent = targetElement.parentElement!

      this.renderer.insertBefore(targetParent, canvasWrapper.location.nativeElement, targetElement);
      this.renderer.removeChild(targetParent, targetElement);
      this.canvasWrappers.push(canvasWrapper);
    }
  }

  private tryGetNumericAttribute(element: Element, name: string, success: (value: number) => void) {
    const attributeValue = element.getAttribute(name)

    if (attributeValue === null)
      return;

    const numericAttributeValue = parseInt(attributeValue);

    if (isNaN(numericAttributeValue))
      return;

    success(numericAttributeValue);
  }

  private generateTableOfContents(
    markdownElement: HTMLElement
  ) {
    const placeholderElement = markdownElement.querySelector('#toc')

    const childList = Array.from(markdownElement.children);
    const headingSizes = [2, 3, 4, 5, 6];
    const headingsBySize: HeadingsBySize = {}

    for (const headlineSize of headingSizes) {
      const elements = markdownElement.querySelectorAll(`h${headlineSize}`);
      const elementsOfInterest: HeadingWithIndex[] = []

      for (let i = 0; i < elements.length; ++i) {
        const currentElement = elements[i];
        const currentElementIndex = childList.indexOf(currentElement);

        if (currentElementIndex < 0)
          continue;

        elementsOfInterest.push([currentElement as HTMLHeadingElement, currentElementIndex]);
      }

      headingsBySize[headlineSize] = elementsOfInterest;
    }

    const tocNodes = this.collectTOCNodes(headingsBySize, headingSizes, placeholderElement);
    const tocElement = this.renderTOCNodes(tocNodes);

    // Skip at this point, as rendering will cause all of these headlines to receive IDs
    // which are required to jump by href-hashes
    if (!placeholderElement)
      return;

    markdownElement.insertBefore(tocElement, placeholderElement.nextSibling);
  }

  private renderTOCNodes(tocNodes: TOCNode[]): Element {
    const wrapperElement = document.createElement('div');
    wrapperElement.className = "md-toc";
    this.renderTOCNodesAnchors(wrapperElement, tocNodes);

    return wrapperElement;
  }

  private renderTOCNodesAnchors(
    container: Element,
    tocNodes: TOCNode[],
    indentLevel: number = 0,
    predecessorElements: HTMLHeadingElement[] = []
  ) {
    const currentUrl = new URL(window.location.href);

    for (let i = 0; i < tocNodes.length; ++i) {
      const node = tocNodes[i];
      const element = node.self[0];
      const currentPredecessorElements = [...predecessorElements, element];

      let anchorId = element.id;

      if (!anchorId) {
        const qualifierList = [...predecessorElements, element];
        anchorId = qualifierList.map(element => sanitizeForUrl(element.innerText)).join("_");
        element.id = anchorId;
      }

      currentUrl.hash = anchorId;
      const href = currentUrl.toString();

      const anchorElement = document.createElement("a");

      anchorElement.className = `md-toc__link md-toc__link--indent-level-${indentLevel}`;
      anchorElement.href = href;
      anchorElement.innerText = element.innerText;

      container.appendChild(anchorElement);

      this.renderTOCNodesAnchors(container, node.members, indentLevel + 1, currentPredecessorElements);
    }
  }
  
  private collectTOCNodes(
    headingsBySize: HeadingsBySize,
    headingSizes: number[],
    ignoredElement: Element | null,
    sizeIndex: number = 0,
    minIndex: number = 0,
    maxIndex: number | null = null,
  ): TOCNode[] {
    if (sizeIndex == headingSizes.length - 1)
      return [];

    const targetHeadings = headingsBySize[headingSizes[sizeIndex]];
    const result: TOCNode[] = [];

    for (let i = 0; i < targetHeadings.length; ++i) {
      const currentHeading = targetHeadings[i];

      if (currentHeading[0] == ignoredElement)
        continue;

      const currentHeadingIndex = currentHeading[1];

      if (currentHeadingIndex < minIndex || (maxIndex != null && currentHeadingIndex > maxIndex))
        continue;

      const nextHeading = i == targetHeadings.length - 1 ? null : targetHeadings[i + 1];

      const memberNodes = this.collectTOCNodes(
        headingsBySize, headingSizes,
        ignoredElement,
        sizeIndex + 1, currentHeading[1], nextHeading?.[1] || null,
      );

      result.push({
        self: currentHeading,
        members: memberNodes,
      } as TOCNode);
    }

    return result
  }

  private generateMainHeadline(markdownElement: HTMLElement) {
    if (!this.currentEntry || this.currentEntry.doNotGenerateHeadline)
      return;

    const headlineElement = document.createElement("h1");
    headlineElement.innerText = this.currentEntry.title;

    const firstChild = markdownElement.firstChild;

    if (firstChild)
      markdownElement.insertBefore(headlineElement, firstChild);
  }

  private patchAnchorTags(markdownElement: HTMLElement) {
    const anchorTags = markdownElement.querySelectorAll("a");
    const currentPathName = window.location.pathname
    const currentHostName = window.location.hostname

    for (let i = 0; i < anchorTags.length; ++i) {
      const anchorTag = anchorTags[i];

      try {
        const anchorUrl = new URL(anchorTag.href);

        if (anchorUrl.hostname != currentHostName)
          continue;

        // Rewrite pathname to current path name if the anchor was relative
        if (anchorUrl.pathname == '/') {
          anchorUrl.pathname = currentPathName
          anchorTag.href = anchorUrl.toString()
        }
      }
      
      // TypeError for URL-constructor if the href is blank, mailto, etc.
      catch(error) {
        continue
      }
    }
  }

  private patchScriptTags(markdownElement: HTMLElement) {
    /*
      Script tags within markdown don't seem to execute, something odd happens to them...

      Even after moving the script tag instance into the head, it still doesn't load. That's
      why a fresh carbon-copy is created, which is then injected into the dom temporarily.
    */

    for (const temporaryScriptTag of this.temporaryScriptTags)
      document.head.removeChild(temporaryScriptTag);

    this.temporaryScriptTags = [];

    const scriptTags = markdownElement.querySelectorAll("script");

    for (let i = 0; i < scriptTags.length; ++i) {
      const scriptTag = scriptTags[i];

      const newScriptTag = document.createElement("script");
      newScriptTag.type = "text/javascript";
      
      if (scriptTag.src)
        newScriptTag.src = scriptTag.src;
      else
        newScriptTag.innerText = scriptTag.innerText;

      scriptTag.parentElement?.removeChild(scriptTag);
    }
  }
}
