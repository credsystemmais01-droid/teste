export const ANNUAL = {
  id: "anual",
  name: "Guardian Proteção — Anual",
  promise: "Proteção 24h por 12 meses: computador, dados, empresa e site.",
  amountCents: 569_800,
  installmentCount: 12,
  installmentCents: 47_483,
  currency: "brl" as const,
  benefits: [
    "Painel Guardian ativo por 12 meses, 24 horas, sem pausa.",
    "Sistema Guardião contínuo no painel, com log ao vivo.",
    "Proteção de dados, fotos, arquivos e documentos.",
    "Cuidado da empresa e do site contra ataques, malware e trojan.",
    "Destrava acessos que o vírus travou: sessão, login e arquivo.",
    "Atualização de drivers da máquina: vídeo, rede, áudio e impressora.",
    "Atualização de softwares do dia a dia: navegador, escritório e sistema.",
    "Diagnóstico com sintomas que você marca e leitura no console.",
    "Acompanhamento da máquina pelo nome que você informa no painel.",
    "Estado protegido depois do pagamento: escudo ligado no painel.",
    "Um único valor no ano, sem mensalidade extra no meio do caminho.",
    "Parcelamento em 12 vezes no cartão, via Stripe, em nome da Guardian Proteção.",
  ],
};

export function formatBrlFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export const PRICE_LABEL = formatBrlFromCents(ANNUAL.amountCents);
export const INSTALLMENT_LABEL = formatBrlFromCents(ANNUAL.installmentCents);
