// vue3-easy-data-table.d.ts
// Relative issue: https://github.com/HC200ok/vue3-easy-data-table/issues/382

declare module 'vue3-easy-data-table' {
    import { DefineComponent } from 'vue';
  
    // Add a default export for the component
    const EasyDataTable: DefineComponent;
    export default EasyDataTable;
  
    // Retain original exports
    export type SortType = 'asc' | 'desc';
    export type FilterComparison = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between' | 'in';
    export type Item = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    export type FilterOption =
      | {
          field: string;
          comparison: 'between';
          criteria: [number, number];
        }
      | {
          field: string;
          comparison: '=' | '!=';
          criteria: number | string;
        }
      | {
          field: string;
          comparison: '>' | '>=' | '<' | '<=';
          criteria: number;
        }
      | {
          field: number | string;
          comparison: 'in';
          criteria: number[] | string[];
        }
      | {
          field: string;
          comparison: (value: any, criteria: string) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
          criteria: string;
        };
    export type Header = {
      text: string;
      value: string;
      sortable?: boolean;
      fixed?: boolean;
      width?: number;
    };
    export type ServerOptions = {
      page: number;
      rowsPerPage: number;
      sortBy?: string | string[];
      sortType?: SortType | SortType[];
    };
    export type ClickRowArgument = Item & {
      isSelected?: boolean;
      indexInCurrentPage?: number;
    };
    export type UpdateSortArgument = {
      sortType: SortType | null;
      sortBy: string;
    };
    export type HeaderItemClassNameFunction = (header: Header, columnNumber: number) => string;
    export type BodyRowClassNameFunction = (item: Item, rowNumber: number) => string;
    export type BodyItemClassNameFunction = (column: string, rowNumber: number) => string;
    export type TextDirection = 'center' | 'left' | 'right';
  }
  