export interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  maxLength?: number;
  title?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  defaultValue?: string;
  step?: number;
  dynamicOptions?: {
    url: string;
    valueKeys: string[];
    labelKey: string;
  }
}

export interface CRUDProps {
  apiUrl: string;
  fields: Field[];
  title: string;
  idField: string;
  columns: string[];
}
