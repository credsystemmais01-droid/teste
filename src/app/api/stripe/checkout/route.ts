import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { getPlan, type Plan } from "@/lib/pricing";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

async function resolvePriceId(stripe: Stripe, plan: Plan) {
  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
    expand: ["data.product"],
  });
  const match = prices.data.find((price) => {
    const product = price.product;
    const name = typeof product === "object" && product && "name" in product && !product.deleted
      ? product.name
      : "";
    return (
      name === plan.name &&
      price.unit_amount === plan.amountCents &&
      price.currency === plan.currency &&
      price.recurring?.interval === plan.interval
    );
  });
  return match?.id;
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const plan = getPlan(String(body.plan || ""));
  if (!plan) {
    return NextResponse.json({ error: "Escolha uma das três assinaturas." }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Pagamento Stripe ainda não configurado. Falta a chave da conta." },
      { status: 503 },
    );
  }

  await ensureSchema();
  const active = await db()`
    SELECT id FROM subscriptions
    WHERE user_id = ${userId} AND status = 'active'
    LIMIT 1
  `;
  if (active[0]) {
    return NextResponse.json(
      { error: "Esta conta já tem uma assinatura ativa. Não há segunda cobrança." },
      { status: 409 },
    );
  }

  const users = await db()`
    SELECT email, full_name, cpf, phone FROM users WHERE id = ${userId} LIMIT 1
  `;
  const email = users[0] ? String(users[0].email) : undefined;
  const fullName = users[0]?.full_name ? String(users[0].full_name) : undefined;
  const origin = siteUrl();
  const metadata = {
    userId,
    plan: plan.id,
    fullName: fullName || "",
    cpf: users[0]?.cpf ? String(users[0].cpf) : "",
  };

  try {
    const priceId = await resolvePriceId(stripe, plan);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: "pt-BR",
      customer_email: email,
      client_reference_id: userId,
      metadata,
      subscription_data: { metadata },
      line_items: [
        priceId
          ? { quantity: 1, price: priceId }
          : {
              quantity: 1,
              price_data: {
                currency: plan.currency,
                unit_amount: plan.amountCents,
                recurring: { interval: plan.interval },
                product_data: {
                  name: plan.name,
                  description: plan.promise,
                },
              },
            },
      ],
      success_url: `${origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pagamento?plano=${plan.id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao abrir o Stripe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
