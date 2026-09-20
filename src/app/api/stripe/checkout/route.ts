import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { LIFETIME, INSTALLMENT_LABEL } from "@/lib/pricing";
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
  const active = await db()`
    SELECT id FROM subscriptions
    WHERE user_id = ${userId} AND status = 'active'
    LIMIT 1
  `;
  if (active[0]) {
    return NextResponse.json(
      { error: "Esta conta já tem o acesso vitalício. A compra é única, não há segunda cobrança." },
      { status: 409 },
    );
  }

  const users = await db()`
    SELECT email, full_name, cpf, phone FROM users WHERE id = ${userId} LIMIT 1
  `;
  const email = users[0] ? String(users[0].email) : undefined;
  const fullName = users[0]?.full_name ? String(users[0].full_name) : undefined;
  const origin = siteUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pt-BR",
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
        plan: LIFETIME.id,
        fullName: fullName || "",
        cpf: users[0]?.cpf ? String(users[0].cpf) : "",
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: LIFETIME.currency,
            unit_amount: LIFETIME.amountCents,
            product_data: {
              name: LIFETIME.name,
              description: `${LIFETIME.promise} Pagamento único, sem mensalidade. Inclui painel 24h, dados, empresa, site, internet de volta, destrava acessos, drivers e softwares. ${LIFETIME.installmentCount}x de ${INSTALLMENT_LABEL}.`,
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
        metadata: {
        userId,
        plan: LIFETIME.id,
        fullName: fullName || "",
        cpf: users[0]?.cpf ? String(users[0].cpf) : "",
      },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: LIFETIME.currency,
              unit_amount: LIFETIME.amountCents,
              product_data: {
                name: LIFETIME.name,
                description: LIFETIME.promise,
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
