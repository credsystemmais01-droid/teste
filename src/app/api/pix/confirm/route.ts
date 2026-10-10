import { NextResponse } from "next/server";
import { parsePixPayload } from "@/lib/pixDemo";
import { markPixPaid, readPixPayment } from "@/lib/pixPaymentStore";

export const runtime = "nodejs";

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const payment = parsePixPayload(String(body.raw || ""));
  if (!payment) {
    return withCors(NextResponse.json({ error: "Pagamento não reconhecido." }, { status: 400 }));
  }
  const current = await readPixPayment(payment.chargeId);
  const saved = current.paid ? current : await markPixPaid(payment.chargeId, payment.cents, payment.name);
  return withCors(NextResponse.json(saved));
}
