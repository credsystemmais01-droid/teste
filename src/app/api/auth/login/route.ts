import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, ensureSchema } from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  await ensureSchema();
  const rows = await db()`
    SELECT id, password_hash FROM users WHERE email = ${email} LIMIT 1
  `;
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, String(user.password_hash)))) {
    return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
  }

  await setSession(String(user.id));
  return NextResponse.json({ ok: true });
}
