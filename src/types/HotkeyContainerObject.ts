export interface HotkeyContainerObject {
  defaultText: string;
  keys: string[];
  // Whether the `keys` also include Ctrl/Cmd or not.
  withMetaKey: boolean;
  action?: string;
}
