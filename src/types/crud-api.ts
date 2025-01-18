export interface DatabaseRecord {
  [key: string]: any;
  id?: number | string;
}

export interface TableConfig {
  tableName: string;
  idColumn: string;
  requiredFields: string[];
  allowedFields: string[];
  joinedInsert?: {
    table: string;
    fields: string[];
    returnField: string;
    targetField: string;
  };
  joinedSelect?: {
    table: string;
    fields: string[];
    joinField: string;
  };
}
