import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { ANNUAL, INSTALLMENT_LABEL } from "@/lib/pricing";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Pagamento Stripe ainda não configurado. Falta a chave da conta." },
      { status: 503 },
    );
  }

  await ensureSchema();
  const users = await db()`SELECT email FROM users WHERE id = ${userId} LIMIT 1`;
  const email = users[0] ? String(users[0].email) : undefined;
  const origin = siteUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pt-BR",
      customer_email: email,
      client_reference_id: userId,
      metadata: { userId, plan: ANNUAL.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: ANNUAL.currency,
            unit_amount: ANNUAL.amountCents,
            product_data: {
              name: ANNUAL.name,
              description: `${ANNUAL.promise} Parcelado em ${ANNUAL.installmentCount} vezes de ${INSTALLMENT_LABEL}.`,
            },
          },
        },
      ],
      payment_method_options: {
        card: {
          installments: { enabled: true },
        },
      },
      success_url: `${origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pagamento`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao abrir o Stripe.";
    if (message.toLowerCase().includes("installment")) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        locale: "pt-BR",
        customer_email: email,
        client_reference_id: userId,
        metadata: { userId, plan: ANNUAL.id },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: ANNUAL.currency,
              unit_amount: ANNUAL.amountCents,
              product_data: {
                name: ANNUAL.name,
                description: ANNUAL.promise,
              },
            },
          },
        ],
        success_url: `${origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pagamento`,
      });
      return NextResponse.json({ url: session.url });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
