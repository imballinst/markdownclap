import { useStore } from '@nanostores/solid';
import { inspectContentStore } from '../../../store/inspect';
import { TableInspector } from './TableInspector';

import './MarkdownInspector.css';

export function MarkdownInspector() {
  const inspectContent = useStore(inspectContentStore);

  return (
    <div class="markdown-inspector">
      <TableInspector result={inspectContent()} />
    </div>
  );
}
