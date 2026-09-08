import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";
import { activatePaidPlan } from "@/lib/billing";
import { getUserId } from "@/lib/auth";

export async function GET(request: Request) {
  const stripe = getStripe();
  const origin = siteUrl();
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!stripe || !sessionId) {
    return NextResponse.redirect(new URL("/pagamento", origin));
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const userId = String(session.metadata?.userId || session.client_reference_id || (await getUserId()) || "");
  const paid = session.payment_status === "paid";
  if (userId && paid) {
    await activatePaidPlan(userId, session.id);
    return NextResponse.redirect(new URL("/painel?view=safe", origin));
  }

  return NextResponse.redirect(new URL("/pagamento", origin));
}
