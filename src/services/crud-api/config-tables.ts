import type {TableConfig} from "../../types/crud-api.ts";

export const TABLES_CONFIG: Record<string, TableConfig> = {
  clients: {
    tableName: 'Client',
    idColumn: 'id_client',
    requiredFields: ['nom', 'prenom', 'email', 'telephone'],
    allowedFields: ['nom', 'prenom', 'email', 'telephone', 'piece_identite', 'id_camping']
  }
};
