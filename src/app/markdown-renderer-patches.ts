import { MarkedRenderer } from 'ngx-markdown';

(window as any)["markdownScrollToTop"] = () => {
  window.scrollTo(0, 0);
  history.replaceState("", document.title, window.location.pathname + window.location.search);
};

(window as any)["markdownScrollToBottom"] = () => {
  window.scrollTo(0, document.body.scrollHeight);
  history.replaceState("", document.title, window.location.pathname + window.location.search);
};

const makeHeadline = (text: string, level: number, id: string | null = null): string => {
  const idString = id == null ? "" : `id=${id}`;
  const memberString = level <= 1 ? "" : (
    `<img class="markdown-headline__to-top" src="/assets/icons/arrow-up.svg" onclick="markdownScrollToTop()"/>` +
    `<img class="markdown-headline__to-bottom" src="/assets/icons/arrow-up.svg" onclick="markdownScrollToBottom()"/>`
  );
  return `<h${level} class="markdown-headline" ${idString}>${text}${memberString}</h${level}>`
}

const customRendererFactory = (): MarkedRenderer => {
  const renderer = new MarkedRenderer();

  renderer.heading = (text: string, level: number, raw: string): string => {
    const metaInfoBeginMarker = ' {:';
    const metaInfoBeginMarkerIndex = text.indexOf(metaInfoBeginMarker);

    if (metaInfoBeginMarkerIndex < 0)
      return makeHeadline(text, level);

    const metaInfoEndMarker = '}';
    const metaInfoEndMarkerIndex = text.indexOf(metaInfoEndMarker, metaInfoBeginMarkerIndex + metaInfoBeginMarker.length);

    if (metaInfoEndMarkerIndex < 0)
      return makeHeadline(text, level);

    const metaInfoString = text.substring(
      metaInfoBeginMarkerIndex + metaInfoBeginMarker.length,
      metaInfoEndMarkerIndex
    ).trim();

    const metaInfoArguments = metaInfoString.split(" ");
    let customId: string | null = null;

    for (const metaInfoArgument of metaInfoArguments) {
      if (metaInfoArgument.startsWith('#')) {
        customId = metaInfoArgument.substring(1);
        continue;
      }

      console.error(`Don't know how to process the headline meta info argument ${metaInfoArgument}`);
    }

    const headlineText = text.substring(0, metaInfoBeginMarkerIndex);
    return makeHeadline(headlineText, level, customId);
  }

  return renderer;
}

export const patchedRenderer = customRendererFactory();