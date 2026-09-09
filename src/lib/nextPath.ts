export function safeNext(value: string | null | undefined) {
  if (!value) return "/painel";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return "/painel";
  }
  return value;
}
