export function ShieldVisual() {
  return (
    <div className="shield-stage" aria-hidden>
      <div className="shield-ring ring-a" />
      <div className="shield-ring ring-b" />
      <div className="shield-ring ring-c" />
      <div className="shield-core">
        <svg viewBox="0 0 120 132" width="140" height="154">
          <defs>
            <linearGradient id="core" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path
            d="M60 8l46 18v36c0 32-20 58-46 62C34 120 14 94 14 62V26L60 8z"
            fill="rgba(10,18,40,0.9)"
            stroke="url(#core)"
            strokeWidth="2.2"
          />
          <path d="M42 68l13 13 24-28" fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div className="shield-live">24h</div>
      </div>
      <span className="orbit-dot d1" />
      <span className="orbit-dot d2" />
      <span className="orbit-dot d3" />
    </div>
  );
}
