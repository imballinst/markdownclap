import { useStore } from '@nanostores/solid';
// import { marked } from 'marked';
import { createSignal, Show } from 'solid-js';
import { editorStore, updateSidebarTable } from '../../store/editor';
import { getTableRawContent, ParsedTableResult } from '../../utils/md-parser';

import './SidebarEditor.css';

export default function SidebarEditor() {
  const editor = useStore(editorStore);

  return (
    <>
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

  const [content, setContent] = createSignal(result.content);

  return (
    <div>
      <button
        onClick={() => {
          updateSidebarTable({
            content: content(),
            rawContent: getTableRawContent(content())
          });
        }}
      >
        Save
      </button>

      <table>
        <thead>
          <tr>
            {content().headers.map((header, index) => (
              <th>
                <input
                  value={header.content}
                  onChange={(e) => {
                    setContent((prev) => {
                      const newHeaders = [...prev.headers];
                      newHeaders[index] = {
                        ...prev.headers[index],
                        content: e.currentTarget.value
                      };

                      return { ...prev, headers: newHeaders };
                    });
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content().rows.map((row, rowIndex) => {
            const columns = row.map((column, columnIndex) => (
              <td>
                <input
                  value={column.content}
                  onChange={(e) => {
                    setContent((prev) => {
                      const newRows = [...prev.rows];
                      const newRow = [...newRows[rowIndex]];
                      newRow[columnIndex] = {
                        ...newRow[columnIndex],
                        content: e.currentTarget.value
                      };
                      newRows[rowIndex] = newRow;

                      return { ...prev, rows: newRows };
                    });
                  }}
                />
              </td>
            ));

            return <tr>{columns}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}
