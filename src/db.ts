import pg from 'pg';

// Make sure we DO NOT "prerender" this function to allow the ENV variables to update on the fly
export const prerender = false;

const pool = new pg.Pool({
  host: import.meta.env.DB_HOST,
  port: import.meta.env.DB_PORT,
  database: import.meta.env.DB_NAME,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
});

export { pool as db };
