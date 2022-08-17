import { useStore } from '@nanostores/solid';
import { marked } from 'marked';
import { Show } from 'solid-js';
import { editorStore } from '../../store/editor';
import { ParsedTableResult } from '../../utils/md-parser';

import './SidebarEditor.css';

export default function SidebarEditor() {
  const editor = useStore(editorStore);

  return (
    <>
      <div>Result</div>
      <div
        class="sidebar-editor-result"
        innerHTML={marked(editor().sidebarContent?.rawContent || '')}
      />

      <Show when={editor().sidebarContent !== undefined}>
        <Table result={editor().sidebarContent} />
      </Show>
    </>
  );
}

// Composing functions.
function Table({ result }: { result: ParsedTableResult | undefined }) {
  if (result === undefined) {
    return null;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            {result.content.headers.map((header) => (
              <th>
                <input value={header} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.content.rows.map((row) => {
            const columns = row.map((column) => (
              <td>
                <input value={column} />
              </td>
            ));

            return <tr>{columns}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}
