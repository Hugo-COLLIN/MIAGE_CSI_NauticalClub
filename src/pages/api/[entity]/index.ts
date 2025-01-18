import type { APIRoute } from 'astro';
import { CrudApiService } from '../../../services/crud-api/CrudApiService.ts';
import { TABLES_CONFIG } from '../../../services/crud-api/config-tables.ts';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const entity = params.entity as string;
    const config = TABLES_CONFIG[entity];

    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Entité non trouvée' }),
        { status: 404 }
      );
    }

    const service = new CrudApiService(config);
    const results = await service.getAll();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const entity = params.entity as string;
    const config = TABLES_CONFIG[entity];

    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Entité non trouvée' }),
        { status: 404 }
      );
    }

    const service = new CrudApiService(config);
    const data = await request.json();
    const result = await service.create(data);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erreur:', error);
    const status = error.name === 'ValidationError' ? 400 : 500;
    return new Response(
      JSON.stringify({ error: error.message }),
      { status }
    );
  }
};
