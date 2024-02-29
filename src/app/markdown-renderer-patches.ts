import { MarkedRenderer } from 'ngx-markdown';

const makeHeadline = (
  text: string,
  level: number,
  id: string | null = null,
  classes: string[] = [],
): string => {
  const idString = id == null ? "" : `id=${id}`;
  const classString = `class="markdown-headline ${classes.join(' ')}"`;

  const memberString = level <= 1 ? "" : (
    `<img class="markdown-headline__to-top" src="/assets/icons/arrow-up.svg"/>` +
    `<img class="markdown-headline__to-bottom" src="/assets/icons/arrow-up.svg"/>`
  );

  return `<h${level} ${idString} ${classString}>${text}${memberString}</h${level}>`
}

const deactivateImageSource = (tag: string): string => {
  const srcAttributeStartMarker = "src=\"";
  const srcAttributeStartMarkerLength = srcAttributeStartMarker.length;
  const srcAttributeStartMarkerIndex = tag.indexOf(srcAttributeStartMarker);

  if (srcAttributeStartMarkerIndex < 0)
    return tag;

  const srcAttributeEndMarkerIndex = tag.indexOf("\"", srcAttributeStartMarkerIndex + srcAttributeStartMarkerLength);

  if (srcAttributeEndMarkerIndex < 0)
    return tag;

  return (
    tag.substring(0, srcAttributeStartMarkerIndex) +
    "x-" + tag.substring(srcAttributeStartMarkerIndex, srcAttributeEndMarkerIndex + 1) +
    " src=\"about:blank\"" +
    tag.substring(srcAttributeEndMarkerIndex + 1)
  );
}

const customRendererFactory = (): MarkedRenderer => {
  const renderer = new MarkedRenderer();

  const originalHtmlRenderer = renderer.html;
  renderer.html = (html: string, block?: boolean): string => {
    let result = originalHtmlRenderer(html, block);

    if (result.startsWith('<img'))
      result = deactivateImageSource(result);

    return result;
  };

  const originalImageRenderer = renderer.image;
  renderer.image = (href: string, title: string | null, text: string): string => {
    return deactivateImageSource(originalImageRenderer(href, title, text));
  };

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
    let customClasses: string[] = [];

    for (const metaInfoArgument of metaInfoArguments) {
      if (metaInfoArgument.startsWith('#')) {
        customId = metaInfoArgument.substring(1);
        continue;
      }

      if (metaInfoArgument.startsWith('.')) {
        customClasses.push(metaInfoArgument.substring(1));
        continue;
      }

      console.error(`Don't know how to process the headline meta info argument ${metaInfoArgument}`);
    }

    const headlineText = text.substring(0, metaInfoBeginMarkerIndex);
    return makeHeadline(headlineText, level, customId, customClasses);
  }

  return renderer;
}

export const patchedRenderer = customRendererFactory();