import { createEffect, For, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
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
import { isCtrlOrCmdKey } from '../../../../utils/key-parser';
import { getToolbarHoverText } from '../../Toolbar/common';

const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';

const BACKSPACE_KEY = 'Backspace';
const ENTER_KEY = 'Enter';

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

  // When mount, set focus to the input element.
  onMount(() => {
    focusElementIfExists(createTableColumnId(0, 0));
  });

  const onSaveChanges = () => {
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
  };

  const onNonUpdatingKeydown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (e) => {
    // This is a function that only affects keys that normally do not update an input.
    // For example, arrow keys.
    const { colIdx, rowIdx } = parseTableColumnId(e.currentTarget.id);

    if (
      (e.currentTarget.selectionStart === 0 &&
        (e.key === ARROW_UP_KEY || e.key === ARROW_LEFT_KEY)) ||
      (e.currentTarget.selectionStart === e.currentTarget.value.length &&
        (e.key === ARROW_DOWN_KEY || e.key === ARROW_RIGHT_KEY))
    ) {
      e.preventDefault();

      navigateCell({ rowIdx, colIdx, key: e.key });
    } else if (e.key === BACKSPACE_KEY) {
      const { shouldPreventEvent, deletedRowIdx, nextFocusedElementId } = deleteRowIfEmpty({
        rows,
        rowIdx,
        colIdx
      });

      // Prevent default to prevent deleting the key in the next "focused" input.
      if (shouldPreventEvent) e.preventDefault();
      // Delete the row, if the row is empty.
      if (deletedRowIdx) {
        setRows((prev) => {
          const newRows = [...prev];
          newRows.splice(deletedRowIdx, 1);
          return newRows;
        });
      }
      // Set a new element to focus, if the row is deleted.
      if (nextFocusedElementId) focusElementIfExists(nextFocusedElementId);
    } else if (e.key === ENTER_KEY) {
      const isMetaKey = isCtrlOrCmdKey(e);
      if (isMetaKey) {
        // Save changes.
        onSaveChanges();
      } else {
        // Create a new row, using the previous cell's `post` and `pre` value, to be consistent.
        const nextRowIdx = rowIdx + 1;
        setRows((prev) =>
          prev
            .slice(0, nextRowIdx)
            .concat([
              Array.from(new Array(prev[rowIdx].length), () => ({
                content: '',
                post: prev[rowIdx][colIdx].post,
                pre: prev[rowIdx][colIdx].pre
              }))
            ])
            .concat(prev.slice(nextRowIdx))
        );
        focusElementIfExists(createTableColumnId(nextRowIdx, colIdx));
      }
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        size="sm"
        onClick={onSaveChanges}
        title={getToolbarHoverText({ keys: ['Enter'] })}
      >
        Save changes
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
                  id={createTableColumnId(-1, index)}
                  onKeyDown={onNonUpdatingKeydown}
                  onInput={(e) => {
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
                          id={createTableColumnId(rowIndex(), columnIndex())}
                          onKeyDown={onNonUpdatingKeydown}
                          onInput={(e) => {
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
  rows,
  rowIdx,
  colIdx
}: {
  rows: ParsedColumn[][];
  rowIdx: number;
  colIdx: number;
}): { shouldPreventEvent: boolean; nextFocusedElementId?: string; deletedRowIdx?: number } {
  // Return early if it's on headers or on the first row.
  if (rowIdx === -1 || rows.length === 1) return { shouldPreventEvent: false };

  if (colIdx > 0 && rows[rowIdx][colIdx].content === '') {
    return {
      shouldPreventEvent: true,
      nextFocusedElementId: createTableColumnId(rowIdx, colIdx - 1)
    };
  }

  const isRowEmpty = rows[rowIdx].every((column) => column.content === '');
  let nextFocusedElementId: string | undefined;
  let deletedRowIdx: number | undefined;

  if (isRowEmpty) {
    deletedRowIdx = rowIdx;

    const prevRowIdx = rowIdx - 1;
    nextFocusedElementId = createTableColumnId(prevRowIdx, rows[prevRowIdx].length - 1);
  }

  return { shouldPreventEvent: isRowEmpty, nextFocusedElementId, deletedRowIdx };
}

function navigateCell({ key, rowIdx, colIdx }: { key: string; rowIdx: number; colIdx: number }) {
  switch (key) {
    case ARROW_UP_KEY: {
      rowIdx--;
      break;
    }
    case ARROW_DOWN_KEY: {
      rowIdx++;
      break;
    }
    case ARROW_LEFT_KEY: {
      colIdx--;
      break;
    }
    case ARROW_RIGHT_KEY: {
      colIdx++;
      break;
    }
  }

  focusElementIfExists(createTableColumnId(rowIdx, colIdx));
}

const ID_SEPARATOR = '--';

function parseTableColumnId(id: string) {
  const [_, rowIdx, colIdx] = id.split(ID_SEPARATOR);
  return {
    rowIdx: Number(rowIdx),
    colIdx: Number(colIdx)
  };
}

function createTableColumnId(rowIdx: number, columnIdx: number) {
  return ['cell', rowIdx, columnIdx].join(ID_SEPARATOR);
}

function focusElementIfExists(id: string) {
  const nextElement = document.getElementById(id) as HTMLInputElement | null;
  if (nextElement) {
    nextElement.focus();
  }
}
