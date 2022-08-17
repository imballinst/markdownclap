import { atom } from 'nanostores';

export interface EditorState {
  sidebarContent:
    | {
        type: 'table' | undefined;
        content: string;
      }
    | undefined;
}

export const editorStore = atom<EditorState>({
  sidebarContent: undefined
});

export function openEditorSidebar(
  sidebarContent: EditorState['sidebarContent']
) {
  editorStore.set({ sidebarContent });
}

export function closeEditorSidebar() {
  editorStore.set({ sidebarContent: undefined });
}
