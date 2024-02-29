import { Component, ComponentRef, OnDestroy, Renderer2, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { KatexOptions, MarkdownComponent } from 'ngx-markdown';
import { NavigationData } from '../../components/navigation/navigation-data.interface';
import { NavigationEntry } from '../../components/navigation/navigation-entry.interface';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { sanitizeForUrl } from '../../utilities';
import { HttpClient } from '@angular/common/http';
import { SubSink } from 'subsink';
import { CanvasScriptLoader, CanvasWrapperComponent } from '../../components/canvas/canvas-wrapper/canvas-wrapper.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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

  private static COLLAPSIBLE_HEADLINE_CLASS = "collapsible";
  private static COLLAPSIBLE_HEADLINE_CLASS_EXPANDED = "collapsible--expanded";
  private static COLLAPSIBLE_CONTAINER_CLASS = "collapsible-container";
  private static COLLAPSIBLE_CONTAINER_CLASS_EXPANDED = "collapsible-container--expanded";
  private static IMAGE_DEACTIVATED_SRC_ATTRIBUTE = "x-src";
  private static TOC_IGNORE_CLASS = "toc-ignore";
  private static HIGHLIGHTED_PARAGRAPH_CLASS = "highlighted-paragraph";
  private static HIGHLIGHTED_PARAGRAPH_MARKER_CLASS = `${MainPageComponent.HIGHLIGHTED_PARAGRAPH_CLASS}__marker`;
  private static HEADLINE_CLASS = "markdown-headline";
  private static HEADLINE_CLASS_ACTIVE = "markdown-headline--active";
  private static HEADLINE_CLASS_TO_TOP = "markdown-headline__to-top";
  private static HEADLINE_CLASS_TO_BOTTOM = "markdown-headline__to-bottom";

  private static PARAGRAPH_HIGHLIGHT_MARKER_CLASSES: { [key: string]: string } = {
    'TODO: ': `${MainPageComponent.HIGHLIGHTED_PARAGRAPH_CLASS}--todo`,
    'WARNING: ': `${MainPageComponent.HIGHLIGHTED_PARAGRAPH_CLASS}--warning`,
    'INFO: ': `${MainPageComponent.HIGHLIGHTED_PARAGRAPH_CLASS}--info`,
  };

  katexOptions: KatexOptions = {
    macros: {
      "\\rectangle": "{\\sqsubset \\! \\sqsupset}",
      "\\circled": "{\\raisebox{.5pt}{\\textcircled{\\raisebox{-.9pt} {#1}}}}",
    }
  }

  @ViewChild('markdown', { read: ViewContainerRef }) markdownRef?: ViewContainerRef;

  currentData = signal<string | null>(null);
  currentError = signal<string | null>(null);

  private currentEntry: NavigationEntry | null = null;
  private temporaryScriptTags: HTMLScriptElement[] = []
  private canvasWrappers: ComponentRef<CanvasWrapperComponent>[] = [];
  private subs = new SubSink();
  private queuedCanvasScriptLoaders: CanvasScriptLoader[] = [];

  navigationData = signal<NavigationData | null>(null)

  constructor(
    httpClient: HttpClient,
    private renderer: Renderer2,
    router: Router
  ) {
    this.subs.sink = httpClient
      .get<NavigationData>('/assets/navigation_data.json')
      .subscribe(data => this.navigationData.set(data));

    this.subs.sink = router.events
      .pipe(filter((event: any): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(_ => {
        const markdownElement = this.markdownRef?.element?.nativeElement;

        if (!markdownElement)
          return;

        const hash = window.location.hash;

        if (hash == '') {
          this.onHashJump(null);
          return;
        }

        this.onHashJump(markdownElement.querySelector(window.location.hash) || null);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onNavigationEntryClick(entry: NavigationEntry) {
    this.currentEntry = entry;
    this.fetchCurrentEntryContent();
  }

  private fetchCurrentEntryContent() {
    if (this.currentEntry == null)
      return;

    this.currentData.set(null);

    const url = window.location.origin + this.currentEntry.src;
    const request = new XMLHttpRequest();

    request.ontimeout = () => {
      this.currentError.set(`The request to ${url} timed out`);
    };

    request.onerror = () => {
      this.currentError.set(`An internal error occurred while requesting ${url}`);
    };

    request.onload = () => {
      if (request.status != 200) {
        this.currentError.set(`Received non-200 status-code ${request.status} while requesting ${url}`);
        return;
      }

      const contentType = request.getResponseHeader("Content-Type");

      // This is especially useful while the custom CMS is not yet in place, as angular (.htaccess or
      // ng serve) just responds with the index.html for non-existing resource requests, which most
      // definitely shouldn't be rendered within the markdown container.
      if (contentType != 'text/markdown') {
        this.currentError.set(`Received non-markdown content-type ${contentType} while requesting ${url}`);
        return;
      }

      this.currentError.set(null);
      this.currentData.set(request.responseText);
    };

    this.subs.sink = {
      unsubscribe() {
        request.ontimeout = null;
        request.onerror = null;
        request.onload = null;
      }
    };

    request.open('GET', url, true);
    request.send(null);
  }

  private destroyCanvasWrappers() {
    for (const canvasWrapper of this.canvasWrappers)
      canvasWrapper.destroy();
    this.canvasWrappers = [];
  }

  onMarkdownReady() {
    if (!this.markdownRef)
      return;

    const markdownElement = this.markdownRef.element.nativeElement;

    this.destroyCanvasWrappers();
    this.patchScriptTags(markdownElement);
    this.patchAnchorTags(markdownElement);
    this.generateMainHeadline(markdownElement);
    this.generateTableOfContentsAndCollapsibles(markdownElement);
    this.addParagraphHighlighting(markdownElement);
    this.attachHeadlineButtons(markdownElement);

    // Generating the table of contents (even without a placeholder element) causes
    // headlines to receive fully qualified IDs to jump to. As these are available at
    // this point and weren't when loading the page, scrolling has to be invoked manually.

    const currentHash = window.location.hash;

    if (currentHash != '') {
      const jumpedToElement = markdownElement.querySelector(window.location.hash);

      if (jumpedToElement) {
        jumpedToElement.scrollIntoView();
        this.onHashJump(jumpedToElement);
      }

      else
        this.onHashJump(null);
    }

    this.attachToCanvases(markdownElement);
  }

  private onHashJump(element: Element | null) {
    const markdownElement = this.markdownRef?.element?.nativeElement;

    if (!markdownElement)
      return;

    const headlines = markdownElement.querySelectorAll("." +  MainPageComponent.HEADLINE_CLASS);

    for (let i = 0; i < headlines.length; ++i) {
      const headline: Element = headlines.item(i);

      if (headline == element)
        headline.classList.add(MainPageComponent.HEADLINE_CLASS_ACTIVE);
      else
        headline.classList.remove(MainPageComponent.HEADLINE_CLASS_ACTIVE);
    }
  }

  onMarkdownError(message: string | Error) {
    console.error(`Could not render markdown: ${message}`);
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

      this.subs.sink = canvasWrapper.instance.loaderEmitter.subscribe(loader => {
        this.queuedCanvasScriptLoaders.push(loader);

        if (this.queuedCanvasScriptLoaders.length == 1)
          this.executeCanvasScriptLoader(loader);
      });

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

  private executeCanvasScriptLoader(loader: CanvasScriptLoader) {
    loader()
      .catch(error => console.error(error))
      .finally(() => {
        this.queuedCanvasScriptLoaders.splice(0, 1);

        if (this.queuedCanvasScriptLoaders.length > 0)
          this.executeCanvasScriptLoader(this.queuedCanvasScriptLoaders[0]);
      });
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

  private generateTableOfContentsAndCollapsibles(
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

    const collapsibleContainedImages: HTMLImageElement[] = [];
    this.generateCollapsibles(markdownElement, tocNodes, collapsibleContainedImages);

    const markdownImages = markdownElement.querySelectorAll("img");

    // Restore all images which are not contained within a collapsible to allow them getting rendered
    for (let markdownImageIndex = 0; markdownImageIndex < markdownImages.length; ++markdownImageIndex) {
      const markdownImage = markdownImages[markdownImageIndex];

      if (collapsibleContainedImages.includes(markdownImage))
        continue;

      this.restoreSourceAttributeIfApplicable(markdownImage);
    }

    // Skip at this point, as rendering will cause all of these headlines to receive IDs
    // which are required to jump by href-hashes
    if (!placeholderElement)
      return;

    markdownElement.insertBefore(tocElement, placeholderElement.nextSibling);
  }

  private generateCollapsibles(
    markdownElement: Element,
    tocNodes: TOCNode[],
    collapsibleContainedImages: HTMLImageElement[],
  ) {
    for (let tocNodeIndex = 0; tocNodeIndex < tocNodes.length; ++tocNodeIndex) {
      const currentTocNode = tocNodes[tocNodeIndex];
      const nextTocNode = tocNodeIndex == tocNodes.length - 1 ? null : tocNodes[tocNodeIndex + 1];
      this.generateCollapsiblesSub(markdownElement, currentTocNode, nextTocNode, collapsibleContainedImages);
    }
  }

  private generateCollapsiblesSub(
    markdownElement: Element,
    currentNode: TOCNode,
    nextSibling: TOCNode | null,
    collapsibleContainedImages: HTMLImageElement[],
  ) {
    this.generateCollapsibles(markdownElement, currentNode.members, collapsibleContainedImages);

    const currentElement = currentNode.self[0]

    if (!currentElement.classList.contains(MainPageComponent.COLLAPSIBLE_HEADLINE_CLASS))
      return;

    const childList = Array.from(markdownElement.children);
    const currentElementIndex = childList.indexOf(currentElement);

    if (currentElementIndex < 0) {
      console.error(`Could not determine index of ${currentElement} within child list`);
      return;
    }

    const nextSiblingIndex = nextSibling == null ? null : childList.indexOf(nextSibling.self[0]);
    const lastContainedElementIndex = nextSiblingIndex == null ? childList.length - 1 : nextSiblingIndex - 1;

    const collapsibleContainer = document.createElement("div");
    collapsibleContainer.className = MainPageComponent.COLLAPSIBLE_CONTAINER_CLASS;
    markdownElement.insertBefore(collapsibleContainer, currentElement.nextSibling);

    // Empty collapsible, nothing to move
    if (lastContainedElementIndex == currentElementIndex)
      return;

    let lastMovedElement: Element | null = null;

    const currentContainedImages: HTMLImageElement[] = [];

    // Iterate backwards as the childList is modified while being iterated
    for (let movedElementIndex = lastContainedElementIndex; movedElementIndex > currentElementIndex; --movedElementIndex) {
      const movedElement = childList[movedElementIndex];

      this.walkChildrenAndAppendImageElements(movedElement, currentContainedImages);

      markdownElement.removeChild(movedElement);
      collapsibleContainer.insertBefore(movedElement, lastMovedElement);
      lastMovedElement = movedElement;
    }

    this.attachCollapsibleClickListener(currentElement, collapsibleContainer, currentContainedImages);
    collapsibleContainedImages.push(...currentContainedImages);
  }

  private walkChildrenAndAppendImageElements(element: Element, list: HTMLImageElement[]) {
    if (element.tagName == "IMG" && element.hasAttribute(MainPageComponent.IMAGE_DEACTIVATED_SRC_ATTRIBUTE))
      list.push(element as HTMLImageElement);

    const children = element.children;
    for (let childIndex = 0; childIndex < children.length; ++childIndex) {
      const child = children.item(childIndex);

      if (child != null)
        this.walkChildrenAndAppendImageElements(child, list);
    }
  }

  private restoreSourceAttributeIfApplicable(element: HTMLImageElement) {
    const sourceValue = element.getAttribute(MainPageComponent.IMAGE_DEACTIVATED_SRC_ATTRIBUTE);

    if (sourceValue == null)
      return;

    element.removeAttribute(MainPageComponent.IMAGE_DEACTIVATED_SRC_ATTRIBUTE);
    element.setAttribute("src", sourceValue);
  }

  private attachCollapsibleClickListener(
    headlineElement: Element,
    collapsibleContainer: Element,
    containedImages: HTMLImageElement[],
  ) {
    let isFirstExpansion = true;
    let isCollapsed = true;

    const unlistenFunction = this.renderer.listen(headlineElement, 'click', () => {
      isCollapsed = !isCollapsed;

      if (isCollapsed) {
        headlineElement.classList.remove(MainPageComponent.COLLAPSIBLE_HEADLINE_CLASS_EXPANDED);
        collapsibleContainer.classList.remove(MainPageComponent.COLLAPSIBLE_CONTAINER_CLASS_EXPANDED);
      } else {
        if (isFirstExpansion) {
          for (const containedImage of containedImages)
            this.restoreSourceAttributeIfApplicable(containedImage);
        }

        headlineElement.classList.add(MainPageComponent.COLLAPSIBLE_HEADLINE_CLASS_EXPANDED);
        collapsibleContainer.classList.add(MainPageComponent.COLLAPSIBLE_CONTAINER_CLASS_EXPANDED);
        isFirstExpansion = false;
      }
    });

    this.subs.sink = { unsubscribe: unlistenFunction };
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

      // Skip ignored headlines from being rendered as an anchor tag, and don't assign a
      // qualified ID to it, as it should never be jumped to anyways
      if (element.classList.contains(MainPageComponent.TOC_IGNORE_CLASS))
        continue;

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

  private addParagraphHighlighting(markdownElement: HTMLElement) {
    const paragraphs = markdownElement.querySelectorAll("p");

    for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; ++paragraphIndex) {
      const paragraph = paragraphs[paragraphIndex];
      const paragraphContent = paragraph.innerHTML;

      for (const highlightMarker in MainPageComponent.PARAGRAPH_HIGHLIGHT_MARKER_CLASSES) {
        if (!paragraphContent.startsWith(highlightMarker))
          continue;

        const highlightClass = MainPageComponent.PARAGRAPH_HIGHLIGHT_MARKER_CLASSES[highlightMarker];

        paragraph.classList.add(MainPageComponent.HIGHLIGHTED_PARAGRAPH_CLASS);
        paragraph.classList.add(highlightClass);

        paragraph.innerHTML = (
          `<span class="${MainPageComponent.HIGHLIGHTED_PARAGRAPH_MARKER_CLASS}">${highlightMarker}</span>` +
          paragraph.innerHTML.substring(highlightMarker.length)
        );

        break;
      }
    }
  }

  private onPageJumpButtonClick(toTop: boolean) {
    if (toTop) {
      window.scrollTo(0, 0);
      history.replaceState("", document.title, window.location.pathname + window.location.search);
    }
    else {
      window.scrollTo(0, document.body.scrollHeight);
      history.replaceState("", document.title, window.location.pathname + window.location.search);
    }

    this.onHashJump(null);
  }

  private attachHeadlineButtons(markdownElement: HTMLElement) {
    const toTopButtons = markdownElement.querySelectorAll("." + MainPageComponent.HEADLINE_CLASS_TO_TOP);
    const toBottomButtons = markdownElement.querySelectorAll("." + MainPageComponent.HEADLINE_CLASS_TO_BOTTOM);

    for (let i = 0; i < toTopButtons.length; ++i)
      this.subs.sink = { unsubscribe: this.renderer.listen(toTopButtons.item(i), 'click', () => this.onPageJumpButtonClick(true)) };

    for (let i = 0; i < toBottomButtons.length; ++i)
      this.subs.sink = { unsubscribe: this.renderer.listen(toBottomButtons.item(i), 'click', () => this.onPageJumpButtonClick(false)) };
  }
}
