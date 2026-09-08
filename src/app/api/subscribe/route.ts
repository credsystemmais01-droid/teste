import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { PLANS } from "@/lib/symptoms";

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const plan = String(body.plan || "");
  if (!PLANS.some((item) => item.id === plan)) {
    return NextResponse.json({ error: "Escolha um pacote." }, { status: 400 });
  }

  await ensureSchema();
  const sql = db();
  await sql`
    INSERT INTO subscriptions (user_id, plan, status, provider_ref)
    VALUES (${userId}, ${plan}, 'active', 'demo')
  `;
  await sql`
    UPDATE machines SET status = 'protected'
    WHERE user_id = ${userId}
  `;
  return NextResponse.json({ ok: true });
}
