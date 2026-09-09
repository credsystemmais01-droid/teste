import Link from "next/link";
import { PRODUCT } from "@/lib/brand";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link className="brand" href={href}>
      <span className="brand-mark" aria-hidden>
        <svg viewBox="0 0 32 32" width="28" height="28">
          <path
            d="M16 3l10 4v8c0 7.2-4.4 13.2-10 15-5.6-1.8-10-7.8-10-15V7l10-4z"
            fill="url(#lp-shield)"
            stroke="#c084fc"
            strokeWidth="1"
          />
          <path d="M11 16.2l3.1 3.1L21 12.4" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" />
          <defs>
            <linearGradient id="lp-shield" x1="6" y1="4" x2="26" y2="28">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#6d28d9" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="brand-text">
        <strong>
          Guardian <em>Proteção</em>
        </strong>
        <small>{PRODUCT}</small>
      </span>
    </Link>
  );
}
