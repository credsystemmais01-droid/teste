export const DEFAULT_TRIAL_DAYS = 7;
export const MAX_TRIAL_DAYS = 90;

export type TrialState = {
  used: boolean;
  active: boolean;
  days: number;
  daysLeft: number;
  startedAt: string;
  endsAt: string;
};

export function clampTrialDays(value: unknown, fallback = DEFAULT_TRIAL_DAYS) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(MAX_TRIAL_DAYS, Math.max(1, Math.round(n)));
}

export function buildTrialState(startedAt: unknown, days: number): TrialState {
  const empty: TrialState = {
    used: false,
    active: false,
    days,
    daysLeft: 0,
    startedAt: "",
    endsAt: "",
  };
  if (!startedAt) return empty;

  const start = new Date(String(startedAt));
  if (Number.isNaN(start.getTime())) return empty;

  const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
  const msLeft = end.getTime() - Date.now();
  return {
    used: true,
    active: msLeft > 0,
    days,
    daysLeft: msLeft > 0 ? Math.ceil(msLeft / (24 * 60 * 60 * 1000)) : 0,
    startedAt: start.toISOString(),
    endsAt: end.toISOString(),
  };
}

export function formatTrialEnd(endsAt: string) {
  if (!endsAt) return "";
  const date = new Date(endsAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}
