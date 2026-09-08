import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://limpa-protege.vercel.app";
}
