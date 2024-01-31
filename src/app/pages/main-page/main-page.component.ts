import { Component, ViewChild, signal } from '@angular/core';
import { KatexOptions, MarkdownComponent } from 'ngx-markdown';
import { NavigationData } from '../../components/navigation/navigation-data.interface';
import { NavigationEntry } from '../../components/navigation/navigation-entry.interface';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { sanitizeForUrl } from '../../utilities';

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
export class MainPageComponent {

  katexOptions: KatexOptions = {
    macros: {
      "\\rectangle": '{\\sqsubset \\! \\sqsupset}',
    }
  }

  @ViewChild('markdown') markdownComponent?: MarkdownComponent;

  currentSource = signal<string | null>(null);

  private currentEntry: NavigationEntry | null = null;
  private temporaryScriptTags: HTMLScriptElement[] = []

  navigationData: NavigationData = {
    topLevelEntries: [
      { title: 'Home', src: '/assets/markdown/home.md', doNotGenerateHeadline: true },
      { title: 'About Me', src: '/assets/markdown/about_me.md' },
    ],
    categories: [
      {
        title: 'Math',
        entries: [
          { "title": "Personal Goal", src: "/assets/markdown/math/personal_goal.md" },
          { "title": "DIN A Paper Sizes", src: "/assets/markdown/math/din_a_paper_sizes.md" },
          { "title": "Binomial Expansion", src: "/assets/markdown/math/binomial_expansion.md" },
          { "title": "Pythagorean Theorem", src: "/assets/markdown/math/pythagorean_theorem.md" },
          { "title": "Truncated Cone Volume", src: "/assets/markdown/math/truncated_cone_volume.md" },
          { "title": "Euclids Theorem Of Sides", src: "/assets/markdown/math/euclids_theorem_of_sides.md" },
          { "title": "Archimedes' Pi Approximation", src: "/assets/markdown/math/archimedes_pi_approximation.md" },
          { "title": "Roman Numerals", src: "/assets/markdown/math/roman_numerals.md" },
          { "title": "Orthogonal Circles", src: "/assets/markdown/math/orthogonal_circles.md" },
          { "title": "Triangles", src: "/assets/markdown/math/triangles.md" },
          { "title": "Angles", src: "/assets/markdown/math/angles.md" },
          { "title": "Thales' Half Circle Theorem", src: "/assets/markdown/math/thales_half_circle_theorem.md" },
          { "title": "Trigonometric Functions", src: "/assets/markdown/math/trigonometric_functions.md" },
          { "title": "Triangle-Line Intersection Theorem", src: "/assets/markdown/math/triangle_line_intersection_theorem.md" },
          { "title": "Triangles Parallelograms Base Relations", src: "/assets/markdown/math/triangles_parallelograms_base_relations.md" },
          { "title": "Triangle Angle-Bisection Theorem", src: "/assets/markdown/math/triangle_angle_bisection_theorem.md" },
          { "title": "Construction", src: "/assets/markdown/math/construction.md" },
          { "title": "Circle Circle Intersection", src: "/assets/markdown/math/circle_circle_intersection.md" },
          { "title": "Shifted Radian Measurement", src: "/assets/markdown/math/shifted_radian_measurement.md" },
          { "title": "Rules Of Divisibility", src: "/assets/markdown/math/rules_of_divisibility.md" },
          { "title": "Loan Interests", src: "/assets/markdown/math/loan_interests.md" },
          { "title": "Shortest Path Between Two Points", src: "/assets/markdown/math/shortest_path_between_two_points.md" },
        ],
      },
      {
        title: 'Puzzles',
        entries: [
          { "title": "Three Circles In A Square", src: "/assets/markdown/puzzles/three_circles_in_a_square.md" },
          { "title": "Circle Sectors Intersect In A Square", src: "/assets/markdown/puzzles/circle_sectors_intersect_in_a_square.md" },
          { "title": "Circle In Rectangle With Tangent Lines", src: "/assets/markdown/puzzles/circle_in_rectangle_with_tangent_lines.md" },
          { "title": "Isosceles Triangle Slices Percentage", src: "/assets/markdown/puzzles/isosceles_triangle_slices_percentage.md" },
        ],
      },
      {
        title: 'Philosophy',
        entries: [
          { "title": "Chained To A Madman", src: "/assets/markdown/philosophy/chained_to_a_madman.md" },
          { "title": "The Ultimate Schematic", src: "/assets/markdown/philosophy/the_ultimate_schematic.md" },
          { "title": "The Agonizing Reach For Greatness", src: "/assets/markdown/philosophy/the_agonizing_reach_for_greatness.md" },
          { "title": "No Man Is An Island", src: "/assets/markdown/philosophy/no_man_is_an_island.md" },
          { "title": "The Nature Of Thinking", src: "/assets/markdown/philosophy/the_nature_of_thinking.md" },
          { "title": "The Lens Of Approximation", src: "/assets/markdown/philosophy/the_lens_of_approximation.md" },
        ],
      },
      {
        title: 'Engineering',
        entries: [
          { "title": "Minified URL-Safe UUIDs", src: "/assets/markdown/engineering/minified_url_safe_uuids.md" },
          { "title": "Customizable Tool Wall", src: "/assets/markdown/engineering/customizable_tool_wall.md" },
          { "title": "SLA PCB Exposure", src: "/assets/markdown/engineering/sla_pcb_exposure.md" },
        ],
      }
    ]
  };

  onNavigationEntryClick(entry: NavigationEntry) {
    this.currentEntry = entry;
    this.currentSource.set(entry.src);
  }

  onMarkdownLoad() {
    if (!this.markdownComponent)
      return;

    const markdownElement = this.markdownComponent.element.nativeElement;

    this.patchScriptTags(markdownElement);
    this.patchAnchorTags(markdownElement);
    this.generateMainHeadline(markdownElement);
    this.generateTableOfContents(markdownElement);

    // Generating the table of contents (even without a placeholder element) causes
    // headlines to receive fully qualified IDs to jump to. As these are available at
    // this point and weren't when loading the page, scrolling has to be invoked manually.
    const jumpedToElement = markdownElement.querySelector(window.location.hash)
    jumpedToElement?.scrollIntoView();
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
      document.head.appendChild(newScriptTag);
      this.temporaryScriptTags.push(newScriptTag);
    }
  }
}
