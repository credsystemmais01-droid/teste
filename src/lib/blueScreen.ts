export const BLUE_SCREEN_SIZE_MIN = 16;
export const BLUE_SCREEN_SIZE_MAX = 280;
export const BLUE_SCREEN_SIZE_DEFAULT = 168;
export const BLUE_SCREEN_REFERENCE_WIDTH = 1920;

export const BLUE_SCREEN_PRESETS = [
  { label: "Bem pequena", size: 24 },
  { label: "Pequena", size: 48 },
  { label: "Média", size: 80 },
  { label: "Grande", size: 128 },
  { label: "Muito grande", size: 168 },
  { label: "Gigante", size: 240 },
];

export type BlueScreenMode = "text" | "countdown" | "loading";

export const BLUE_SCREEN_MODES: { id: BlueScreenMode; label: string }[] = [
  { id: "text", label: "Só o texto" },
  { id: "countdown", label: "Contagem regressiva" },
  { id: "loading", label: "Carregamento (%)" },
];

export const BLUE_SCREEN_DURATION_MIN = 5;
export const BLUE_SCREEN_DURATION_MAX = 24 * 60 * 60;
export const BLUE_SCREEN_DURATION_DEFAULT = 60;

export const BLUE_SCREEN_DURATION_PRESETS = [10, 30, 60, 120, 300, 600, 1800, 3600];

export const BLUE_SCREEN_BG_DEFAULT = "#0078d4";

export const BLUE_SCREEN_BG_PRESETS = [
  { label: "Azul", color: "#0078d4" },
  { label: "Azul escuro", color: "#0a2463" },
  { label: "Preto", color: "#000000" },
  { label: "Cinza escuro", color: "#2b2b2b" },
  { label: "Verde", color: "#107c10" },
  { label: "Vermelho", color: "#c50f1f" },
  { label: "Roxo", color: "#5c2d91" },
  { label: "Laranja", color: "#ca5010" },
  { label: "Branco", color: "#ffffff" },
];

export function normalizeBlueScreenBg(value: unknown) {
  const raw = String(value ?? "").trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(raw) ? raw : BLUE_SCREEN_BG_DEFAULT;
}

export function blueScreenTextColor(bg: string) {
  const hex = normalizeBlueScreenBg(bg).slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? "#111111" : "#ffffff";
}

export type BlueScreenState = {
  text: string;
  size: number;
  mode: BlueScreenMode;
  duration: number;
  startedAt: number;
  bg: string;
};

export function normalizeBlueScreenMode(value: unknown): BlueScreenMode {
  return value === "countdown" || value === "loading" ? value : "text";
}

export function clampBlueScreenDuration(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return BLUE_SCREEN_DURATION_DEFAULT;
  return Math.min(BLUE_SCREEN_DURATION_MAX, Math.max(BLUE_SCREEN_DURATION_MIN, Math.round(n)));
}

export function formatDurationLabel(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return sec ? `${min} min ${sec}s` : `${min} min`;
  }
  const h = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  return min ? `${h} h ${min} min` : `${h} h`;
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export function blueScreenProgress(state: Pick<BlueScreenState, "duration" | "startedAt">, now: number) {
  const durationMs = clampBlueScreenDuration(state.duration) * 1000;
  const elapsed = state.startedAt > 0 ? Math.max(0, now - state.startedAt) : 0;
  const remainingSeconds = Math.max(0, (durationMs - elapsed) / 1000);
  const percent = Math.min(100, Math.floor((elapsed / durationMs) * 100));
  return { remainingSeconds, percent, done: elapsed >= durationMs };
}

export function clampBlueScreenSize(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return BLUE_SCREEN_SIZE_DEFAULT;
  return Math.min(BLUE_SCREEN_SIZE_MAX, Math.max(BLUE_SCREEN_SIZE_MIN, Math.round(n)));
}

function stepFor(size: number) {
  if (size < 48) return 4;
  if (size < 120) return 8;
  return 16;
}

export function stepBlueScreenSize(current: number, direction: 1 | -1) {
  const size = clampBlueScreenSize(current);
  const step = stepFor(direction > 0 ? size : size - 1);
  return clampBlueScreenSize(size + step * direction);
}

export function blueScreenFontSize(size: unknown) {
  const px = clampBlueScreenSize(size);
  const desktop = ((px / BLUE_SCREEN_REFERENCE_WIDTH) * 100).toFixed(3);
  const min = Math.max(12, Math.round(px * 0.55));
  const max = Math.round(px * 2);
  return `clamp(${min}px, ${desktop}vw, ${max}px)`;
}

export function blueScreenPreviewFontSize(size: unknown) {
  const px = clampBlueScreenSize(size);
  return `${((px / BLUE_SCREEN_REFERENCE_WIDTH) * 100).toFixed(3)}cqw`;
}
