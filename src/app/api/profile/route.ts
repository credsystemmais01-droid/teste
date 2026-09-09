import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { isProfileComplete, parseProfile } from "@/lib/profile";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  await ensureSchema();
  const rows = await db()`
    SELECT full_name, cpf, phone, city FROM users WHERE id = ${userId} LIMIT 1
  `;
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "Conta não encontrada" }, { status: 401 });
  return NextResponse.json({
    fullName: user.full_name || "",
    cpf: user.cpf || "",
    phone: user.phone || "",
    city: user.city || "",
    profileComplete: isProfileComplete(user),
  });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const profile = parseProfile(body);
  if ("error" in profile) {
    return NextResponse.json({ error: profile.error }, { status: 400 });
  }

  await ensureSchema();
  await db()`
    UPDATE users
    SET full_name = ${profile.fullName},
        display_name = ${profile.fullName},
        cpf = ${profile.cpf},
        phone = ${profile.phone},
        city = ${profile.city}
    WHERE id = ${userId}
  `;
  return NextResponse.json({ ok: true });
}
