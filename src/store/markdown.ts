import { atom } from 'nanostores';

// Markdown content.
const DEFAULT_STRING = `
|No|Name|Description|
|-|-|-|
|1|hehe|this is a sample description 1|
|2|hehe|this is a sample description 2|
|3|hehe|this is a sample description 3|
|4|hehe|this is a sample description 4|
|5|hehe|this is a sample description 5|
|6|hehe|this is a sample description 6|
|7|hehe|this is a sample description 7|
|8|hehe|this is a sample description 8|
|9|hehe|this is a sample description 9|
|10|hehe|this is a sample description 10|
|11|hehe|this is a sample description 11|

Sample paragraph
`.trim();

export const markdownStore = atom<string>(DEFAULT_STRING);

export function setMarkdown(newMarkdown: string | ((prev: string) => string)) {
  const prev = markdownStore.get();
  markdownStore.set(typeof newMarkdown === 'function' ? newMarkdown(prev) : newMarkdown);
}
