export const PIX_DEMO_CENTS = 422_700;
export const PIX_DEMO_NAME = "Criptografia Security z1";

export function buildPixPayload(origin?: string) {
  const base = `LPPIX|1|${PIX_DEMO_CENTS}|${PIX_DEMO_NAME}`;
  return origin ? `${base}|${origin}` : base;
}

export function parsePixPayload(raw: string) {
  const parts = raw.trim().split("|");
  if (parts[0] !== "LPPIX" || parts[1] !== "1") return null;
  const cents = Number(parts[2]);
  if (!Number.isFinite(cents) || cents !== PIX_DEMO_CENTS) return null;
  const rest = parts.slice(3);
  let origin: string | null = null;
  const last = rest[rest.length - 1];
  if (last && /^https?:\/\//.test(last)) {
    origin = rest.pop() ?? null;
  }
  const name = rest.join("|").trim();
  if (name !== PIX_DEMO_NAME) return null;
  return { cents, name, origin };
}
