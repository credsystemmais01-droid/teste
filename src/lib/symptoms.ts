export const SYMPTOMS = [
  "PC lento ou travando",
  "Pop-ups e anúncios estranhos",
  "Arquivos que não abrem",
  "Site da empresa fora do ar ou lento",
  "Login suspeito / e-mails estranhos",
  "Antivírus antigo desligado",
] as const;

export const PLANS = [
  {
    id: "residencial",
    name: "Residencial",
    forWho: "Pessoa física",
    promise: "PC, fotos, documentos 24h",
  },
  {
    id: "empresa",
    name: "Empresa",
    forWho: "CNPJ / time",
    promise: "Máquinas + site da empresa",
  },
  {
    id: "site",
    name: "Site Blindado",
    forWho: "Quem tem site",
    promise: "Anti-malware / anti-hack na narrativa do site",
  },
] as const;
