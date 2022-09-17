import { useStore } from '@nanostores/solid';
import { createEffect, createSignal, For, JSX, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Portal } from 'solid-js/web';
import { setAlert } from '../../store/alert';
import {
  alterTable,
  ColumnContentType,
  inspectContentStore,
  InspectStatus,
  patchInspectContent,
  setInspectStatus
} from '../../store/inspect';
import {
  getTableRawContent,
  ParsedColumn,
  ParsedStringResult,
  ParsedTableResult
} from '../../utils/operators/table';

import './MarkdownInspector.css';

const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';

export function MarkdownInspector() {
  const inspectContent = useStore(inspectContentStore);

  return (
    <div class="markdown-inspector">
      <Table result={inspectContent()} />
    </div>
  );
}

// Composing functions.
function Table({ result }: { result: ParsedTableResult | undefined }) {
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
                            setRows((rows) => rows[rowIndex()][columnIndex()]);
                            // setRows((prev) => {
                            //   const newRows = [...prev];
                            //   const newRow = [...newRows[rowIndex()]];
                            //   newRow[columnIndex()] = {
                            //     ...newRow[columnIndex()],
                            //     content: e.currentTarget.value
                            //   };
                            //   newRows[rowIndex()] = newRow;

                            //   return newRows;
                            // });
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

type PopoverStyleState = Pick<JSX.CSSProperties, 'left' | 'top'>;

type ColumnActionsType =
  | 'add-column-before'
  | 'add-column-after'
  | 'delete-column'
  | 'swap-column'
  | 'fill-column';

interface HeaderButtonProps {
  columnIndex: number;
  headers: ParsedColumn[];
}

export function HeaderButton({ columnIndex, headers }: HeaderButtonProps) {
  const [popoverStyle, setPopoverStyle] = createSignal<PopoverStyleState>({
    left: '0px',
    top: '0px'
  });
  const [isPopoverShown, setIsPopoverShown] = createSignal(false);
  const [columnAction, setColumnAction] = createSignal<ColumnActionsType>('add-column-after');

  const headersLength = headers.length;
  const onSubmit: JSX.DOMAttributes<HTMLFormElement>['onSubmit'] = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as ColumnActionsType;
    const actionPayload = formData.get('actionPayload');

    switch (type) {
      case 'add-column-after':
      case 'add-column-before':
      case 'fill-column': {
        alterTable({
          type,
          payload: {
            columnIndex,
            columnContentType: actionPayload as ColumnContentType
          }
        });

        break;
      }
      case 'swap-column': {
        alterTable({
          type,
          payload: {
            columnIndex,
            targetColumnIndex: Number(actionPayload)
          }
        });

        break;
      }
      case 'delete-column': {
        alterTable({
          type,
          payload: {
            columnIndex
          }
        });
      }
    }

    setIsPopoverShown(false);
  };

  // Implementation especially for the WAI-ARIA thingy is heavily inspired by https://mui.com/material-ui/react-popover/.
  return (
    <>
      <button
        type="button"
        class="secondary-button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPopoverStyle({ left: `${rect.left}px`, top: `${rect.top + rect.height}px` });
          setIsPopoverShown(true);
        }}
      >
        Actions
      </button>

      <Show when={isPopoverShown()}>
        <Portal>
          <div role="presentation" class="popover-root">
            <div
              aria-hidden="true"
              class="popover-backdrop"
              onClick={() => {
                setIsPopoverShown(false);
              }}
            />
            <div tabIndex={-1} class="popover-dropdown" style={popoverStyle()}>
              <form onSubmit={onSubmit}>
                <div class="flex flex-col mb-2">
                  <label for="popoverColumnAction" class="text-xs">
                    Select column action
                  </label>
                  <select
                    class="text-xs"
                    name="type"
                    id="popoverColumnAction"
                    onInput={(e) => {
                      setColumnAction(e.currentTarget.value as ColumnActionsType);
                    }}
                  >
                    <option class="text-xs" value="add-column-before">
                      Add column before
                    </option>
                    <option class="text-xs" value="add-column-after">
                      Add column after
                    </option>
                    <option class="text-xs" value="fill-column">
                      Fill column
                    </option>
                    <option class="text-xs" value="swap-column" disabled={headersLength === 1}>
                      Swap column
                    </option>
                    <option class="text-xs" value="delete-column" disabled={headersLength === 1}>
                      Delete column
                    </option>
                  </select>
                </div>

                <Show
                  when={
                    columnAction() === 'add-column-after' ||
                    columnAction() === 'add-column-before' ||
                    columnAction() === 'fill-column'
                  }
                >
                  <div class="flex flex-col mb-2">
                    <label for="popoverColumnOperationPayload" class="text-xs">
                      Column type
                    </label>
                    <select id="popoverColumnOperationPayload" name="actionPayload" class="text-xs">
                      <option class="text-xs" value="ordered-number">
                        Ordered number
                      </option>
                      <option class="text-xs" value="add-column-before">
                        String
                      </option>
                    </select>
                  </div>
                </Show>

                <Show when={columnAction() === 'swap-column'}>
                  <div class="flex flex-col mb-2">
                    <label for="popoverSwapPayload" class="text-xs">
                      Column to swap
                    </label>
                    <select id="popoverSwapPayload" class="text-xs" name="actionPayload">
                      {headers.map((header, headerIdx) => {
                        if (headerIdx === columnIndex) {
                          return null;
                        }

                        return (
                          <option class="text-xs" value={headerIdx}>
                            {header.content.trim()}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </Show>

                <button type="submit" class="secondary-button text-xs">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}

// Helper function.
function getNewContent(
  content: NonNullable<ParsedStringResult>['content'],
  columnIndex: number,
  getColumnContent: (rowIndex: number) => string
): NonNullable<ParsedStringResult>['content'] {
  let newRows = content.rows || [];
  newRows = newRows.map((columns, index) => {
    const newColumns: ParsedColumn[] = [...columns];
    newColumns[columnIndex] = {
      ...newColumns[columnIndex],
      content: getColumnContent(index)
    };
    return newColumns;
  });

  return {
    headers: content.headers,
    separators: content.separators,
    rows: newRows
  };
}
