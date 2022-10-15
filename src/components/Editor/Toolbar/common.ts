export function getToolbarHoverText({
  text = '',
  keys
}: {
  text?: string
  keys: string[]
}) {
  if (typeof window === 'undefined') return '';

  const metaKey = navigator.userAgent.includes('Macintosh') ? 'Cmd' : 'Ctrl';
  const hotkey = `${metaKey}+${keys.join('+')}`;

  if (!text) return hotkey;
  return `${text} (${hotkey})`
}
