import { NextResponse } from "next/server";
import { getBlueScreenState } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getBlueScreenState();
  return NextResponse.json(
    { ...state, serverNow: Date.now() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
