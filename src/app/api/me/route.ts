import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { getDefaultPanelName, isAdminEmail, resolvePanelName } from "@/lib/admin";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  await ensureSchema();
  const sql = db();
  const users = await sql`
    SELECT id, email, panel_name FROM users WHERE id = ${userId} LIMIT 1
  `;
  const user = users[0];
  if (!user) return NextResponse.json({ error: "Conta não encontrada" }, { status: 401 });

  const machines = await sql`
    SELECT id, machine_name, status FROM machines
    WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT 1
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

  const defaultName = await getDefaultPanelName();
  const panelName = resolvePanelName(user.panel_name, defaultName);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      panelName,
    },
    isAdmin: isAdminEmail(String(user.email)),
    machine: machines[0]
      ? { id: machines[0].id, name: machines[0].machine_name, status: machines[0].status }
      : null,
    symptoms: (diagnoses[0]?.symptoms as string[] | undefined) || [],
    subscription: subs[0] ? { plan: subs[0].plan, status: subs[0].status } : null,
  });
}
