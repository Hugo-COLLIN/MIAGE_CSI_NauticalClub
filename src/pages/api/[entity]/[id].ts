import type { APIRoute } from 'astro';
import { CrudApiService } from '../../../services/crud-api/CrudApiService.ts';
import { TABLES_CONFIG } from '../../../services/crud-api/config-tables.ts';

export const prerender = false;

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { entity, id } = params;
    const config = TABLES_CONFIG[entity];

    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Entité non trouvée' }),
        { status: 404 }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID manquant' }),
        { status: 400 }
      );
    }

    const service = new CrudApiService(config);
    const data = await request.json();
    const result = await service.update(id, data);

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Enregistrement non trouvé' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { entity, id } = params;
    const config = TABLES_CONFIG[entity];

    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Entité non trouvée' }),
        { status: 404 }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID manquant' }),
        { status: 400 }
      );
    }

    const service = new CrudApiService(config);
    const success = await service.delete(id);

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Enregistrement non trouvé' }),
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
};
