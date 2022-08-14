import { useStore } from '@nanostores/solid';

import { editorStore } from '../../store/editor';

export default function SidebarEditor() {
  const editor = useStore(editorStore);

  return (
    <div
      style={{
        display: editor().isSidebarOpen ? 'flex' : 'none',
        width: '50%'
      }}
    >
      test
    </div>
  );
}
