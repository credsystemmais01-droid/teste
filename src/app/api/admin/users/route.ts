import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import {
  getDefaultLogReadSeconds,
  getDefaultRemoveDiagnosis,
  requireAdmin,
  resolveLogReadSeconds,
  resolvePanelName,
  resolveRemoveDiagnosis,
} from "@/lib/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });

  await ensureSchema();
  const defaultDiagnosis = await getDefaultRemoveDiagnosis();
  const defaultLogReadSeconds = await getDefaultLogReadSeconds();
  const rows = await db()`
    SELECT id, email, display_name, panel_name, remove_diagnosis, remove_diagnosis_enabled, log_read_seconds, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  return NextResponse.json({
    defaultRemoveDiagnosis: defaultDiagnosis,
    defaultLogReadSeconds,
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
  const panelName = String(body.panelName || "").trim();
  const removeDiagnosis = String(body.removeDiagnosis || "").trim();
  const removeDiagnosisEnabled = Boolean(body.removeDiagnosisEnabled);
  const rawSeconds = String(body.logReadSeconds ?? "").trim();
  const parsedSeconds = Number(rawSeconds);
  const logReadSeconds =
    rawSeconds && Number.isFinite(parsedSeconds) && parsedSeconds > 0
      ? Math.min(180, Math.max(2, Math.round(parsedSeconds)))
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
