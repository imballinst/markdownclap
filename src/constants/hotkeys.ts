import { HotkeyContainerObject } from '../types/HotkeyContainerObject';

export enum ShortcutText {
  // Copy-paste operations.
  Copy = 'Copy',
  PasteRaw = 'PasteRaw',
  Paste = 'Paste',
  // Direct transformation of textarea value actions.
  Tab = 'Tab',
  Heading1 = 'Heading1',
  Heading2 = 'Heading2',
  Heading3 = 'Heading3',
  Heading4 = 'Heading4',
  Heading5 = 'Heading5',
  Heading6 = 'Heading6',
  Bold = 'Bold',
  Italic = 'Italic',
  // Links.
  AddOrRemoveLink = 'AddOrRemoveLink',
  // Inspections.
  Inspect = 'Inspect',
  FinishInspect = 'FinishInspect'
}

export const HOTKEYS: Record<ShortcutText, HotkeyContainerObject> = {
  // Copy-paste operations.
  [ShortcutText.Copy]: { defaultText: `Copy`, keys: ['c'], withMetaKey: true },
  [ShortcutText.PasteRaw]: { defaultText: `Raw paste`, keys: ['Shift', 'v'], withMetaKey: true },
  [ShortcutText.Paste]: {
    defaultText: `Paste and transform (when applicable)`,
    keys: ['v'],
    withMetaKey: true
  },
  // Direct transformation of textarea value actions.
  [ShortcutText.Tab]: {
    defaultText: `Add indentation of 2 spaces`,
    keys: ['Tab'],
    withMetaKey: false
  },
  [ShortcutText.Heading1]: { defaultText: `Heading 1`, keys: ['Alt', '1'], withMetaKey: true },
  [ShortcutText.Heading2]: { defaultText: `Heading 2`, keys: ['Alt', '2'], withMetaKey: true },
  [ShortcutText.Heading3]: { defaultText: `Heading 3`, keys: ['Alt', '3'], withMetaKey: true },
  [ShortcutText.Heading4]: { defaultText: `Heading 4`, keys: ['Alt', '4'], withMetaKey: true },
  [ShortcutText.Heading5]: { defaultText: `Heading 5`, keys: ['Alt', '5'], withMetaKey: true },
  [ShortcutText.Heading6]: { defaultText: `Heading 6`, keys: ['Alt', '6'], withMetaKey: true },
  [ShortcutText.Bold]: { defaultText: `Bold`, keys: ['b'], withMetaKey: true },
  [ShortcutText.Italic]: { defaultText: `Italic`, keys: ['i'], withMetaKey: true },
  // Links.
  [ShortcutText.AddOrRemoveLink]: { defaultText: `Add or remove link`, keys: ['k'], withMetaKey: true },
  // Inspections.
  [ShortcutText.Inspect]: {
    defaultText: `Inspect element`,
    keys: ['Shift', '`'],
    withMetaKey: true
  },
  [ShortcutText.FinishInspect]: { defaultText: `Save changes`, keys: ['Enter'], withMetaKey: true }
};
