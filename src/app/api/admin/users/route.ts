import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { getDefaultPanelName, requireAdmin, resolvePanelName } from "@/lib/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });

  await ensureSchema();
  const defaultName = await getDefaultPanelName();
  const rows = await db()`
    SELECT id, email, display_name, panel_name, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  return NextResponse.json({
    defaultPanelName: defaultName,
    users: rows.map((row) => ({
      id: row.id,
      email: row.email,
      accountLabel: row.display_name,
      panelName: row.panel_name || "",
      resolvedName: resolvePanelName(row.panel_name, defaultName),
      createdAt: row.created_at,
    })),
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const userId = String(body.userId || "");
  const panelName = String(body.panelName || "").trim();
  if (!userId) {
    return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  }

  await ensureSchema();
  await db()`UPDATE users SET panel_name = ${panelName || null} WHERE id = ${userId}`;
  return NextResponse.json({ ok: true });
}
