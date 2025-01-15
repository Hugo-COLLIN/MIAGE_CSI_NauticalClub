import jwt from 'jsonwebtoken';

interface JWTPayload {
  identifiant: string;
  // autres champs si nécessaire
}

export async function checkAuth(Astro: any) {
  const token = Astro.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const user = jwt.verify(token, import.meta.env.JWT_SECRET) as JWTPayload;
    return user;
  } catch (error) {
    // Si le token est invalide, on supprime le cookie
    Astro.cookies.delete('token');
    return null;
  }
}
