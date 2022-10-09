export function getToolbarHoverText(defaultText: string, keys: string[]) {
  if (typeof window === 'undefined') return '';

  const metaKey = navigator.userAgent.includes('Macintosh') ? 'Cmd' : 'Ctrl';
  return `${defaultText} (${metaKey}+${keys.join('+')})`;
}