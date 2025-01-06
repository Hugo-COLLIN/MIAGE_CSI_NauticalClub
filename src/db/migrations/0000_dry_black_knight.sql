CREATE TABLE "personnel" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100) NOT NULL,
	"prenom" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telephone" varchar(20) NOT NULL,
	"est_diplome" boolean DEFAULT false,
	"permis_bateau" boolean DEFAULT false,
	"specialite" varchar(100),
	"role" varchar(50) NOT NULL,
	"hash_mot_de_passe" text NOT NULL,
	"date_creation" timestamp DEFAULT now(),
	CONSTRAINT "personnel_email_unique" UNIQUE("email")
);
