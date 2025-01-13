
-- script creation of enumerations

CREATE TYPE StatutPanne AS ENUM (
	'Signalee','Reparation','Reparee','HorsService'
);

CREATE TYPE StatutMateriel AS ENUM (
	'Recu','EnService','EnPanne','AuRebut'
);

CREATE TYPE type_materiel AS ENUM (
	'Catamaran','Pedalo','Paddle','Planche','Voile','Pied_mat'
);

CREATE TYPE type_forfait AS ENUM (
	'1_seance','2_seances','5_seances'
);

CREATE TYPE niveau AS ENUM (
	'debutant','confirme'
);

CREATE TYPE statut AS ENUM (
	'prevu','confirme','annule'
);

-- script creation of tables

CREATE TABLE ArchiveMateriel (
	id_archive_materiel SERIAL PRIMARY KEY,
	type_materiel type_materiel NOT NULL,
	caracteristiques VARCHAR(50),
	etat StatutMateriel NOT NULL,
	date_acuisition DATE NOT NULL,
	numero_serie VARCHAR(50) UNIQUE
);

CREATE TABLE ArchiveSaison (
	id_archive_saison SERIAL PRIMARY KEY,
	date_debut DATE NOT NULL,
	date_fin DATE NOT NULL
);

CREATE TABLE ArchivePanne (
	id_archive_panne SERIAL PRIMARY KEY,
	id_archive_materiel INT NOT NULL,
	id_archive_saison INT NOT NULL,
	date_panne TIMESTAMP NOT NULL,
	date_reparation DATE,
	cout_reparation FLOAT CHECK(cout_reparation>=0),
	description TEXT,
	FOREIGN KEY (id_archive_materiel) REFERENCES ArchiveMateriel (id_archive_materiel),
	FOREIGN KEY (id_archive_saison) REFERENCES ArchiveSaison (id_archive_saison)
);

CREATE TABLE Saison (
	id_saison SERIAL PRIMARY KEY,
	date_debut DATE NOT NULL,
	date_fin DATE NOT NULL
);

CREATE TABLE Personnel (
	id_personnel SERIAL PRIMARY KEY,
	nom VARCHAR(30) NOT NULL,
	prenom VARCHAR(30) NOT NULL,
	email VARCHAR(50) NOT NULL,
	telephone INT NOT NULL,
	est_diplome BOOLEAN,
	permis_bateau BOOLEAN,
	specialite VARCHAR(50),
	date_embauche DATE,
	tarif_horaire FLOAT NOT NULL,
	niveau_experimente BOOLEAN,
	id_saison INT NOT NULL,
	FOREIGN KEY (id_saison) REFERENCES Saison (id_saison)
);

CREATE TABLE ArchiveEmbauche (
	id_archive_saison INT NOT NULL,
	id_personnel INT NOT NULL,
	FOREIGN KEY (id_archive_saison) REFERENCES ArchiveSaison (id_archive_saison),
	FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel)
);

CREATE TABLE Embauche (
	id_saison INT NOT NULL,
	id_personnel INT NOT NULL,
	FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
	FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel)
);

CREATE TABLE Camping (
	id_camping SERIAL PRIMARY KEY,
	nom VARCHAR(50) NOT NULL,
	adresse VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	telephone INT NOT NULL
);

CREATE TABLE Client (
	id_client SERIAL PRIMARY KEY,
	nom VARCHAR(30) NOT NULL,
	prenom VARCHAR(30) NOT NULL,
	email VARCHAR(50) NOT NULL,
	telephone INT NOT NULL,
	piece_identite VARCHAR(50),
	id_camping INT,
	FOREIGN KEY (id_camping) REFERENCES Camping (id_camping)
);

CREATE TABLE Stock (
	id_stock SERIAL PRIMARY KEY,
	quantite INT NOT NULL
);

CREATE TABLE Materiel (
	id_materiel SERIAL PRIMARY KEY,
	type_materiel type_materiel NOT NULL,
	caracteristiques VARCHAR(50),
	etat StatutMateriel NOT NULL,
	date_acquisition DATE NOT NULL,
	numero_serie VARCHAR(50),
	id_stock INT NOT NULL,
	FOREIGN KEY (id_stock) REFERENCES Stock (id_stock)
);

CREATE TABLE Paiement (
	id_paiement SERIAL PRIMARY KEY,
	date_paiement DATE NOT NULL,
	montant FLOAT NOT NULL,
	type_paiement VARCHAR(50) NOT NULL
);

CREATE TABLE Partenaire (
	id_partenaire SERIAL PRIMARY KEY,
	nom VARCHAR(50) NOT NULL,
	adresse VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	telephone INT NOT NULL,
	type_partenaire VARCHAR(50) NOT NULL,
	est_actif BOOLEAN
);

