import { db, ensureSchema } from "@/lib/db";
import { ANNUAL } from "@/lib/pricing";

export async function activatePaidPlan(userId: string, providerRef: string) {
  await ensureSchema();
  const sql = db();
  const existing = await sql`
    SELECT id FROM subscriptions
    WHERE user_id = ${userId} AND provider_ref = ${providerRef}
    LIMIT 1
  `;
  if (existing[0]) return;

  await sql`
    INSERT INTO subscriptions (user_id, plan, status, provider_ref)
    VALUES (${userId}, ${ANNUAL.id}, 'active', ${providerRef})
  `;
  await sql`
    UPDATE machines SET status = 'protected'
    WHERE user_id = ${userId}
  `;
}
