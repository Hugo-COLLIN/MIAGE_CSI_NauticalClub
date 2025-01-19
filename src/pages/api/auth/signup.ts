import type { APIRoute } from 'astro';
import { db } from '../../../services/db.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validation des données
    if (!data.nom || !data.prenom || !data.email || !data.telephone ||
      data.tarif_horaire === undefined || !data.id_saison ||
      !data.identifiant || !data.mot_de_passe) {
      return new Response(JSON.stringify({
        error: 'Tous les champs obligatoires doivent être remplis'
      }), { status: 400 });
    }

    // Vérifier si l'email ou l'identifiant existent déjà
    const existingUser = await db.query(
      `SELECT p.email, c.identifiant 
       FROM Personnel p 
       LEFT JOIN Compte c ON c.identifiant = $1 
       WHERE p.email = $2`,
      [data.identifiant, data.email]
    );

    if (existingUser.rows.length > 0) {
      if (existingUser.rows[0].email === data.email) {
        return new Response(JSON.stringify({
          error: 'Cet email est déjà utilisé'
        }), { status: 400 });
      }
      if (existingUser.rows[0].identifiant === data.identifiant) {
        return new Response(JSON.stringify({
          error: 'Cet identifiant est déjà utilisé'
        }), { status: 400 });
      }
    }

    // Démarrer une transaction
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Insérer le nouveau personnel
      const personnelResult = await client.query(
        `INSERT INTO Personnel (
          nom, prenom, email, telephone, est_diplome, permis_bateau, 
          specialite, date_embauche, tarif_horaire, niveau_experimente, id_saison
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id_personnel`,
        [
          data.nom,
          data.prenom,
          data.email,
          data.telephone,
          data.est_diplome,
          data.permis_bateau,
          data.specialite || null,
          data.date_embauche,
          data.tarif_horaire,
          data.niveau_experimente,
          data.id_saison
        ]
      );

      const id_personnel = personnelResult.rows[0].id_personnel;

      // Insérer le compte avec hachage côté PostgreSQL
      await client.query(
        `INSERT INTO Compte (identifiant, mot_de_passe, id_personnel)
         VALUES ($1, crypt($2, gen_salt('bf')), $3)`,
        [data.identifiant, data.mot_de_passe, id_personnel]
      );

      await client.query('COMMIT');

      return new Response(JSON.stringify({
        message: 'Compte créé avec succès'
      }), { status: 201 });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    return new Response(JSON.stringify({
      error: 'Erreur serveur',
      details: error
    }), { status: 500 });
  }
}
