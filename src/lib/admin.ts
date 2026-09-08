import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";

export function adminEmails() {
  const raw = process.env.ADMIN_EMAIL || "credsystem.mais01@gmail.com";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
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

export async function getDefaultPanelName() {
  await ensureSchema();
  const rows = await db()`SELECT value FROM settings WHERE key = 'default_panel_name' LIMIT 1`;
  return rows[0] ? String(rows[0].value) : "";
}

export function resolvePanelName(userPanelName: unknown, defaultName: string) {
  const chosen = String(userPanelName || "").trim();
  if (chosen) return chosen;
  return defaultName.trim();
}
