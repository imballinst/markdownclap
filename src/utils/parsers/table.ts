export function parseTableFromTabbedText(text: string | undefined): string | undefined {
  if (!text) return undefined

  const lines = text.trim().split('\n')
  const tabCountPerLine = lines.map(line => line.match(/\t+/g)?.length || 0)
  const allLinesHaveEqualTabCount = tabCountPerLine.every(tabCount => tabCount === tabCountPerLine[0] && tabCount > 0)

  if (!allLinesHaveEqualTabCount) return undefined
  return lines.map(line => `|${line.replace(/\|/g, '\\|').replace(/\t+/g, '|')}|`).join('\n')
}