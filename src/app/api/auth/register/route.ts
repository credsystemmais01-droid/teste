import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, ensureSchema } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { parseProfile } from "@/lib/profile";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const confirm = String(body.confirm || "");
  const accepted = Boolean(body.accepted);
  const profile = parseProfile(body);

  if ("error" in profile) {
    return NextResponse.json({ error: profile.error }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "A senha precisa ter 6 ou mais caracteres." }, { status: 400 });
  }
  if (password !== confirm) {
    return NextResponse.json({ error: "As senhas não são iguais." }, { status: 400 });
  }
  if (!accepted) {
    return NextResponse.json({ error: "Aceite os termos para criar a conta." }, { status: 400 });
  }

  await ensureSchema();
  const sql = db();
  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length) {
    return NextResponse.json({ error: "Este e-mail já tem conta." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO users (
      email, password_hash, display_name, full_name, cpf, phone, city, auth_provider
    )
    VALUES (
      ${email}, ${passwordHash}, ${profile.fullName}, ${profile.fullName},
      ${profile.cpf}, ${profile.phone}, ${profile.city}, ${"email"}
    )
    RETURNING id
  `;
  await setSession(String(rows[0].id));
  return NextResponse.json({ ok: true });
}
