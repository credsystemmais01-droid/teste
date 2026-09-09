import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, ensureSchema } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { googleConfigured, googleRedirectUri, requestOrigin } from "@/lib/google";
import { isProfileComplete } from "@/lib/profile";
import { safeNext } from "@/lib/nextPath";

export async function GET(request: Request) {
  const origin = requestOrigin(request);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const expected = jar.get("lp_oauth_state")?.value;
  const next = safeNext(jar.get("lp_next")?.value);
  jar.delete("lp_oauth_state");
  jar.delete("lp_next");

  if (!googleConfigured() || !code || !state || !expected || state !== expected) {
    return NextResponse.redirect(new URL("/login?erro=google", origin));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirect_uri: googleRedirectUri(request),
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenResponse.json();
  if (!tokenResponse.ok || !tokens.access_token) {
    return NextResponse.redirect(new URL("/login?erro=google", origin));
  }

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileResponse.json();
  const email = String(profile.email || "").trim().toLowerCase();
  const googleId = String(profile.sub || "");
  const fullName = String(profile.name || email.split("@")[0] || "Conta Google").trim();
  if (!email || !googleId) {
    return NextResponse.redirect(new URL("/login?erro=google", origin));
  }

  await ensureSchema();
  const sql = db();
  const existing =
    await sql`SELECT id, full_name, cpf, phone FROM users WHERE email = ${email} OR google_id = ${googleId} LIMIT 1`;

  let userId: string;
  let complete = false;
  if (existing[0]) {
    userId = String(existing[0].id);
    await sql`
      UPDATE users
      SET google_id = ${googleId},
          full_name = COALESCE(NULLIF(full_name, ''), ${fullName})
      WHERE id = ${userId}
    `;
    complete = isProfileComplete(existing[0]);
  } else {
    const rows = await sql`
      INSERT INTO users (email, password_hash, display_name, full_name, google_id, auth_provider)
      VALUES (${email}, NULL, ${fullName}, ${fullName}, ${googleId}, ${"google"})
      RETURNING id
    `;
    userId = String(rows[0].id);
  }

  await setSession(userId);
  const dest = complete ? next : `/completar-cadastro?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(new URL(dest, origin));
}
