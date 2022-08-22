import { atom } from 'nanostores';
import {
  alterColumn,
  getTableRawContent,
  ParsedColumn,
  ParsedStringResult,
  ParsedTableResult
} from '../utils/operators/table';

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
export type ColumnAction = {
  type: 'add-column-before' | 'add-column-after' | 'fill-column';
  payload: {
    columnIndex: number;
    columnContentType: ColumnContentType;
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
        let newRows = sidebarContent.content.rows || [];
        newRows = newRows.map((columns, index) => {
          const newColumns: ParsedColumn[] = [...columns];
          newColumns[params.payload.columnIndex] = {
            ...newColumns[params.payload.columnIndex],
            content: `${index + 1}`
          };
          return newColumns;
        });

        const newContent = {
          headers: sidebarContent.content.headers,
          separators: sidebarContent.content.separators,
          rows: newRows
        };
        updateSidebarTable({
          content: newContent
        });
      }

      break;
    }
  }
}
