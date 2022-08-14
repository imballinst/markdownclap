import { createSignal, JSX } from 'solid-js';
import { marked } from 'marked';

import { editorStore, openEditorSidebar } from '../../store/editor';
import './MarkdownEditor.scss';
import { useStore } from '@nanostores/solid';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = createSignal('');
  const editor = useStore(editorStore);

  const onKeyDown: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyDown'] =
    (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        setMarkdown((prev) => prev + '  ');
      }
    };

  return (
    <div
      style={{
        width: editor().isSidebarOpen ? '50%' : '100%'
      }}
    >
      <button onClick={() => openEditorSidebar('table')}>
        Open in sidebar
      </button>
      <textarea
        class="markdown-editor"
        value={markdown()}
        onKeyDown={onKeyDown}
        onInput={(e) => {
          setMarkdown(e.currentTarget.value ?? '');
        }}
      />
      <pre innerHTML={marked(markdown())} />
    </div>
  );
};

export default MarkdownEditor;

// Helper functions.
