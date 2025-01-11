import pg from 'pg';

// Make sure we DO NOT "prerender" this function to allow the ENV variables to update on the fly
export const prerender = false;

console.log(import.meta.env.DB_HOST);

const client = new pg.Client({
  host: import.meta.env.DB_HOST,
  port: import.meta.env.DB_PORT,
  database: import.meta.env.DB_NAME,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
});

await client.connect()

export { client as db };
