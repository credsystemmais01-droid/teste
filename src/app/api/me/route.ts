import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import {
  getDefaultLogReadSeconds,
  getDefaultRemoveDiagnosis,
  getTrialDays,
  isAdminEmail,
  isTrialEnabled,
  resolveLogReadSeconds,
  resolvePanelName,
  resolveRemoveDiagnosis,
} from "@/lib/admin";
import { isProfileComplete } from "@/lib/profile";
import { MAX_MACHINES } from "@/lib/machines";
import { buildTrialState } from "@/lib/trial";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  await ensureSchema();
  const sql = db();
  const users = await sql`
    SELECT id, email, panel_name, remove_diagnosis, remove_diagnosis_enabled, log_read_seconds,
           full_name, cpf, phone, auth_provider, trial_started_at
    FROM users WHERE id = ${userId} LIMIT 1
  `;
  const user = users[0];
  if (!user) return NextResponse.json({ error: "Conta não encontrada" }, { status: 401 });

  const machines = await sql`
    SELECT id, machine_name, status, gmail FROM machines
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `;
  const diagnoses = await sql`
    SELECT symptoms FROM diagnoses
    WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT 1
  `;
  const subs = await sql`
    SELECT plan, status FROM subscriptions
    WHERE user_id = ${userId} AND status = 'active'
    ORDER BY created_at DESC LIMIT 1
  `;

  const trialDays = await getTrialDays();
  const trialEnabled = await isTrialEnabled();
  const trial = buildTrialState(user.trial_started_at, trialDays);
  const defaultDiagnosis = await getDefaultRemoveDiagnosis();
  const defaultLogReadSeconds = await getDefaultLogReadSeconds();
  const panelName = resolvePanelName(user.panel_name);
  const removeDiagnosis = resolveRemoveDiagnosis(
    user.remove_diagnosis,
    user.remove_diagnosis_enabled,
    defaultDiagnosis,
  );

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      panelName,
      fullName: user.full_name || "",
      authProvider: user.auth_provider || "email",
    },
    profileComplete: isProfileComplete(user),
    removeDiagnosis,
    logReadSeconds: resolveLogReadSeconds(user.log_read_seconds, defaultLogReadSeconds),
    isAdmin: isAdminEmail(String(user.email)),
    machine: machines[0]
      ? { id: machines[0].id, name: machines[0].machine_name, status: machines[0].status }
      : null,
    machines: machines.map((item) => ({
      id: String(item.id),
      name: item.machine_name,
      status: item.status,
      gmail: item.gmail || "",
    })),
    machineLimit: MAX_MACHINES,
    symptoms: (diagnoses[0]?.symptoms as string[] | undefined) || [],
    subscription: subs[0] ? { plan: subs[0].plan, status: subs[0].status } : null,
    trial: { ...trial, enabled: trialEnabled },
    access: Boolean(subs[0]) || trial.active,
  });
}
