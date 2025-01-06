import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { pool } from '../../db';

export const auth = lucia({
  adapter: postgresAdapter(pool, {
    user: "personnel",
    key: "auth_key",
    session: "user_session"
  }),
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: astro(),
  getUserAttributes: (data) => {
    return {
      id: data.id,
      email: data.email,
      role: data.role
    };
  }
});

export type Auth = typeof auth;
