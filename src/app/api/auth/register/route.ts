import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, ensureSchema } from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email.includes("@") || password.length < 6) {
    return NextResponse.json(
      { error: "Preencha e-mail válido e senha com 6+ caracteres." },
      { status: 400 },
    );
  }

  await ensureSchema();
  const sql = db();
  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length) {
    return NextResponse.json({ error: "Este e-mail já tem conta." }, { status: 409 });
  }

  const accountLabel = email.split("@")[0] || "conta";
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO users (email, password_hash, display_name)
    VALUES (${email}, ${passwordHash}, ${accountLabel})
    RETURNING id
  `;
  await setSession(String(rows[0].id));
  return NextResponse.json({ ok: true });
}
