-- Database: MIAGE_CSI_NauticalClub

-- DROP DATABASE IF EXISTS "MIAGE_CSI_NauticalClub";

CREATE DATABASE "MIAGE_CSI_NauticalClub"
WITH OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- script creation of enumerations

CREATE TYPE StatutPanne AS ENUM
(
    'Signalee',
    'Reparation',
    'Reparee',
    'HorsService'
);

CREATE TYPE StatutMateriel AS ENUM
(
    'Recu',
    'EnService',
    'EnPanne',
    'AuRebut'
);

CREATE TYPE type_materiel AS ENUM
(
    'Catamaran',
    'Pedalo',
    'Paddle',
    'Planche',
    'Voile',
    'Pied_mat'
);

CREATE TYPE type_forfait AS ENUM
(
    '1_seance',
    '2_seances',
    '5_seances'
);

CREATE TYPE niveau AS ENUM
(
    'debutant',
    'confirme'
);

CREATE TYPE statut AS ENUM
(
    'prevu',
    'confirme',
    'annule'
);

CREATE TYPE type_personnel AS ENUM
(
    'GarçonDePlage',
    'Moniteur',
    'Proprietaire'
);

-- script creation of tables

CREATE TABLE ArchiveMateriel
(
    id_materiel      SERIAL PRIMARY KEY,
    type_materiel    type_materiel  NOT NULL,
    caracteristiques VARCHAR(50),
    etat             StatutMateriel NOT NULL,
    date_acuisition  DATE           NOT NULL,
    numero_serie     VARCHAR(50) UNIQUE
);

CREATE TABLE ArchiveSaison
(
    id_saison  SERIAL PRIMARY KEY,
    date_debut DATE NOT NULL,
    date_fin   DATE NOT NULL
);

CREATE TABLE ArchivePanne
(
    id_panne        SERIAL PRIMARY KEY,
    id_materiel     INT       NOT NULL,
    id_saison       INT       NOT NULL,
    date_panne      TIMESTAMP NOT NULL,
    date_reparation DATE,
    cout_reparation FLOAT CHECK (cout_reparation >= 0),
    description     TEXT,
    FOREIGN KEY (id_materiel) REFERENCES ArchiveMateriel (id_materiel),
    FOREIGN KEY (id_saison) REFERENCES ArchiveSaison (id_saison)
);

CREATE TABLE Saison
(
    id_saison  SERIAL PRIMARY KEY,
    date_debut DATE NOT NULL,
    date_fin   DATE NOT NULL
);

CREATE TABLE Personnel
(
    id_personnel       SERIAL PRIMARY KEY,
    nom                VARCHAR(30) NOT NULL,
    prenom             VARCHAR(30) NOT NULL,
    email              VARCHAR(50) NOT NULL,
    telephone          INT         NOT NULL,
    est_diplome        BOOLEAN,
    permis_bateau      BOOLEAN,
    specialite         VARCHAR(50),
    date_embauche      DATE,
    tarif_horaire      FLOAT       NOT NULL,
    niveau_experimente BOOLEAN,
    id_saison          INT         NOT NULL,
    FOREIGN KEY (id_saison) REFERENCES Saison (id_saison)
);

CREATE TABLE ArchiveEmbauche
(
    id_saison    INT NOT NULL,
    id_personnel INT NOT NULL,
    FOREIGN KEY (id_saison) REFERENCES ArchiveSaison (id_saison),
    FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel)
);

CREATE TABLE Embauche
(
    id_saison    INT NOT NULL,
    id_personnel INT NOT NULL,
    FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
    FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel)
);

CREATE TABLE Camping
(
    id_camping SERIAL PRIMARY KEY,
    nom        VARCHAR(50) NOT NULL,
    adresse    VARCHAR(50) NOT NULL,
    email      VARCHAR(50) NOT NULL,
    telephone  INT         NOT NULL
);

