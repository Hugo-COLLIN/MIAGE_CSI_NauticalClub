import type { APIRoute } from 'astro';
import { db } from '../../../db';

export const prerender = false;

// PUT - Mettre à jour un client
export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const data = await request.json();
    const clientId = params.id;

    if (!clientId) {
      return new Response(JSON.stringify({
        error: 'ID client manquant'
      }), { status: 400 });
    }

    const result = await db.query(
      `UPDATE Client 
       SET nom = $1, prenom = $2, email = $3, telephone = $4, 
           piece_identite = $5, id_camping = $6
       WHERE id_client = $7
       RETURNING *`,
      [data.nom, data.prenom, data.email, data.telephone,
        data.piece_identite, data.id_camping, clientId]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({
        error: 'Client non trouvé'
      }), { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
};

// DELETE - Supprimer un client
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const clientId = params.id;

    if (!clientId) {
      return new Response(JSON.stringify({
        error: 'ID client manquant'
      }), { status: 400 });
    }

    const result = await db.query(
      'DELETE FROM Client WHERE id_client = $1',
      [clientId]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({
        error: 'Client non trouvé'
      }), { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
};
