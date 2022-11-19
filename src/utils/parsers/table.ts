import { parse } from 'csv-parse/browser/esm/sync'

export function parseTableFromTabbedText(text: string | undefined): string | undefined {
  if (!text) return undefined

  const lines = text.trim().split('\n')
  const tabCountPerLine = lines.map(line => line.match(/\t+/g)?.length || 0)
  const allLinesHaveEqualTabCount = tabCountPerLine.every(tabCount => tabCount === tabCountPerLine[0] && tabCount > 0)

  if (!allLinesHaveEqualTabCount) return undefined
  return lines.map(line => `|${escapePipes(line).replace(/\t+/g, '|')}|`).join('\n')
}

export function parseTableFromCommaSeparatedText(text: string | undefined): string | undefined {
  if (!text) return undefined
  
  try {
    const parsed: string[][] = parse(text.trim().replace(/[“”]/g, '"'), { skipEmptyLines: true })
    if (parsed.length === 1 && parsed[0].length === 1) return undefined

    return parsed.map(line => `|${line.map(column => escapePipes(column)).join('|')}|`).join('\n')
  } catch (err) {
    return undefined
  }
}

// Helper functions.
function escapePipes(line: string) {
  return line.replace(/\|/g, '\\|')
}