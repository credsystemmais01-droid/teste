import { db, ensureSchema } from "@/lib/db";

export type PixPaymentState = {
  paid: boolean;
  cents: number;
  name: string;
  paidAt: string | null;
};

const empty: PixPaymentState = {
  paid: false,
  cents: 0,
  name: "",
  paidAt: null,
};

function chargeKey(chargeId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chargeId)) {
    return null;
  }
  return `pix_charge_${chargeId}`;
}

export async function readPixPayment(chargeId: string): Promise<PixPaymentState> {
  const key = chargeKey(chargeId);
  if (!key) return empty;
  await ensureSchema();
  const rows = await db()`SELECT value FROM settings WHERE key = ${key} LIMIT 1`;
  if (!rows[0]) return empty;
  try {
    const data = JSON.parse(String(rows[0].value)) as PixPaymentState;
    if (!data || data.paid !== true) return empty;
    return data;
  } catch {
    return empty;
  }
}

export async function markPixPaid(chargeId: string, cents: number, name: string): Promise<PixPaymentState> {
  const key = chargeKey(chargeId);
  if (!key) return empty;
  await ensureSchema();
  const next: PixPaymentState = {
    paid: true,
    cents,
    name,
    paidAt: new Date().toISOString(),
  };
  const value = JSON.stringify(next);
  await db()`
    INSERT INTO settings (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  return next;
}
