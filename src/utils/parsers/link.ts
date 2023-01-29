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

  const html = marked(selection);
  const el = document.createElement('div');
  el.innerHTML = html;

  const childLength = el.childNodes.length;
  if (childLength > 1) {
    throw new ParseMarkdownLinkError(ParseMarkdownLinkErrorCode.INVALID_ELEMENTS);
  }

  const nodeName = el.firstChild?.nodeName;
  switch (nodeName) {
    case '#text': {
      // Node is a textless href, or a simple text.
      const isValidURL = isURL(el.innerText);

      if (isValidURL) {
        result.url = el.innerText;
      } else {
        result.text = el.innerText;
      }

      break;
    }
    case 'A': {
      // Node is an anchor tag with text.
      const anchorTag = el.firstChild as HTMLAnchorElement;
      const textContent = anchorTag.childNodes.item(0) as Text;

      result.text = textContent.nodeValue || '';
      result.url = anchorTag.href;

      break;
    }
  }

  // Trim trailing slash, if any, and if it's not contained in the original result.
  if (result.url.endsWith('/') && !selection.includes(result.url)) {
    result.url = result.url.slice(0, -1);
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

function isURL(urlString: string) {
  let url: URL | undefined;
  try {
    url = new URL(urlString);
  } catch (err) {
    // No-op.
  }

  return url !== undefined;
}
