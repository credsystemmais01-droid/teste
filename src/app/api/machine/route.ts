import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const machineName = String(body.machineName || "").trim();
  const status = String(body.status || "scanned");
  const allowed = ["disconnected", "scanned", "threat", "protected"];
  if (machineName.length < 2) {
    return NextResponse.json({ error: "Informe o nome desta máquina." }, { status: 400 });
  }
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  await ensureSchema();
  const sql = db();
  const existing = await sql`
    SELECT id FROM machines WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1
  `;

  if (existing[0]) {
    const rows = await sql`
      UPDATE machines
      SET machine_name = ${machineName}, status = ${status}
      WHERE id = ${existing[0].id}
      RETURNING id, machine_name, status
    `;
    return NextResponse.json({
      machine: { id: rows[0].id, name: rows[0].machine_name, status: rows[0].status },
    });
  }

  const rows = await sql`
    INSERT INTO machines (user_id, machine_name, status)
    VALUES (${userId}, ${machineName}, ${status})
    RETURNING id, machine_name, status
  `;
  return NextResponse.json({
    machine: { id: rows[0].id, name: rows[0].machine_name, status: rows[0].status },
  });
}
