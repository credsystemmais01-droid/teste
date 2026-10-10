export const PIX_DEMO_CENTS = 422_700;
export const PIX_DEMO_NAME = "Criptografia Security z1";

const CHARGE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function buildPixPayload(origin?: string, chargeId?: string) {
  const parts = [`LPPIX`, `1`, String(PIX_DEMO_CENTS), PIX_DEMO_NAME];
  if (origin) parts.push(origin);
  if (chargeId) parts.push(chargeId);
  return parts.join("|");
}

export function parsePixPayload(raw: string) {
  const parts = raw.trim().split("|");
  if (parts[0] !== "LPPIX" || parts[1] !== "1") return null;
  const cents = Number(parts[2]);
  if (!Number.isFinite(cents) || cents !== PIX_DEMO_CENTS) return null;
  const rest = parts.slice(3);
  let chargeId: string | null = null;
  let origin: string | null = null;
  const tail = rest[rest.length - 1];
  if (tail && CHARGE_ID.test(tail)) {
    chargeId = rest.pop() ?? null;
  }
  const site = rest[rest.length - 1];
  if (site && /^https?:\/\//.test(site)) {
    origin = rest.pop() ?? null;
  }
  const name = rest.join("|").trim();
  if (name !== PIX_DEMO_NAME || !chargeId) return null;
  return { cents, name, origin, chargeId };
}
