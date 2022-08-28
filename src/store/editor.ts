import { atom } from 'nanostores';
import { alterColumn, ParsedStringResult, ParsedTableResult } from '../utils/operators/table';

export interface EditorState {
  sidebarContent: ParsedStringResult;
}

export const editorStore = atom<EditorState>({
  sidebarContent: undefined
});

export function openEditorSidebar(sidebarContent: EditorState['sidebarContent']) {
  editorStore.set({ sidebarContent });
}

export function closeEditorSidebar() {
  editorStore.set({ sidebarContent: undefined });
}

export function updateSidebarTable(
  sidebarContent: Omit<Partial<NonNullable<ParsedStringResult>>, 'type'>
) {
  const oldSidebarContent = editorStore.get().sidebarContent;
  if (oldSidebarContent === undefined) return;

  const newSidebarContent: ParsedTableResult = { ...oldSidebarContent };
  newSidebarContent.content = sidebarContent.content || oldSidebarContent.content;
  newSidebarContent.rawContent = sidebarContent.rawContent || oldSidebarContent.rawContent;
  editorStore.set({ sidebarContent: newSidebarContent });
}

export type ColumnContentType = 'ordered-number' | 'add-column-before';
export type ColumnAction =
  | {
      type: 'add-column-before' | 'add-column-after' | 'fill-column';
      payload: {
        columnIndex: number;
        columnContentType: ColumnContentType;
      };
    }
  | {
      type: 'swap-column';
      payload: {
        columnIndex: number;
        targetColumnIndex: number;
      };
    }
  | {
      type: 'delete-column';
      payload: {
        columnIndex: number;
      };
    };

export function alterTable(params: ColumnAction) {
  const sidebarContent = editorStore.get().sidebarContent;
  if (!sidebarContent) return;

  switch (params.type) {
    case 'add-column-after': {
      if (params.payload.columnContentType === 'ordered-number') {
        const newContent = alterColumn({
          content: sidebarContent.content,
          action: {
            type: 'add',
            columnIdx: params.payload.columnIndex + 1,
            content: {
              columns: sidebarContent.content.rows.map((_, idx) => ({
                content: `${idx + 1}`,
                post: '',
                pre: ''
              })),
              header: { content: '', post: '', pre: '' },
              separator: {
                content: '-',
                post: '',
                pre: ''
              }
            }
          }
        });
        updateSidebarTable({
          content: newContent
        });
      }

      break;
    }
    case 'add-column-before': {
      if (params.payload.columnContentType === 'ordered-number') {
        const newContent = alterColumn({
          content: sidebarContent.content,
          action: {
            type: 'add',
            columnIdx: params.payload.columnIndex,
            content: {
              columns: sidebarContent.content.rows.map((_, idx) => ({
                content: `${idx + 1}`,
                post: '',
                pre: ''
              })),
              header: { content: '', post: '', pre: '' },
              separator: {
                content: '-',
                post: '',
                pre: ''
              }
            }
          }
        });
        updateSidebarTable({
          content: newContent
        });
      }

      break;
    }
    case 'fill-column': {
      if (params.payload.columnContentType === 'ordered-number') {
        const newContent = alterColumn({
          content: sidebarContent.content,
          action: {
            type: 'replace',
            columnIdx: params.payload.columnIndex,
            content: {
              columns: sidebarContent.content.rows.map((columns, index) => {
                const column = { ...columns[params.payload.columnIndex] };
                column.content = `${index + 1}`;
                return column;
              })
            }
          }
        });
        updateSidebarTable({
          content: newContent
        });
      }

      break;
    }
    case 'swap-column': {
      const newContent = alterColumn({
        content: sidebarContent.content,
        action: {
          type: 'swap',
          columnIdx: params.payload.columnIndex,
          targetColumnIndex: params.payload.targetColumnIndex
        }
      });
      updateSidebarTable({
        content: newContent
      });

      break;
    }
    case 'delete-column': {
      const newContent = alterColumn({
        content: sidebarContent.content,
        action: {
          type: 'delete',
          columnIdx: params.payload.columnIndex
        }
      });
      updateSidebarTable({
        content: newContent
      });
    }
  }
}
