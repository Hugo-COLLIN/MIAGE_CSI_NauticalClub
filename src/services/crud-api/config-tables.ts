import type {TableConfig} from "../../types/crud-api.ts";

export const TABLES_CONFIG: Record<string, TableConfig> = {
  clients: {
    tableName: 'Client',
    idColumn: 'id_client',
    requiredFields: ['nom', 'prenom', 'email', 'telephone'],
    allowedFields: ['nom', 'prenom', 'email', 'telephone', 'piece_identite', 'id_camping']
  },
  cours: {
    tableName: 'Cours',
    idColumn: 'id_cours',
    requiredFields: [
      'date_cours',
      'heure_debut',
      'niveau',
      'nb_inscrits',
      'statut',
      'capacite_max',
      'id_saison',
      'id_forfait',
      'id_personnel'
    ],
    allowedFields: [
      'date_cours',
      'heure_debut',
      'niveau',
      'nb_inscrits',
      'statut',
      'capacite_max',
      'id_saison',
      'id_forfait',
      'id_personnel'
    ]
  }
  // Add more tables here
};
