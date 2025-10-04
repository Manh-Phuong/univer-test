export interface Template {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  structure_url: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateWithStructure extends Template {
  structure: any;
}

export interface DataConnection {
  id: string;
  name: string;
  type: "trino" | "postgresql";
  host: string;
  port: number;
  database_name?: string;
  username?: string;
  password?: string;
  catalog?: string;
  schema?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ColumnMapping {
  queryColumn: string;
  sheetColumn: number;
  format?: "currency" | "number" | "percentage" | "date";
}

export interface ApplyTemplateParams {
  name: string;
  connectionId?: string;
  queryText?: string;
  dataStartRow?: number;
  sheetId?: string;
  columnMappings?: ColumnMapping[];
}

export interface MergeDataParams {
  snapshot: any;
  connectionId: string;
  queryText: string;
  dataStartRow: number;
  sheetId: string;
  columnMappings?: ColumnMapping[];
  startColumn?: any;
  styleTemplateRow?: number;
}
