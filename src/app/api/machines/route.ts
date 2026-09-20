import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { MAX_MACHINES, isGmail, normalizeGmail, normalizeMachineName } from "@/lib/machines";

type Row = { id: string; machine_name: string; status: string; gmail: string | null };

function toMachine(row: Row) {
  return {
    id: String(row.id),
    name: row.machine_name,
    status: row.status,
    gmail: row.gmail || "",
  };
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  await ensureSchema();
  const rows = (await db()`
    SELECT id, machine_name, status, gmail FROM machines
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `) as Row[];

  return NextResponse.json({ machines: rows.map(toMachine), limit: MAX_MACHINES });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const machineName = normalizeMachineName(body.machineName);
  const gmail = normalizeGmail(body.gmail);

  if (machineName.length < 2) {
    return NextResponse.json({ error: "Dê um nome para este computador." }, { status: 400 });
  }
  if (!isGmail(gmail)) {
    return NextResponse.json(
      { error: "Informe o Gmail deste computador (exemplo: nome@gmail.com)." },
      { status: 400 },
    );
  }

  await ensureSchema();
  const sql = db();

  const mine = (await sql`
    SELECT id, machine_name, status, gmail FROM machines
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `) as Row[];

  if (mine.length >= MAX_MACHINES) {
    return NextResponse.json(
      { error: `Esta conta já está com ${MAX_MACHINES} computadores conectados. Desconecte um para liberar a vaga.` },
      { status: 409 },
    );
  }

  const taken = await sql`
    SELECT user_id FROM machines WHERE lower(gmail) = ${gmail} LIMIT 1
  `;
  if (taken[0]) {
    const sameAccount = String(taken[0].user_id) === userId;
    return NextResponse.json(
      {
        error: sameAccount
          ? "Este Gmail já está conectado nesta conta."
          : "Este Gmail já está conectado em outra conta.",
      },
      { status: 409 },
    );
  }

  const rows = (await sql`
    INSERT INTO machines (user_id, machine_name, status, gmail)
    VALUES (${userId}, ${machineName}, 'scanned', ${gmail})
    RETURNING id, machine_name, status, gmail
  `) as Row[];

  return NextResponse.json({ machine: toMachine(rows[0]) });
}

export async function DELETE(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "Computador não informado." }, { status: 400 });

  await ensureSchema();
  const rows = await db()`
    DELETE FROM machines WHERE id = ${id} AND user_id = ${userId} RETURNING id
  `;
  if (!rows[0]) {
    return NextResponse.json({ error: "Computador não encontrado nesta conta." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
