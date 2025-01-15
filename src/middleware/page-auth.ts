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

export async function ensureAuth(Astro: any) {
  const user = await checkAuth(Astro);
  if (!user) {
    return Astro.redirect('/login');
  }
  return user;
}

export async function requireAuth(Astro: any, redirectTo = '/login') {
  const user = await checkAuth(Astro); // Assurez-vous que checkAuth est correctement importé
  if (!user) {
    Astro.redirect(redirectTo); // Effectue la redirection
    return null; // Arrête l'exécution du reste du code
  }
  return user; // Retourne l'utilisateur authentifié si présent
}
