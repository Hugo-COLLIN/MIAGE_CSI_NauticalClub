import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer
} from 'drizzle-orm/pg-core';

// Table Personnel
export const personnel = pgTable('personnel', {
  id: serial('id').primaryKey(),
  nom: varchar('nom', { length: 100 }).notNull(),
  prenom: varchar('prenom', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  telephone: varchar('telephone', { length: 20 }).notNull(),
  estDiplome: boolean('est_diplome').default(false),
  permisAteau: boolean('permis_bateau').default(false),
  specialite: varchar('specialite', { length: 100 }),
  role: varchar('role', { length: 50 }).notNull(),
  hashMotDePasse: text('hash_mot_de_passe').notNull(),
  dateCreation: timestamp('date_creation').defaultNow(),
});
