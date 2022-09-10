import { atom } from 'nanostores';
import { alterColumn, ParsedStringResult, ParsedTableResult } from '../utils/operators/table';

// Drawer inspect status.
export enum InspectStatus {
  PreviewingMarkdown,
  InspectingSnippet
}

export const inspectStatusStore = atom<InspectStatus>(InspectStatus.PreviewingMarkdown);

export function setInspectStatus(newStatus: InspectStatus) {
  inspectStatusStore.set(newStatus);
}

// Drawer content.
export type InspectContent = ParsedStringResult;
export const inspectContentStore = atom<InspectContent>(undefined);

export function setInspectContent(inspectContent: InspectContent) {
  inspectContentStore.set(inspectContent);
}

export function patchInspectContent(
  inspectContent: Omit<Partial<NonNullable<InspectContent>>, 'type'>
) {
  const oldInspectContent = inspectContentStore.get();
  if (oldInspectContent === undefined) return;

  const newInspectContent: ParsedTableResult = { ...oldInspectContent };
  newInspectContent.content = inspectContent.content || oldInspectContent.content;
  newInspectContent.rawContent = inspectContent.rawContent || oldInspectContent.rawContent;
  inspectContentStore.set(newInspectContent);
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
  const inspectContent = inspectContentStore.get();
  if (!inspectContent) return;

  switch (params.type) {
    case 'add-column-after': {
      if (params.payload.columnContentType === 'ordered-number') {
        const newContent = alterColumn({
          content: inspectContent.content,
          action: {
            type: 'add',
            columnIdx: params.payload.columnIndex + 1,
            content: {
              columns: inspectContent.content.rows.map((_, idx) => ({
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
        patchInspectContent({
          content: newContent
        });
      }

      break;
    }
    case 'add-column-before': {
      if (params.payload.columnContentType === 'ordered-number') {
        const newContent = alterColumn({
          content: inspectContent.content,
          action: {
            type: 'add',
            columnIdx: params.payload.columnIndex,
            content: {
              columns: inspectContent.content.rows.map((_, idx) => ({
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
        patchInspectContent({
          content: newContent
        });
      }

      break;
    }
    case 'fill-column': {
      if (params.payload.columnContentType === 'ordered-number') {
        const newContent = alterColumn({
          content: inspectContent.content,
          action: {
            type: 'replace',
            columnIdx: params.payload.columnIndex,
            content: {
              columns: inspectContent.content.rows.map((columns, index) => {
                const column = { ...columns[params.payload.columnIndex] };
                column.content = `${index + 1}`;
                return column;
              })
            }
          }
        });
        patchInspectContent({
          content: newContent
        });
      }

      break;
    }
    case 'swap-column': {
      const newContent = alterColumn({
        content: inspectContent.content,
        action: {
          type: 'swap',
          columnIdx: params.payload.columnIndex,
          targetColumnIndex: params.payload.targetColumnIndex
        }
      });
      patchInspectContent({
        content: newContent
      });

      break;
    }
    case 'delete-column': {
      const newContent = alterColumn({
        content: inspectContent.content,
        action: {
          type: 'delete',
          columnIdx: params.payload.columnIndex
        }
      });
      patchInspectContent({
        content: newContent
      });
    }
  }
}
