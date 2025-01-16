export interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  maxLength?: number;
  title?: string;
  placeholder?: string;
}

export interface CRUDProps {
  apiUrl: string;
  fields: Field[];
  title: string;
  idField: string;
  columns: string[];
}
