import type { APIRoute } from 'astro';
import { db } from '../../../db';
import bcrypt from 'bcrypt';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const data = JSON.parse(body);
    const { identifiant, mot_de_passe } = data;

    // Validation des données
    if (!identifiant || !mot_de_passe) {
      return new Response(JSON.stringify({
        error: 'Identifiant et mot de passe requis'
      }), { status: 400 });
    }

    // Vérifier si l'identifiant existe déjà
    const existingUser = await db.query(
      'SELECT identifiant FROM compte WHERE identifiant = $1',
      [identifiant]
    );

    if (existingUser.rows.length > 0) {
      return new Response(JSON.stringify({
        error: 'Cet identifiant est déjà utilisé'
      }), { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insérer le nouveau compte
    await db.query(
      'INSERT INTO compte (identifiant, mot_de_passe) VALUES ($1, $2)',
      [identifiant, hashedPassword]
    );

    return new Response(JSON.stringify({
      message: 'Compte créé avec succès'
    }), { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    return new Response(JSON.stringify({
      error: 'Erreur serveur'
    }), { status: 500 });
  }
}
