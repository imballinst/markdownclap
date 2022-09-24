import { createEffect, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { JSX } from 'solid-js/jsx-runtime';
import { setAlert } from '../../../../store/alert';
import { patchInspectContent, setInspectStatus, InspectStatus } from '../../../../store/inspect';
import { ParsedTableResult, getTableRawContent } from '../../../../utils/operators/table';
import { HeaderButton } from './HeaderButton';

const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';

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

  function onArrowKeyPress(elementId: string, code: string) {
    let [row, col] = elementId
      .slice('grid-cell-'.length)
      .split('-')
      .map((str) => Number(str));

    if (code === ARROW_UP_KEY) {
      row--;
    } else if (code === ARROW_DOWN_KEY) {
      row++;
    } else if (code === ARROW_LEFT_KEY) {
      col--;
    } else if (code === ARROW_RIGHT_KEY) {
      col++;
    }

    const nextElement = document.getElementById(
      `grid-cell-${row}-${col}`
    ) as HTMLInputElement | null;
    if (nextElement) {
      nextElement.focus();
    }
  }

  const onInputKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (e) => {
    if (
      (e.currentTarget.selectionStart === 0 &&
        (e.code === ARROW_UP_KEY || e.code === ARROW_LEFT_KEY)) ||
      (e.currentTarget.selectionStart === e.currentTarget.value.length &&
        (e.code === ARROW_DOWN_KEY || e.code === ARROW_RIGHT_KEY))
    ) {
      e.preventDefault();

      onArrowKeyPress(e.currentTarget.id, e.code);
    }
  };

  return (
    <div>
      <button
        class="button-sm"
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
      </button>

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
