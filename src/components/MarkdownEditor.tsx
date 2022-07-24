import { createSignal, onCleanup, onMount } from 'solid-js';
import { marked } from 'marked';

import { monaco } from '../utils/CustomMonaco.js';

const str = marked('## Hello');

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = createSignal('');
  let container: monaco.editor.IStandaloneCodeEditor;

  onMount(() => {
    container = monaco.editor.create(document.getElementById('container')!, {
      value: '',
      language: 'markdown'
    });
    container.getModel()?.onDidChangeContent((e) => {
      const str = container.getModel()?.getValue() || '';
      setMarkdown(marked(str));
    });
  });

  onCleanup(() => {
    container.dispose();
  });

  return (
    <div>
      <div id="container" style={{ height: `400px` }} />
      <pre innerHTML={markdown()} />
    </div>
  );
};

export default MarkdownEditor;
