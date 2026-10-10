import { db, ensureSchema } from "@/lib/db";
import { getPlan } from "@/lib/pricing";

export async function activatePaidPlan(userId: string, providerRef: string, planId: string) {
  await ensureSchema();
  const sql = db();
  const existing = await sql`
    SELECT id FROM subscriptions
    WHERE user_id = ${userId} AND (provider_ref = ${providerRef} OR status = 'active')
    LIMIT 1
  `;
  if (existing[0]) {
    await sql`
      UPDATE machines SET status = 'protected'
      WHERE user_id = ${userId}
    `;
    return;
  }

  await sql`
    INSERT INTO subscriptions (user_id, plan, status, provider_ref)
    VALUES (${userId}, ${getPlan(planId)?.id || planId || "assinatura"}, 'active', ${providerRef})
  `;
  await sql`
    UPDATE machines SET status = 'protected'
    WHERE user_id = ${userId}
  `;
}
