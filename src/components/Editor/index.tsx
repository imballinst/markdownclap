import { useStore } from '@nanostores/solid';

import { MarkdownEditor } from './MarkdownEditor';
import { SidebarEditor } from './SidebarEditor';
import './index.css';
import { drawerStatusStore } from '../../store/drawer';

export default function EntryEditor() {
  const isDrawerOpen = useStore(drawerStatusStore);

  return (
    <div class="editor">
      <div class="editor-segment">
        <MarkdownEditor />
      </div>
      <div
        class="editor-segment"
        style={{
          display: isDrawerOpen() ? 'flex' : 'none'
        }}
      >
        <SidebarEditor />
      </div>
    </div>
  );
}
