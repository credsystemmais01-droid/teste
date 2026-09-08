import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const defaultPanelName = String(body.defaultPanelName || "").trim();

  await ensureSchema();
  const sql = db();
  await sql`
    INSERT INTO settings (key, value)
    VALUES ('default_panel_name', ${defaultPanelName})
    ON CONFLICT (key) DO UPDATE SET value = ${defaultPanelName}
  `;
  return NextResponse.json({ ok: true });
}
