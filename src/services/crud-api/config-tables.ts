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
  },
  forfait: {
    tableName: 'Forfait',
    idColumn: 'id_forfait',
    requiredFields: [
      'type_forfait',
      'prix',
      'date_achat',
      'date_expiration',
      'seances_restantes',
      'id_client',
      'date_paiement',
      'montant',
      'type_paiement'
    ],
    allowedFields: [
      'type_forfait',
      'prix',
      'date_achat',
      'date_expiration',
      'seances_restantes',
      'id_partenaire',
      'id_paiement',
      'id_client'
    ],
    joinedInsert: {
      table: 'Paiement',
      fields: ['date_paiement', 'montant', 'type_paiement'],
      returnField: 'id_paiement',
      targetField: 'id_paiement'
    },
    joinedSelect: {
      table: 'Paiement',
      fields: ['date_paiement', 'montant', 'type_paiement'],
      joinField: 'id_paiement'
    }
  },
  panne: {
    tableName: 'Panne',
    idColumn: 'id_panne',
    requiredFields: [
      'date_panne',
      'id_materiel',
      'id_saison'
    ],
    allowedFields: [
      'date_panne',
      'date_reparation',
      'cout_reparation',
      'description',
      'id_materiel',
      'id_saison'
    ]
  },
  personnel: {
    tableName: 'Personnel',
    idColumn: 'id_personnel',
    requiredFields: [
      'nom',
      'prenom',
      'email',
      'telephone',
      'est_diplome',
      'permis_bateau',
      'tarif_horaire',
      'niveau_experimente',
      'id_saison',
      'identifiant',
      'mot_de_passe'
    ],
    allowedFields: [
      'nom',
      'prenom',
      'email',
      'telephone',
      'est_diplome',
      'permis_bateau',
      'specialite',
      'date_embauche',
      'tarif_horaire',
      'niveau_experimente',
      'id_saison'
    ],
    joinedInsert: {
      table: 'Compte',
      fields: ['identifiant', 'mot_de_passe'],
      returnField: 'id_personnel',
      targetField: 'id_personnel'
    },
    joinedSelect: {
      table: 'Compte',
      fields: ['identifiant'],
      joinField: 'id_personnel'
    }
  },
  saison: {
    tableName: 'Saison',
    idColumn: 'id_saison',
    requiredFields: ['date_debut', 'date_fin'],
    allowedFields: ['date_debut', 'date_fin']
  },
  // Add more tables here
};
