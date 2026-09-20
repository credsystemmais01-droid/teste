import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { MACHINE_STATUSES, MAX_MACHINES, normalizeMachineName } from "@/lib/machines";

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const machineName = normalizeMachineName(body.machineName);
  const machineId = String(body.machineId || "").trim();
  const status = String(body.status || "scanned");
  if (machineName.length < 2) {
    return NextResponse.json({ error: "Informe o nome desta máquina." }, { status: 400 });
  }
  if (!MACHINE_STATUSES.includes(status as (typeof MACHINE_STATUSES)[number])) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  await ensureSchema();
  const sql = db();
  const mine = await sql`
    SELECT id FROM machines WHERE user_id = ${userId} ORDER BY created_at ASC
  `;
  const target = machineId
    ? mine.find((item) => String(item.id) === machineId)
    : mine[mine.length - 1];

  if (machineId && !target) {
    return NextResponse.json({ error: "Computador não encontrado nesta conta." }, { status: 404 });
  }

  if (target) {
    const rows = await sql`
      UPDATE machines
      SET machine_name = ${machineName}, status = ${status}
      WHERE id = ${target.id} AND user_id = ${userId}
      RETURNING id, machine_name, status, gmail
    `;
    return NextResponse.json({
      machine: {
        id: rows[0].id,
        name: rows[0].machine_name,
        status: rows[0].status,
        gmail: rows[0].gmail || "",
      },
    });
  }

  if (mine.length >= MAX_MACHINES) {
    return NextResponse.json(
      { error: `Esta conta já está com ${MAX_MACHINES} computadores conectados.` },
      { status: 409 },
    );
  }

  const rows = await sql`
    INSERT INTO machines (user_id, machine_name, status)
    VALUES (${userId}, ${machineName}, ${status})
    RETURNING id, machine_name, status, gmail
  `;
  return NextResponse.json({
    machine: {
      id: rows[0].id,
      name: rows[0].machine_name,
      status: rows[0].status,
      gmail: rows[0].gmail || "",
    },
  });
}
