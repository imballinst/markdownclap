import { useStore } from '@nanostores/solid';
import { createSignal } from 'solid-js';
import { marked } from 'marked';

import { MarkdownEditor } from './MarkdownEditor';
import { drawerStatusStore } from '../../store/drawer';
import './index.css';

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

export default function EntryEditor() {
  const isDrawerOpen = useStore(drawerStatusStore);
  const [markdown, setMarkdown] = createSignal(DEFAULT_STRING);

  return (
    <div class="editor">
      <div class="editor-segment">
        <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
      </div>
      <div class="editor-segment">
        <div class="mt-10">
          <pre class="markdown-result" innerHTML={marked(markdown())} />
        </div>
      </div>
    </div>
  );
}
