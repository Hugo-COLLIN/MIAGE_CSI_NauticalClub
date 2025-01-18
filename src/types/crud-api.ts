export interface DatabaseRecord {
  [key: string]: any;
  id?: number | string;
}

export interface TableConfig {
  tableName: string;
  idColumn: string;
  requiredFields: string[];
  allowedFields: string[];
}
