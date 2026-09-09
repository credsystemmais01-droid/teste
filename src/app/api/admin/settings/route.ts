import { NextResponse } from "next/server";
import { requireAdmin, upsertSetting } from "@/lib/admin";

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });

  const body = await request.json().catch(() => ({}));

  if (body.defaultPanelName !== undefined) {
    await upsertSetting("default_panel_name", String(body.defaultPanelName || "").trim());
  }
  if (body.defaultRemoveDiagnosis !== undefined) {
    await upsertSetting("default_remove_diagnosis", String(body.defaultRemoveDiagnosis || "").trim());
  }
  if (body.defaultLogReadSeconds !== undefined) {
    const seconds = Number(body.defaultLogReadSeconds);
    await upsertSetting(
      "default_log_read_seconds",
      String(Number.isFinite(seconds) && seconds > 0 ? Math.min(300, Math.max(2, Math.round(seconds))) : 8),
    );
  }

  return NextResponse.json({ ok: true });
}
