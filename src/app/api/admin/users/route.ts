import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import {
  getDefaultLogReadSeconds,
  getDefaultRemoveDiagnosis,
  getTrialDays,
  isTrialEnabled,
  requireAdmin,
  resolveLogReadSeconds,
  resolvePanelName,
  resolveRemoveDiagnosis,
} from "@/lib/admin";
import { buildTrialState } from "@/lib/trial";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });

  await ensureSchema();
  const defaultDiagnosis = await getDefaultRemoveDiagnosis();
  const defaultLogReadSeconds = await getDefaultLogReadSeconds();
  const trialDays = await getTrialDays();
  const trialEnabled = await isTrialEnabled();
  const rows = await db()`
    SELECT u.id, u.email, u.display_name, u.panel_name, u.remove_diagnosis,
           u.remove_diagnosis_enabled, u.log_read_seconds, u.trial_started_at, u.created_at,
           (SELECT count(*) FROM subscriptions s WHERE s.user_id = u.id AND s.status = 'active') AS paid_count,
           (SELECT count(*) FROM machines m WHERE m.user_id = u.id) AS machine_count
    FROM users u
    ORDER BY u.created_at DESC
  `;

  return NextResponse.json({
    defaultRemoveDiagnosis: defaultDiagnosis,
    defaultLogReadSeconds,
    trialDays,
    trialEnabled,
    users: rows.map((row) => {
      const diagnosis = resolveRemoveDiagnosis(
        row.remove_diagnosis,
        row.remove_diagnosis_enabled,
        defaultDiagnosis,
      );
      return {
        id: row.id,
        email: row.email,
        accountLabel: row.display_name,
        panelName: row.panel_name || "",
        resolvedName: resolvePanelName(row.panel_name),
        removeDiagnosis: row.remove_diagnosis || "",
        removeDiagnosisEnabled: Boolean(row.remove_diagnosis_enabled),
        resolvedDiagnosis: diagnosis.enabled ? diagnosis.text : "",
        logReadSeconds: row.log_read_seconds ? Number(row.log_read_seconds) : "",
        resolvedLogReadSeconds: resolveLogReadSeconds(row.log_read_seconds, defaultLogReadSeconds),
        trial: buildTrialState(row.trial_started_at, trialDays),
        paid: Number(row.paid_count) > 0,
        machineCount: Number(row.machine_count),
        createdAt: row.created_at,
      };
    }),
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const userId = String(body.userId || "");
  const trialAction = String(body.trialAction || "");

  if (trialAction) {
    if (!userId) return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
    await ensureSchema();
    const sql = db();
    if (trialAction === "reset") {
      await sql`UPDATE users SET trial_started_at = NULL WHERE id = ${userId}`;
    } else if (trialAction === "start") {
      await sql`UPDATE users SET trial_started_at = now() WHERE id = ${userId}`;
    } else if (trialAction === "end") {
      await sql`UPDATE users SET trial_started_at = now() - interval '3650 days' WHERE id = ${userId}`;
    } else {
      return NextResponse.json({ error: "Ação de teste inválida." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  const panelName = String(body.panelName || "").trim();
  const removeDiagnosis = String(body.removeDiagnosis || "").trim();
  const removeDiagnosisEnabled = Boolean(body.removeDiagnosisEnabled);
  const rawSeconds = String(body.logReadSeconds ?? "").trim();
  const parsedSeconds = Number(rawSeconds);
  const logReadSeconds =
    rawSeconds && Number.isFinite(parsedSeconds) && parsedSeconds > 0
      ? Math.min(300, Math.max(2, Math.round(parsedSeconds)))
      : null;
  if (!userId) {
    return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  }

  await ensureSchema();
  const sql = db();
  await sql`
    UPDATE users
    SET
      panel_name = ${panelName || null},
      remove_diagnosis = ${removeDiagnosis || null},
      remove_diagnosis_enabled = ${removeDiagnosisEnabled},
      log_read_seconds = ${logReadSeconds}
    WHERE id = ${userId}
  `;
  return NextResponse.json({ ok: true });
}
