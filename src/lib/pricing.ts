export const ANNUAL = {
  id: "anual",
  name: "Limpa e Protege Anual",
  promise: "Proteção 24h por 12 meses: computador, dados, empresa e site.",
  amountCents: 569_800,
  installmentCount: 12,
  installmentCents: 47_483,
  currency: "brl" as const,
};

export function formatBrlFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export const PRICE_LABEL = formatBrlFromCents(ANNUAL.amountCents);
export const INSTALLMENT_LABEL = formatBrlFromCents(ANNUAL.installmentCents);