CREATE TABLE Client
(
    id_client      SERIAL PRIMARY KEY,
    nom            VARCHAR(30) NOT NULL,
    prenom         VARCHAR(30) NOT NULL,
    email          VARCHAR(50) NOT NULL,
    telephone      INT         NOT NULL,
    piece_identite VARCHAR(50),
    id_camping     INT,
    FOREIGN KEY (id_camping) REFERENCES Camping (id_camping)
);

CREATE TABLE Stock
(
    id_stock SERIAL PRIMARY KEY,
    quantite INT NOT NULL
);

CREATE TABLE Materiel
(
    id_materiel      SERIAL PRIMARY KEY,
    type_materiel    type_materiel  NOT NULL,
    caracteristiques VARCHAR(50),
    etat             StatutMateriel NOT NULL,
    date_acquisition DATE           NOT NULL,
    numero_serie     VARCHAR(50),
    id_stock         INT            NOT NULL,
    FOREIGN KEY (id_stock) REFERENCES Stock (id_stock)
);

CREATE TABLE Paiement
(
    id_paiement   SERIAL PRIMARY KEY,
    date_paiement DATE        NOT NULL,
    montant       FLOAT       NOT NULL,
    type_paiement VARCHAR(50) NOT NULL
);

CREATE TABLE Partenaire
(
    id_partenaire   SERIAL PRIMARY KEY,
    nom             VARCHAR(50) NOT NULL,
    adresse         VARCHAR(50) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    telephone       INT         NOT NULL,
    type_partenaire VARCHAR(50) NOT NULL,
    est_actif       BOOLEAN
);

CREATE TABLE Forfait
(
    id_forfait        SERIAL PRIMARY KEY,
    type_forfait      type_forfait NOT NULL,
    prix              FLOAT        NOT NULL,
    date_achat        DATE         NOT NULL,
    date_expiration   DATE         NOT NULL,
    seances_restantes INT          NOT NULL,
    id_partenaire     INT          NOT NULL,
    id_paiement       INT          NOT NULL,
    id_client         INT          NOT NULL,
    FOREIGN KEY (id_partenaire) REFERENCES Partenaire (id_partenaire),
    FOREIGN KEY (id_paiement) REFERENCES Paiement (id_paiement),
    FOREIGN KEY (id_client) REFERENCES Client (id_client)
);

CREATE TABLE Cours
(
    id_cours     SERIAL PRIMARY KEY,
    date_cours   DATE   NOT NULL,
    heure_debut  TIME   NOT NULL,
    niveau       niveau NOT NULL,
    nb_inscrits  INT    NOT NULL,
    statut       statut NOT NULL,
    capacite_max INT    NOT NULL,
    id_saison    INT    NOT NULL,
    id_forfait   INT    NOT NULL,
    id_personnel INT    NOT NULL,
    FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
    FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel),
    FOREIGN KEY (id_saison) REFERENCES ArchiveSaison (id_saison),
    FOREIGN KEY (id_forfait) REFERENCES Forfait (id_forfait)
);

CREATE TABLE est_utilisé_pour
(
    id_materiel INT NOT NULL,
    id_cours    INT NOT NULL,
    FOREIGN KEY (id_materiel) REFERENCES Materiel (id_materiel),
    FOREIGN KEY (id_cours) REFERENCES Cours (id_cours)
);

CREATE TABLE ArchivePaiement
(
    id_paiement   SERIAL PRIMARY KEY,
    date_paiement DATE        NOT NULL,
    montant       FLOAT       NOT NULL,
    type_paiement VARCHAR(30) NOT NULL
);

CREATE TABLE ArchiveCours
(
    id_cours     SERIAL PRIMARY KEY,
    date_cours   DATE   NOT NULL,
    heure_debut  TIME   NOT NULL,
    niveau       niveau NOT NULL,
    nb_inscrits  INT    NOT NULL,
    statut       statut NOT NULL,
    capacite_max INT    NOT NULL,
    id_personnel INT    NOT NULL,
    id_saison    INT    NOT NULL,
    FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel),
    FOREIGN KEY (id_saison) REFERENCES ArchiveSaison (id_saison)
);

