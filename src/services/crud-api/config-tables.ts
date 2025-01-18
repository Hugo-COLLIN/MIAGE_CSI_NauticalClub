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
  },
  materiel: {
    tableName: 'Materiel',
    idColumn: 'id_materiel',
    requiredFields: [
      'type_materiel',
      'etat',
      'date_acquisition',
      'quantite'
    ],
    allowedFields: [
      'type_materiel',
      'caracteristiques',
      'etat',
      'date_acquisition',
      'numero_serie'
    ],
    joinedInsert: {
      table: 'Stock',
      fields: ['quantite'],
      returnField: 'id_stock',
      targetField: 'id_stock'
    },
    joinedSelect: {
      table: 'Stock',
      fields: ['quantite'],
      joinField: 'id_stock'
    }
  },
  locations: {
    tableName: 'Location',
    idColumn: 'id_location',
    requiredFields: [
      'date_debut',
      'date_fin_prevue',
      'date_retour',
      'prix_base',
      'id_client',
      'id_personnel',
      'id_saison',
      'id_materiel'
    ],
    allowedFields: [
      'date_debut',
      'date_fin_prevue',
      'date_retour',
      'prix_base',
      'supplements',
      'id_client',
      'id_personnel',
      'id_saison',
      'id_materiel'
    ]
  }
  // Add more tables here
};
