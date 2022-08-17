import { alterArray } from '../array';

// Types.
export type ParsedStringResult = ParsedTableResult | undefined;

export interface ParsedTableResult {
  type: 'table';
  rawContent: string;
  content: {
    headers: ParsedColumn[];
    separators: ParsedColumn[];
    rows: ParsedColumn[][];
  };
}

export interface ParsedColumn {
  content: string;
  pre: string;
  post: string;
}

// Main functions.
export function alterColumn({
  content,
  action
}: {
  content: ParsedTableResult['content'];
  action:
    | {
        type: 'add';
        columnIdx: number;
        content: {
          header: ParsedColumn;
          separator: ParsedColumn;
          columns: ParsedColumn[];
        };
      }
    | {
        type: 'remove';
        columnIdx: number;
      };
}): ParsedTableResult['content'] {
  const newContent = { ...content };
  const { type, columnIdx } = action;

  switch (type) {
    case 'add': {
      newContent.headers = alterArray(newContent.headers, columnIdx, {
        type: 'add',
        element: action.content.header
      });
      newContent.separators = alterArray(newContent.separators, columnIdx, {
        type: 'add',
        element: action.content.separator
      });

      const rowsLength = newContent.rows.length;
      const actionRowsLength = action.content.columns.length;

      if (rowsLength !== actionRowsLength) {
        throw new Error(
          `The content rows\' length is not equal to \`action.content.columns\`. Expected ${rowsLength} but received ${actionRowsLength}.`
        );
      }

      newContent.rows = newContent.rows.map((rowColumns, index) =>
        alterArray(rowColumns, columnIdx, {
          type: 'add',
          element: action.content.columns[index]
        })
      );
    }
    case 'remove': {
      newContent.headers = alterArray(newContent.headers, columnIdx, { type: 'remove' });
      newContent.separators = alterArray(newContent.separators, columnIdx, { type: 'remove' });
      newContent.rows = newContent.rows.map((rowColumns) =>
        alterArray(rowColumns, columnIdx, { type: 'remove' })
      );
    }
  }

  return newContent;
}

export function getTableRawContent(content: ParsedTableResult['content']): string {
  const headers = content.headers
    .map((header) => header.pre + header.content + header.post)
    .join('|');
  const separators = content.separators
    .map((separator) => separator.pre + separator.content + separator.post)
    .join('|');
  const rows = content.rows.map((row) =>
    row.map((column) => column.pre + column.content + column.post).join('|')
  );

  return `|${headers}|\n|${separators}|\n|${rows}|`;
}

export function parseTableString(str: string): ParsedStringResult {
  const arr = str.trim().split('\n');
  const [headers, headerBodySeparator, ...body] = arr;
  const isContainColumnSeparator = headers.includes('|');
  if (!isContainColumnSeparator) {
    return undefined;
  }

  const headerColumns: ParsedColumn[] = getColumns(headers);
  const areAllHeadersNonEmpty = headerColumns.every((headerText) => headerText.content !== '');
  if (!areAllHeadersNonEmpty) {
    return undefined;
  }

  const headerColumnsLength = headerColumns.length;
  const headerBodySeparatorColumns = getColumns(headerBodySeparator);
  let isLengthEqual = headerBodySeparatorColumns.length === headerColumnsLength;
  if (!isLengthEqual) {
    return undefined;
  }

  const isSeparatorRowValid = headerBodySeparatorColumns.every((column) =>
    column.content.includes('-')
  );
  if (!isSeparatorRowValid) {
    return undefined;
  }

  const isBodyEmpty = body.length === 0;
  if (isBodyEmpty) {
    return undefined;
  }

  const rowsColumns = body.map((bodyRow) => getColumns(bodyRow));
  isLengthEqual = rowsColumns.every((rowColumns) => rowColumns.length === headerColumnsLength);
  if (!isLengthEqual) {
    return undefined;
  }

  return {
    type: 'table',
    rawContent: str,
    content: {
      headers: headerColumns,
      separators: headerBodySeparatorColumns,
      rows: rowsColumns
    }
  };
}

// Helper functions.
const ESCAPED_SEPARATOR = '\\|';

function getColumns(line: string): ParsedColumn[] {
  // Trim the line, then remove the first and last "|".
  const trimmed = line.trim().slice(1, -1);
  const length = trimmed.length;
  const columns: ParsedColumn[] = [];
  let i = 0;
  let text = '';
  let previousSeparatorIndex = 0;

  while (i < length) {
    const char = trimmed.charAt(i);
    const nextChar = trimmed.charAt(i + 1);
    const isLastChar = i + 1 === length;
    const isSeparator = char === '|';
    text += char;

    if (char + nextChar === ESCAPED_SEPARATOR) {
      text += nextChar;
      i += 1;
    } else if (isSeparator || isLastChar) {
      // Go to next column segment, or the end of the columns.
      let content = text.trim();
      let postIndex = i + 1;

      if (isSeparator) {
        content = content.slice(0, -1).trim();
        postIndex = i;
      }

      const pre = trimmed.slice(previousSeparatorIndex, trimmed.indexOf(content));
      const post = trimmed.slice(
        trimmed.indexOf(content, previousSeparatorIndex) + content.length,
        postIndex
      );

      columns.push({
        pre,
        post,
        content
      });
      text = '';
      previousSeparatorIndex = isSeparator ? i + 1 : i;
    }

    i += 1;
  }

  return columns;
}
