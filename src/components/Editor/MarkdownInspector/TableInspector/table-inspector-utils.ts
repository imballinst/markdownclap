import { ParsedTableResult } from '../../../../utils/operators/table';

interface FlattenedTableRow {
  id: string;
  columnIds: string[];
}

interface FlattenedTableColumn {
  id: string;
  value: string;
}

interface FlattenedTable {
  headers: FlattenedTableRow;
  rows: FlattenedTableRow[];
  columns: FlattenedTableColumn[];
}

export function flattenState(parsed: ParsedTableResult['content']): FlattenedTable {
  return {
    columns: [],
    rows: [],
    headers: { columnIds: [], id: '' }
  };
}
