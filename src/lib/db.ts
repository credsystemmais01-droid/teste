import { neon } from "@neondatabase/serverless";

let ready: Promise<void> | null = null;
let migrated = false;

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
      await db`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`;
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  await ready;
  if (migrated) return;
  const migrate = sql();
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS panel_name TEXT`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS remove_diagnosis TEXT`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS remove_diagnosis_enabled BOOLEAN NOT NULL DEFAULT false`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS log_read_seconds INTEGER`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf TEXT`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT`;
  await migrate`ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'email'`;
  await migrate`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`;
  migrated = true;
}

export function db() {
  return sql();
}