CREATE TABLE Forfait (
	id_forfait SERIAL PRIMARY KEY,
	type_forfait type_forfait NOT NULL,
	prix FLOAT NOT NULL,
	date_achat DATE NOT NULL,
	date_expiration DATE NOT NULL,
	seances_restantes INT NOT NULL,
	id_partenaire INT NOT NULL,
	id_paiement INT NOT NULL,
	id_client INT NOT NULL,
	FOREIGN KEY (id_partenaire) REFERENCES Partenaire (id_partenaire),
	FOREIGN KEY (id_paiement) REFERENCES Paiement (id_paiement),
	FOREIGN KEY (id_client) REFERENCES Client (id_client)
);

CREATE TABLE Cours (
	id_cours SERIAL PRIMARY KEY,
	date_cours DATE NOT NULL,
	heure_debut TIME NOT NULL,
	niveau niveau NOT NULL,
	nb_inscrits INT NOT NULL,
	statut statut NOT NULL,
	capacite_max INT NOT NULL,
	id_saison INT NOT NULL,
	id_forfait INT NOT NULL,
	id_personnel INT NOT NULL,
	id_archive_saison INT NOT NULL,
	FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
	FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel),
	FOREIGN KEY (id_archive_saison) REFERENCES ArchiveSaison (id_archive_saison),
	FOREIGN KEY (id_forfait) REFERENCES Forfait (id_forfait)
);
 
CREATE TABLE est_utilisé_pour (
	id_materiel INT NOT NULL,
	id_cours INT NOT NULL,
	FOREIGN KEY (id_materiel) REFERENCES Materiel (id_materiel),
	FOREIGN KEY (id_cours) REFERENCES Cours (id_cours)
);

CREATE TABLE ArchivePaiement (
	id_archive_paiement SERIAL PRIMARY KEY,
	date_paiement DATE NOT NULL,
	montant FLOAT NOT NULL,
	type_paiement VARCHAR(30) NOT NULL
);

CREATE TABLE ArchiveCours (
	id_archive_cours SERIAL PRIMARY KEY,
	date_cours DATE NOT NULL,
	heure_debut TIME NOT NULL,
	niveau niveau NOT NULL,
	nb_inscrits INT NOT NULL,
	statut statut NOT NULL,
	capacite_max INT NOT NULL,
	id_personnel INT NOT NULL,
	id_archive_saison INT NOT NULL,
	FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel),
	FOREIGN KEY (id_archive_saison) REFERENCES ArchiveSaison (id_archive_saison)
);
	
CREATE TABLE ArchiveForfait (
	id_archive_forfait SERIAL PRIMARY KEY,
	type_forfait type_forfait NOT NULL,
	prix FLOAT NOT NULL,
	date_achat DATE NOT NULL,
	date_expiration DATE NOT NULL,
	seances_restantes INT NOT NULL,
	id_archive_cours INT NOT NULL,
	id_archive_paiement INT NOT NULL,
	id_client INT NOT NULL,
	FOREIGN KEY (id_archive_cours) REFERENCES ArchiveCours (id_archive_cours),
	FOREIGN KEY (id_archive_paiement) REFERENCES ArchivePaiement (id_archive_paiement),
	FOREIGN KEY (id_client) REFERENCES Client (id_client)
);

CREATE TABLE Location (
	id_location SERIAL PRIMARY KEY,
	date_debut TIMESTAMP NOT NULL,
	date_fin_prevue TIMESTAMP NOT NULL,
	date_retour TIMESTAMP NOT NULL,
	prix_base FLOAT NOT NULL,
	supplements FLOAT DEFAULT 0,
	id_client INT NOT NULL,
	id_personnel INT NOT NULL,
	id_saison INT NOT NULL,
	id_materiel INT NOT NULL,
	FOREIGN KEY (id_client) REFERENCES Client (id_client),
	FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel),
	FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
	FOREIGN KEY (id_materiel) REFERENCES Materiel (id_materiel)
);

CREATE TABLE ArchiveLocation (
	id_archive_location SERIAL PRIMARY KEY,
	date_debut TIMESTAMP NOT NULL,
	date_fin_prevue TIMESTAMP NOT NULL,
	date_retour TIMESTAMP NOT NULL,
	prix_base FLOAT NOT NULL,
	supplements FLOAT DEFAULT 0,
	id_archive_saison INT NOT NULL,
	id_saison INT NOT NULL,
	FOREIGN KEY (id_archive_saison) REFERENCES ArchiveSaison (id_archive_saison),
	FOREIGN KEY (id_saison) REFERENCES Saison (id_saison)
);

CREATE TABLE Panne (
	id_panne SERIAL PRIMARY KEY,
	date_panne TIMESTAMP NOT NULL,
	date_reparation DATE,
	cout_reparation FLOAT,
	description TEXT,
	id_materiel INT NOT NULL,
	id_saison INT NOT NULL,
	FOREIGN KEY (id_saison) REFERENCES Saison (id_saison),
	FOREIGN KEY (id_materiel) REFERENCES Materiel (id_materiel)
);

CREATE TABLE Compte (
	id_compte SERIAL PRIMARY KEY,
	login VARCHAR(30),
	mot_de_passe VARCHAR(30),
	id_personnel INT NOT NULL,
	FOREIGN KEY (id_personnel) REFERENCES Personnel (id_personnel)
);
