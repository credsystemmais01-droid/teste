import { getUserId } from "@/lib/auth";
import {
  clampBlueScreenDuration,
  clampBlueScreenSize,
  normalizeBlueScreenBg,
  normalizeBlueScreenMode,
  type BlueScreenState,
} from "@/lib/blueScreen";
import { db, ensureSchema } from "@/lib/db";
import { clampTrialDays, DEFAULT_TRIAL_DAYS } from "@/lib/trial";

const OWNER_EMAILS = ["brunoacre07@gmail.com", "guardian.support@gmail.com"];

export function adminEmails() {
  const fromEnv = String(process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...OWNER_EMAILS, ...fromEnv]));
}

export function isAdminEmail(email: string) {
  return adminEmails().includes(email.trim().toLowerCase());
}

export async function requireAdmin() {
  const userId = await getUserId();
  if (!userId) return null;
  await ensureSchema();
  const rows = await db()`SELECT id, email FROM users WHERE id = ${userId} LIMIT 1`;
  const user = rows[0];
  if (!user || !isAdminEmail(String(user.email))) return null;
  return { id: String(user.id), email: String(user.email) };
}

export async function getSetting(key: string) {
  await ensureSchema();
  const rows = await db()`SELECT value FROM settings WHERE key = ${key} LIMIT 1`;
  return rows[0] ? String(rows[0].value) : "";
}

export async function upsertSetting(key: string, value: string) {
  await ensureSchema();
  const sql = db();
  await sql`
    INSERT INTO settings (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}
  `;
}

export async function getDefaultPanelName() {
  return getSetting("default_panel_name");
}

export async function getBlueScreenText() {
  return getSetting("blue_screen_text");
}

export async function getBlueScreenSize() {
  return clampBlueScreenSize(await getSetting("blue_screen_size"));
}

export async function getBlueScreenState(): Promise<BlueScreenState> {
  await ensureSchema();
  const rows = await db()`
    SELECT key, value FROM settings
    WHERE key IN ('blue_screen_text', 'blue_screen_size', 'blue_screen_mode',
                  'blue_screen_duration', 'blue_screen_started_at', 'blue_screen_bg')
  `;
  const map = new Map(rows.map((row) => [String(row.key), String(row.value)]));
  const startedAt = Number(map.get("blue_screen_started_at"));
  return {
    text: map.get("blue_screen_text") || "",
    size: clampBlueScreenSize(map.get("blue_screen_size")),
    mode: normalizeBlueScreenMode(map.get("blue_screen_mode")),
    duration: clampBlueScreenDuration(map.get("blue_screen_duration")),
    startedAt: Number.isFinite(startedAt) ? startedAt : 0,
    bg: normalizeBlueScreenBg(map.get("blue_screen_bg")),
  };
}

export async function getDefaultRemoveDiagnosis() {
  return getSetting("default_remove_diagnosis");
}

export function resolvePanelName(userPanelName: unknown) {
  return String(userPanelName || "").trim();
}

export function clampLogSeconds(value: unknown, fallback = 8) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(300, Math.max(2, Math.round(n)));
}

export function resolveLogReadSeconds(userSeconds: unknown, defaultSeconds: unknown) {
  const userN = Number(userSeconds);
  if (Number.isFinite(userN) && userN > 0) return clampLogSeconds(userN);
  return clampLogSeconds(defaultSeconds, 8);
}

export async function getDefaultLogReadSeconds() {
  return clampLogSeconds(await getSetting("default_log_read_seconds"), 8);
}

export async function getTrialDays() {
  return clampTrialDays(await getSetting("trial_days"), DEFAULT_TRIAL_DAYS);
}

export async function isTrialEnabled() {
  const raw = (await getSetting("trial_enabled")).trim();
  if (!raw) return true;
  return raw !== "0" && raw.toLowerCase() !== "false";
}

export function resolveRemoveDiagnosis(
  userText: unknown,
  enabled: unknown,
  defaultText: string,
) {
  const on = enabled === true || enabled === "t" || enabled === "true";
  if (!on) return { enabled: false, text: "" };
  const text = String(userText || "").trim() || defaultText.trim();
  if (!text) return { enabled: false, text: "" };
  return { enabled: true, text };
}
