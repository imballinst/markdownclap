import { HotkeyContainerObject } from "../../../types/HotkeyContainerObject";

export function getToolbarHoverText({
  defaultText,
  withMetaKey,
  keys,
  combineMetaKey
}: HotkeyContainerObject & { combineMetaKey?: boolean }) {
  if (typeof window === 'undefined' && !combineMetaKey) return '';

  let hotkey = keys.join('+');
  if (withMetaKey) {
    let metaKey = ''
    if (!combineMetaKey) {
      metaKey = navigator.userAgent.includes('Macintosh') ? 'Cmd' : 'Ctrl'
    } else {
      metaKey = 'Cmd/Ctrl'
    }

    hotkey = `${metaKey}+${keys.join('+')}`
  }

  if (!defaultText) return hotkey;
  return `${defaultText} (${hotkey})`
}