CREATE TABLE ArchiveForfait
(
    id_forfait        SERIAL PRIMARY KEY,
    type_forfait      type_forfait NOT NULL,
    prix              FLOAT        NOT NULL,
    date_achat        DATE         NOT NULL,
    date_expiration   DATE         NOT NULL,
    seances_restantes INT          NOT NULL,
    id_cours          INT          NOT NULL,
    id_paiement       INT          NOT NULL,
    id_client         INT          NOT NULL,
    FOREIGN KEY (id_cours) REFERENCES ArchiveCours (id_cours),
    FOREIGN KEY (id_paiement) REFERENCES ArchivePaiement (id_paiement),
    FOREIGN KEY (id_client) REFERENCES Client (id_client)
);

CREATE TABLE Location
(
    id_location     SERIAL PRIMARY KEY,
    date_debut      TIMESTAMP NOT NULL,
    date_fin_prevue TIMESTAMP NOT NULL,
    date_retour     TIMESTAMP NOT NULL,
    prix_base       FLOAT     NOT NULL,
    supplements     FLOAT DEFAULT 0,
    id_client       INT       NOT NULL,
    id_personnel    INT       NOT NULL,
    id_saison       INT       NOT NULL,
    id_materiel     INT       NOT NULL,
    FOREIGN KEY (id_client) REFERENCES Client (id_client),
    FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel),
    FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
    FOREIGN KEY (id_materiel) REFERENCES Materiel (id_materiel)
);

CREATE TABLE ArchiveLocation
(
    id_location     SERIAL PRIMARY KEY,
    date_debut      TIMESTAMP NOT NULL,
    date_fin_prevue TIMESTAMP NOT NULL,
    date_retour     TIMESTAMP NOT NULL,
    prix_base       FLOAT     NOT NULL,
    supplements     FLOAT DEFAULT 0,
    id_saison       INT       NOT NULL,
    FOREIGN KEY (id_saison) REFERENCES ArchiveSaison (id_saison),
    FOREIGN KEY (id_saison) REFERENCES Saison (id_saison)
);

CREATE TABLE Panne
(
    id_panne        SERIAL PRIMARY KEY,
    date_panne      TIMESTAMP NOT NULL,
    date_reparation DATE,
    cout_reparation FLOAT,
    description     TEXT,
    id_materiel     INT       NOT NULL,
    id_saison       INT       NOT NULL,
    FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
    FOREIGN KEY (id_materiel) REFERENCES Materiel (id_materiel)
);

CREATE TABLE Compte
(
    login        VARCHAR(30),
    mot_de_passe VARCHAR(60),
    id_personnel INT NOT NULL,
    FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel)
);

-- script creation of constraints
ALTER TABLE Saison
    ADD CONSTRAINT date_saison_check
        CHECK (date_fin > date_debut);

ALTER TABLE Location
    ADD CONSTRAINT prix_location_check
        CHECK (prix_base > 0 AND supplements >= 0);

ALTER TABLE Forfait
    ADD CONSTRAINT prix_forfait_check
        CHECK (prix > 0);

ALTER TABLE Personnel
    ADD CONSTRAINT date_embauche_check
        CHECK (date_embauche < CURRENT_DATE);

ALTER TABLE Client
    ADD CONSTRAINT telephone_check
        CHECK (telephone::text ~ '^[0-9]{10}$');


-- script creation of indexes
CREATE INDEX idx_cours_date ON Cours(date_cours);
CREATE INDEX idx_materiel_etat ON Materiel(etat);
CREATE INDEX idx_forfait_dates ON Forfait(date_achat, date_expiration);

-- script adding extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
