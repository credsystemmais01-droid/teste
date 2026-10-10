import { NextResponse } from "next/server";
import { readPixPayment } from "@/lib/pixPaymentStore";

export const runtime = "nodejs";

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET(request: Request) {
  const chargeId = new URL(request.url).searchParams.get("id") || "";
  const payment = await readPixPayment(chargeId);
  return withCors(NextResponse.json(payment));
}
