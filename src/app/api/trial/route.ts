import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { getTrialDays, isTrialEnabled } from "@/lib/admin";
import { buildTrialState } from "@/lib/trial";

export async function POST() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  await ensureSchema();
  const sql = db();
  const days = await getTrialDays();

  if (!(await isTrialEnabled())) {
    return NextResponse.json(
      { error: "O teste grátis está fechado no momento." },
      { status: 403 },
    );
  }

  const rows = await sql`
    SELECT trial_started_at FROM users WHERE id = ${userId} LIMIT 1
  `;
  if (!rows[0]) return NextResponse.json({ error: "Conta não encontrada" }, { status: 401 });

  if (rows[0].trial_started_at) {
    const state = buildTrialState(rows[0].trial_started_at, days);
    return NextResponse.json(
      {
        error: state.active
          ? "O seu teste grátis já está rodando."
          : "Esta conta já usou o teste grátis. Para seguir protegido, ative o acesso vitalício.",
        trial: state,
      },
      { status: 409 },
    );
  }

  const started = await sql`
    UPDATE users SET trial_started_at = now()
    WHERE id = ${userId} AND trial_started_at IS NULL
    RETURNING trial_started_at
  `;
  const startedAt = started[0]?.trial_started_at;

  return NextResponse.json({ trial: buildTrialState(startedAt, days) });
}
