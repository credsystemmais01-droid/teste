import { NextResponse } from "next/server";
import { readPixPayment } from "@/lib/pixPaymentStore";

export const runtime = "nodejs";

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET() {
  const payment = await readPixPayment();
  return withCors(NextResponse.json(payment));
}
