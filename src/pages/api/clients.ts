import type { APIRoute } from 'astro';
import { db } from '../../db';

export const prerender = false;

// GET - Récupérer tous les clients
export const GET: APIRoute = async () => {
  try {
    const result = await db.query('SELECT * FROM Client ORDER BY nom, prenom');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
};

// POST - Créer un nouveau client
// api/clients.ts

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validation des données
    // console.log(data)
    if (!data.nom || !data.prenom || !data.email || !data.telephone) {
      return new Response(JSON.stringify({
        error: 'Tous les champs obligatoires doivent être remplis'
      }), { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO Client (nom, prenom, email, telephone, piece_identite, id_camping)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
      [data.nom, data.prenom, data.email, data.telephone, data.piece_identite, data.id_camping]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return new Response(JSON.stringify({
      error: 'Erreur serveur',
      details: error.message
    }), { status: 500 });
  }
};


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
