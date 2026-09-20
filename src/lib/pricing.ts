export const LIFETIME = {
  id: "vitalicio",
  name: "Guardian Proteção — Acesso Vitalício",
  promise:
    "Compra única, acesso vitalício: computador e notebook protegidos 24h, para sempre.",
  seals: [
    "Compra única",
    "Acesso vitalício",
    "5 anos de atualização",
    "Acesso permanente",
  ],
  amountCents: 569_800,
  installmentCount: 12,
  installmentCents: 47_483,
  currency: "brl" as const,
  benefits: [
    "Compra única: você paga uma vez, em um só pagamento.",
    "Acesso vitalício ao painel Guardian, sem data para acabar.",
    "Serviço com 5 anos de atualização incluídos no mesmo valor.",
    "Acesso permanente ao escudo: sem segunda cobrança, sem mensalidade e sem renovação.",
    "Valor fixo, fechado no ato da compra, sem reajuste depois.",
    "Computador e notebook protegidos 24 horas, sem pausa.",
    "Sistema Guardião contínuo no painel, com log ao vivo.",
    "Proteção de dados, fotos, arquivos e documentos.",
    "Cuidado da empresa e do site contra ataques, malware e trojan.",
    "Faz a internet voltar: DNS, proxy, IP e portas de rede liberados.",
    "Mantém a máquina segura em vigilância permanente, sem você precisar lembrar.",
    "Destrava acessos que o vírus travou: sessão, login e arquivo.",
    "Atualização de drivers da máquina: vídeo, rede, áudio e impressora.",
    "Atualização de softwares do dia a dia: navegador, escritório e sistema.",
    "Diagnóstico com sintomas que você marca e leitura no console.",
    "Acompanhamento da máquina pelo nome que você informa no painel.",
    "Estado protegido depois do pagamento: escudo ligado no painel.",
    "Parcelamento em 12 vezes no cartão, via Stripe, em nome da Guardian Proteção.",
  ],
};

export function formatBrlFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export const PRICE_LABEL = formatBrlFromCents(LIFETIME.amountCents);
export const INSTALLMENT_LABEL = formatBrlFromCents(LIFETIME.installmentCents);
