import type { APIRoute } from 'astro';
import { db } from '../../../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const data = JSON.parse(body);
    const { identifiant, mot_de_passe } = data;

    if (!identifiant || !mot_de_passe) {
      return new Response(JSON.stringify({
        error: 'Identifiant et mot de passe requis'
      }), { status: 400 });
    }

    const result = await db.query(
      'SELECT * FROM compte WHERE identifiant = $1',
      [identifiant]
    );

    const user = result.rows[0];

    console.log('user', user)

    if (!user) {
      return new Response(JSON.stringify({
        error: 'Identifiants incorrects'
      }), { status: 401 });
    }

    // Comparaison directe entre le mot de passe en clair et le hash stocké
    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    const user_mdp = await bcrypt.hash(user.mot_de_passe, 10);
    console.log('user_mdp', user_mdp);

    if (!validPassword) {
      return new Response(JSON.stringify({
        error: 'Identifiants incorrects'
      }), { status: 401 });
    }

    const token = jwt.sign(
      {
        identifiant: user.identifiant,
      },
      import.meta.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return new Response(JSON.stringify({
      token,
      user: {
        identifiant: user.identifiant,
      }
    }));
  } catch (error) {
    console.error('Erreur de login:', error);
    return new Response(JSON.stringify({
      error: 'Erreur serveur',
    }), { status: 500 });
  }
}
