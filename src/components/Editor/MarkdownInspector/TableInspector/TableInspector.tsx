import { createEffect, For } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';
import { JSX } from 'solid-js/jsx-runtime';
import { setAlert } from '../../../../store/alert';
import { patchInspectContent, setInspectStatus, InspectStatus } from '../../../../store/inspect';
import {
  ParsedTableResult,
  getTableRawContent,
  ParsedColumn
} from '../../../../utils/operators/table';
import { HeaderButton } from './HeaderButton';
import { Button } from '../../../Button';

const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';

const BACKSPACE_KEY = 'Backspace';

export function TableInspector({ result }: { result: ParsedTableResult | undefined }) {
  if (result === undefined) {
    return null;
  }

  const [headers, setHeaders] = createStore(result.content.headers);
  const [rows, setRows] = createStore(result.content.rows);
  createEffect(() => {
    if (!result) return;
    setHeaders(result.content.headers);
    setRows(result.content.rows);
  });

  const onInputKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (e) => {
    const [row, col] = e.currentTarget.id
      .slice('grid-cell-'.length)
      .split('-')
      .map((str) => Number(str));

    if (
      (e.currentTarget.selectionStart === 0 &&
        (e.code === ARROW_UP_KEY || e.code === ARROW_LEFT_KEY)) ||
      (e.currentTarget.selectionStart === e.currentTarget.value.length &&
        (e.code === ARROW_DOWN_KEY || e.code === ARROW_RIGHT_KEY))
    ) {
      e.preventDefault();

      navigateCell({ row, col, code: e.code });
    } else if (e.code === BACKSPACE_KEY) {
      deleteRowIfEmpty({ setRows, row, col });
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          const content = {
            rows,
            headers,
            separators: result.content.separators
          };

          patchInspectContent({
            content: content,
            rawContent: getTableRawContent(content)
          });
          setInspectStatus(InspectStatus.PreviewingMarkdown);
          setAlert({ message: 'Successfully applied changes.', type: 'info' });
        }}
      >
        Save Changes
      </Button>

      <table class="sidebar-table">
        <thead>
          <tr>
            {headers.map((_, index) => (
              <th class="action-header-column">
                <HeaderButton columnIndex={index} headers={headers} />
              </th>
            ))}
          </tr>
          <tr>
            {headers.map((header, index) => (
              <th>
                <input
                  value={header.content}
                  id={`grid-cell-0-${index}`}
                  onKeyDown={onInputKeyDown}
                  onChange={(e) => {
                    setHeaders((prev) => {
                      const newHeaders = [...prev];
                      newHeaders[index] = {
                        ...prev[index],
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
          {
            <For each={rows} fallback={<div>Loading...</div>}>
              {(row, rowIndex) => {
                const columns = (
                  <For each={row} fallback={<div>Loading...</div>}>
                    {(column, columnIndex) => (
                      <td>
                        <input
                          value={column.content}
                          id={`grid-cell-${rowIndex() + 1}-${columnIndex()}`}
                          onKeyDown={onInputKeyDown}
                          onChange={(e) => {
                            setRows(rowIndex(), columnIndex(), 'content', e.currentTarget.value);
                          }}
                        />
                      </td>
                    )}
                  </For>
                );

                return <tr>{columns}</tr>;
              }}
            </For>
          }
        </tbody>
      </table>
    </div>
  );
}

// Helper functions.
function deleteRowIfEmpty({
  setRows,
  row,
  col
}: {
  setRows: SetStoreFunction<ParsedColumn[][]>;
  row: number;
  col: number;
}) {
  if (col > 0) return;

  // This is because the row in the ID starts from 1 for table body.
  // The row with ID 0 is reserved for table headers.
  const rowIdx = row - 1;
  setRows((prev) => {
    // TODO: still need fixingin this part.
    const length = prev[rowIdx].length;
    const isRowEmpty = new Array(length).every((_, idx) => {
      const html = document.getElementById(`grid-cell-${row}-${idx}`) as HTMLInputElement | null;
      return html?.value === '';
    });
    console.info(prev[rowIdx], isRowEmpty);
    if (!isRowEmpty) return prev;

    const newRows = [...prev];
    newRows.splice(rowIdx, 1);
    return newRows;
  });
}

function navigateCell({ code, row, col }: { code: string; row: number; col: number }) {
  switch (code) {
    case ARROW_UP_KEY: {
      row--;
      break;
    }
    case ARROW_DOWN_KEY: {
      row++;
      break;
    }
    case ARROW_LEFT_KEY: {
      col--;
      break;
    }
    case ARROW_RIGHT_KEY: {
      col++;
      break;
    }
  }

  const nextElement = document.getElementById(`grid-cell-${row}-${col}`) as HTMLInputElement | null;
  if (nextElement) {
    nextElement.focus();
  }
}
