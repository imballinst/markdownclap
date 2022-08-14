import { useStore } from '@nanostores/solid';

import MarkdownEditor from './MarkdownEditor';
import SidebarEditor from './SidebarEditor';
import './index.scss';
import { editorStore } from '../../store/editor';
import { createEffect } from 'solid-js';

export default function EntryEditor() {
  const editor = useStore(editorStore);

  createEffect(() => {
    console.info(editor().isSidebarOpen, editor().elementType);
  });

  return (
    <div class="editor">
      <div class="editor-segment">
        <MarkdownEditor />
      </div>
      <div
        class="editor-segment"
        style={{ display: editor().isSidebarOpen ? 'flex' : 'none' }}
      >
        <SidebarEditor />
      </div>
    </div>
  );
}
