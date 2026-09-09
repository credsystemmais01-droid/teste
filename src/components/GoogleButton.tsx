export function GoogleButton({
  label = "Continuar com Google",
  next,
}: {
  label?: string;
  next?: string;
}) {
  const href = next ? `/api/auth/google?next=${encodeURIComponent(next)}` : "/api/auth/google";
  return (
    <a className="btn btn-ghost full google-btn" href={href}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          fill="#EA4335"
          d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.6-5.6-5.7S8.9 6 12 6c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.6 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c5.5 0 9.1-3.9 9.1-9.3 0-.6 0-1.1-.1-1.8H12z"
        />
      </svg>
      {label}
    </a>
  );
}
