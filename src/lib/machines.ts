export const MAX_MACHINES = 2;

export type MachineStatus = "disconnected" | "scanned" | "threat" | "protected";

export const MACHINE_STATUSES: MachineStatus[] = [
  "disconnected",
  "scanned",
  "threat",
  "protected",
];

const GMAIL_PATTERN = /^[a-z0-9][a-z0-9._%+-]*@(gmail|googlemail)\.com$/;

export function normalizeGmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export function isGmail(value: string) {
  return GMAIL_PATTERN.test(value);
}

export function normalizeMachineName(value: unknown) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 40);
}
