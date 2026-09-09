import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { googleConfigured, googleRedirectUri, requestOrigin } from "@/lib/google";
import { safeNext } from "@/lib/nextPath";

export async function GET(request: Request) {
  const origin = requestOrigin(request);
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/login?erro=google", origin));
  }

  const next = safeNext(new URL(request.url).searchParams.get("next"));
  const state = crypto.randomUUID();
  const jar = await cookies();
  jar.set("lp_next", next, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  jar.set("lp_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: googleRedirectUri(request),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
