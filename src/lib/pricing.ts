export type BillingInterval = "month" | "year";

export type Plan = {
  id: string;
  name: string;
  promise: string;
  interval: BillingInterval;
  intervalLabel: string;
  amountCents: number;
  currency: "brl";
  featured?: boolean;
  test?: boolean;
  badge: string;
  seals: string[];
  benefits: string[];
};

export const PLANS: Plan[] = [
  {
    id: "criptografia-security",
    name: "Criptografia Security",
    badge: "Assinatura mensal",
    promise:
      "Escudo mensal do computador de casa. Criptografa fotos, arquivos e documentos e mantém a vigilância 24 horas enquanto a assinatura estiver ativa.",
    interval: "month",
    intervalLabel: "por mês",
    amountCents: 59_700,
    currency: "brl",
    seals: ["Mensal", "Computador de casa", "Criptografia de dados", "Cancele quando quiser"],
    benefits: [
      "Criptografia dos arquivos, fotos e documentos da conta.",
      "Escudo 24 horas no computador e no notebook, enquanto a assinatura estiver ativa.",
      "Checagem com os sintomas que você marca e leitura no console.",
      "Internet de volta: DNS, proxy, IP e portas de rede liberados.",
      "Leitura de sinais de malware, trojan e acesso indevido.",
      "Cobrança mensal pela Stripe, em nome da Guardian Proteção.",
    ],
  },
  {
    id: "criptografia-guardian",
    name: "Criptografia Guardian Proteção",
    badge: "Proteção completa",
    featured: true,
    promise:
      "Assinatura completa de segurança: criptografia Guardian no computador, na empresa e no site, contra hacker, malware e trojan.",
    interval: "month",
    intervalLabel: "por mês",
    amountCents: 49_700,
    currency: "brl",
    seals: ["Mensal", "Empresa e site", "Guardião 24h", "Cancele quando quiser"],
    benefits: [
      "Tudo da Criptografia Security, mais o cuidado da empresa e do site.",
      "Criptografia Guardian sobre dados, fotos, documentos e acessos.",
      "Proteção do site contra ataques, hackers, malware e trojan.",
      "Destrava acessos que a ameaça travou: sessão, login e arquivo.",
      "Cuidado contínuo de drivers e dos softwares do dia a dia.",
      "Sistema Guardião no painel, com log ao vivo durante a assinatura.",
      "Cobrança mensal pela Stripe, em nome da Guardian Proteção.",
    ],
  },
  {
    id: "criptografia-security-z1",
    name: "Criptografia Security z1",
    badge: "Assinatura anual",
    promise:
      "Um ano seguido de criptografia e vigilância. O escudo Security fica ligado no computador e no notebook, sem interrupção no meio do caminho.",
    interval: "year",
    intervalLabel: "por ano",
    amountCents: 422_700,
    currency: "brl",
    seals: ["Anual", "12 meses contínuos", "Empresa e site", "Renovação anual"],
    benefits: [
      "Doze meses de escudo contínuo, cobrados uma vez por ano.",
      "Criptografia dos dados, fotos, documentos e da rede da máquina.",
      "Vigilância 24 horas no computador e no notebook durante o ano contratado.",
      "Internet de volta, checagem e log do Guardião inclusos no período.",
      "Cuidado da empresa e do site contra malware e trojan, pelo ano inteiro.",
      "Renovação anual pela Stripe, em nome da Guardian Proteção.",
    ],
  },
  {
    id: "teste-guardian",
    name: "Teste Guardian",
    badge: "Só para teste",
    test: true,
    promise:
      "Assinatura de R$ 1 para testar o checkout na Stripe. Liga o mesmo escudo do painel enquanto o plano de teste estiver ativo.",
    interval: "month",
    intervalLabel: "por mês",
    amountCents: 100,
    currency: "brl",
    seals: ["Teste", "R$ 1", "Mensal", "Stripe ao vivo"],
    benefits: [
      "Cobrança real de R$ 1 por mês, para validar o pagamento.",
      "Abre o checkout da Stripe com o preço de teste já criado na conta.",
      "Depois do pagamento, o painel fica protegido como nas outras assinaturas.",
      "Cancele na Stripe quando o teste acabar.",
    ],
  },
];

export const PUBLIC_PLANS = PLANS.filter((plan) => !plan.test);

export function getPlan(id: string) {
  return PLANS.find((plan) => plan.id === id);
}

export function formatBrlFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
