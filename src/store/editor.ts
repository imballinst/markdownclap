import { atom } from 'nanostores';

export interface EditorState {
  isSidebarOpen: boolean;
  elementType: 'table' | undefined;
}

export const editorStore = atom<EditorState>({
  isSidebarOpen: false,
  elementType: undefined
});

export function openEditorSidebar(elementType: EditorState['elementType']) {
  editorStore.set({ elementType, isSidebarOpen: true });
}

export function closeEditorSidebar() {
  editorStore.set({ elementType: undefined, isSidebarOpen: false });
}
