import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { activatePaidPlan } from "@/lib/billing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook Stripe não configurado." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  const raw = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = String(session.metadata?.userId || session.client_reference_id || "");
    const paid = session.payment_status === "paid" || session.status === "complete";
    if (userId && paid) {
      await activatePaidPlan(userId, String(session.id));
    }
  }

  return NextResponse.json({ received: true });
}
