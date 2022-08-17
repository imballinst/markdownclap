export function isTableString(str: string): boolean {
  const arr = str.trim().split('\n');
  const [headers, headerBodySeparator, ...body] = arr;
  if (!headers.includes('|')) {
    return false;
  }

  const headerColumns: string[] = getColumns(headers);
  const isHeaderValid = headerColumns.every((headerText) => headerText !== '');
  if (!isHeaderValid) {
    return false;
  }

  const headerColumnsLength = headerColumns.length;
  const headerBodySeparatorColumns = getColumns(headerBodySeparator);
  if (headerBodySeparatorColumns.length !== headerColumnsLength) {
    return false;
  }

  if (!headerBodySeparatorColumns.every((column) => column.includes('-'))) {
    return false;
  }

  if (body.length === 0) {
    return false;
  }

  return body.every(
    (bodyRow) => getColumns(bodyRow).length === headerColumnsLength
  );
}

// Helper functions.
function getColumns(line: string): string[] {
  const trimmed = line.trim();
  const length = trimmed.length;
  const columns: string[] = [];
  let state: 'open' | 'close' = 'close';
  let text = '';

  for (let i = 0; i < length; i += 1) {
    const char = trimmed.charAt(i);

    if (char === '\\') {
      const nextChar = trimmed.charAt(i + 1);
      const escapedSeparator = '\\|';

      if (char + nextChar === escapedSeparator) {
        text += char + nextChar;
        i += 2;
      }
    } else if (char === '|') {
      state = state === 'close' ? 'open' : 'close';
    } else {
      text += char;
    }

    if (state === 'close') {
      columns.push(text.trim());
      state = 'open';
      text = '';
    }
  }

  return columns;
}
