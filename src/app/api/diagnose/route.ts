import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const symptoms = Array.isArray(body.symptoms)
    ? body.symptoms.map((item: unknown) => String(item).trim()).filter(Boolean)
    : [];
  if (!symptoms.length) {
    return NextResponse.json({ error: "Marque pelo menos um sintoma." }, { status: 400 });
  }

  await ensureSchema();
  const sql = db();
  const machines = await sql`
    SELECT id FROM machines WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1
  `;
  const machineId = machines[0]?.id || null;
  const payload = JSON.stringify(symptoms);

  await sql`
    INSERT INTO diagnoses (user_id, machine_id, symptoms)
    VALUES (${userId}, ${machineId}, ${payload}::jsonb)
  `;
  if (machineId) {
    await sql`UPDATE machines SET status = 'threat' WHERE id = ${machineId}`;
  }

  return NextResponse.json({ ok: true, symptoms });
}
