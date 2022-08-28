import { useStore } from '@nanostores/solid';
import { createEffect, createSignal, JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { alterTable, ColumnContentType, editorStore, updateSidebarTable } from '../../store/editor';
import {
  getTableRawContent,
  ParsedColumn,
  ParsedStringResult,
  ParsedTableResult
} from '../../utils/operators/table';

import './SidebarEditor.css';

export function SidebarEditor() {
  const editor = useStore(editorStore);

  return (
    <div class="sidebar-editor">
      <Show when={editor().sidebarContent !== undefined}>
        <Table result={editor().sidebarContent} />
      </Show>
    </div>
  );
}

// Composing functions.
function Table({ result }: { result: ParsedTableResult | undefined }) {
  if (result === undefined) {
    return null;
  }

  const [content, setContent] = createSignal(result.content);
  const editor = useStore(editorStore);
  createEffect(() => {
    const sidebarContent = editor().sidebarContent;
    if (!sidebarContent) return;

    setContent(sidebarContent.content);
  });

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

      <table class="sidebar-table">
        <thead>
          <tr>
            {content().headers.map((_, index) => (
              <th class="action-header-column">
                <HeaderButton columnIndex={index} headers={content().headers} />
              </th>
            ))}
          </tr>
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

interface PopoverStyleState {
  top: `${number}px`;
  left: `${number}px`;
}

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
        class="header-button"
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
                <div class="flex flex-col">
                  <label class="text-xs">Select column action</label>
                  <select
                    class="text-xs"
                    name="type"
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
                      Move column
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
                  <div class="flex flex-col">
                    <label class="text-xs">Column type</label>
                    <select name="actionPayload" class="text-xs">
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
                  <div class="flex flex-col">
                    <label class="text-xs">Column to swap</label>
                    <select class="text-xs" name="actionPayload">
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

                <button type="submit" class="text-xs">
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
