import { db, ensureSchema } from "@/lib/db";

export type PixPaymentState = {
  paid: boolean;
  cents: number;
  name: string;
  paidAt: string | null;
};

const KEY = "pix_payment";

const empty: PixPaymentState = {
  paid: false,
  cents: 0,
  name: "",
  paidAt: null,
};

export async function readPixPayment(): Promise<PixPaymentState> {
  await ensureSchema();
  const rows = await db()`SELECT value FROM settings WHERE key = ${KEY} LIMIT 1`;
  if (!rows[0]) return empty;
  try {
    const data = JSON.parse(String(rows[0].value)) as PixPaymentState;
    if (!data || typeof data.paid !== "boolean") return empty;
    return data;
  } catch {
    return empty;
  }
}

export async function markPixPaid(cents: number, name: string): Promise<PixPaymentState> {
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
    VALUES (${KEY}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  return next;
}
