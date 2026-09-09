import { siteUrl } from "@/lib/stripe";

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function requestOrigin(request: Request) {
  const url = new URL(request.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return url.origin;
  return siteUrl();
}

export function googleRedirectUri(request: Request) {
  return `${requestOrigin(request)}/api/auth/google/callback`;
}
