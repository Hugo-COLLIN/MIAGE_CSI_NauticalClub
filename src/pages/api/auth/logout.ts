import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  // Supprimer le cookie token
  cookies.delete('token', {
    path: '/',
  });

  return new Response(JSON.stringify({
    success: true
  }));
};
