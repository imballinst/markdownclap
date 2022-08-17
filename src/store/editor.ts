import { atom } from 'nanostores';
import { ParsedStringResult, ParsedTableResult } from '../utils/md-parser';

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

export function updateSidebarTable(sidebarContent: Omit<NonNullable<ParsedStringResult>, 'type'>) {
  const oldSidebarContent = editorStore.get().sidebarContent;
  if (oldSidebarContent === undefined) return;

  const newSidebarContent: ParsedTableResult = { ...oldSidebarContent };
  newSidebarContent.content = sidebarContent.content;
  newSidebarContent.rawContent = sidebarContent.rawContent;
  editorStore.set({ sidebarContent: newSidebarContent });
}
