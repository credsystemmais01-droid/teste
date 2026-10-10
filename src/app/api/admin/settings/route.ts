import { NextResponse } from "next/server";
import { requireAdmin, upsertSetting } from "@/lib/admin";
import {
  clampBlueScreenDuration,
  clampBlueScreenSize,
  normalizeBlueScreenBg,
  normalizeBlueScreenMode,
} from "@/lib/blueScreen";
import { clampTrialDays } from "@/lib/trial";

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

  if (body.trialEnabled !== undefined) {
    await upsertSetting("trial_enabled", body.trialEnabled ? "1" : "0");
  }
  if (body.trialDays !== undefined) {
    await upsertSetting("trial_days", String(clampTrialDays(body.trialDays)));
  }
  if (body.blueScreenText !== undefined) {
    const text = String(body.blueScreenText ?? "").replace(/\r\n/g, "\n").slice(0, 5000);
    await upsertSetting("blue_screen_text", text);
  }
  if (body.blueScreenSize !== undefined) {
    await upsertSetting("blue_screen_size", String(clampBlueScreenSize(body.blueScreenSize)));
  }
  if (body.blueScreenMode !== undefined) {
    await upsertSetting("blue_screen_mode", normalizeBlueScreenMode(body.blueScreenMode));
  }
  if (body.blueScreenDuration !== undefined) {
    await upsertSetting("blue_screen_duration", String(clampBlueScreenDuration(body.blueScreenDuration)));
  }
  if (body.blueScreenBg !== undefined) {
    await upsertSetting("blue_screen_bg", normalizeBlueScreenBg(body.blueScreenBg));
  }
  if (body.blueScreenRestart) {
    await upsertSetting("blue_screen_started_at", String(Date.now()));
  }

  return NextResponse.json({ ok: true });
}
