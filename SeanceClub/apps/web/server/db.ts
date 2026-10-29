import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL n'est pas définie");
}

export const pool = new Pool({ connectionString });

export function query<T extends object = Record<string, unknown>>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}
