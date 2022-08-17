import { useStore } from '@nanostores/solid';

import MarkdownEditor from './MarkdownEditor';
import SidebarEditor from './SidebarEditor';
import './index.scss';
import { editorStore } from '../../store/editor';

export default function EntryEditor() {
  const editor = useStore(editorStore);

  return (
    <div class="editor">
      <div class="editor-segment">
        <MarkdownEditor />
      </div>
      <div
        class="editor-segment"
        style={{
          display: editor().sidebarContent !== undefined ? 'flex' : 'none'
        }}
      >
        <SidebarEditor />
      </div>
    </div>
  );
}
