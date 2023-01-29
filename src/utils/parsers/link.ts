import { marked } from 'marked';

export interface ParseMarkdownLinkResult {
  text: string;
  url: string;
}

export enum ParseMarkdownLinkErrorCode {
  INVALID_ELEMENTS
}

export class ParseMarkdownLinkError extends Error {
  code: number;

  constructor(code: number) {
    super('error when parsing markdown text');

    this.code = code;
  }
}

export function parseMarkdownLink(selection: string): ParseMarkdownLinkResult {
  const result: ParseMarkdownLinkResult = {
    text: '',
    url: ''
  };

  if (selection === '') {
    return result;
  }

  const html = marked(selection).trim();
  const el = document.createElement('div');
  el.innerHTML = html;

  const supposedlyParagraph = el.childNodes.item(0) as HTMLElement;
  const paragraphChildLength = supposedlyParagraph.childNodes.length;

  if (paragraphChildLength > 1) {
    throw new ParseMarkdownLinkError(ParseMarkdownLinkErrorCode.INVALID_ELEMENTS);
  }

  const nodeName = supposedlyParagraph.firstChild?.nodeName;
  switch (nodeName) {
    case '#text': {
      // Node is a textless href, or a simple text.
      const isValidURL = isURL(supposedlyParagraph.innerText);

      if (isValidURL) {
        result.url = supposedlyParagraph.innerText;
      } else {
        result.text = supposedlyParagraph.innerText;
      }

      break;
    }
    case 'A': {
      // Node is an anchor tag with text.
      const anchorTag = supposedlyParagraph.firstChild as HTMLAnchorElement;
      const textContent = anchorTag.childNodes.item(0) as Text;
      const textValue = textContent.nodeValue || '';
      
      result.text = trimTrailingSlash(textValue) === trimTrailingSlash(anchorTag.href) ? '' : textValue;
      result.url = anchorTag.href;

      break;
    }
  }

  // Trim trailing slash, if any, and if it's not contained in the original result.
  if (result.url.endsWith('/') && !selection.includes(result.url)) {
    result.url = trimTrailingSlash(result.url)
  }

  return result;
}

export function parseUrl(selection: string, urlString = ''): string | undefined {
  const url = isURL(urlString);
  if (!url) return undefined;

  // If there are no selection, return the URL string directly.
  if (selection === '') return urlString;
  // If there are selection, then return the Markdown URL + text.
  return `[${selection}](${urlString})`;
}

// Helper functions.
function isURL(urlString: string) {
  let url: URL | undefined;
  try {
    url = new URL(urlString);
  } catch (err) {
    // No-op.
  }

  return url !== undefined;
}

function trimTrailingSlash(urlString: string) {
  // Trim trailing slash, if any, and if it's not contained in the original result.
  if (urlString.endsWith('/')) return urlString.slice(0, -1);
  return urlString
}