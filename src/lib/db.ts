import { neon } from "@neondatabase/serverless";

let ready: Promise<void> | null = null;

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL ausente");
  return neon(url);
}

export async function ensureSchema() {
  if (!ready) {
    const db = sql();
    ready = (async () => {
      await db`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      )`;
      await db`CREATE TABLE IF NOT EXISTS machines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        machine_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'disconnected',
        created_at TIMESTAMPTZ DEFAULT now()
      )`;
      await db`CREATE TABLE IF NOT EXISTS diagnoses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        machine_id UUID REFERENCES machines(id) ON DELETE SET NULL,
        symptoms JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      )`;
      await db`CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        provider_ref TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      )`;
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  await ready;
}

export function db() {
  return sql();
}
