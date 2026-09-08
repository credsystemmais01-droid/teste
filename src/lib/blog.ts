export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  body: BlogBlock[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "sistema-guardiao",
    title: "Sistema Guardião: o escudo 24 horas do Limpa e Protege",
    excerpt:
      "O Guardião acompanha a máquina, o painel e o pacote. Quem quiser conhecer o produto encontra aqui o que cada serviço faz.",
    category: "Sistema Guardião",
    date: "2026-09-07",
    readMinutes: 6,
    body: [
      {
        type: "p",
        text: "O Sistema Guardião é o coração do Limpa e Protege. Ele não é um antivírus genérico que some depois da instalação. É o acompanhamento contínuo: limpa, protege e fica de olho — 24 horas, sem parar.",
      },
      {
        type: "h2",
        text: "O que o Guardião vigia",
      },
      {
        type: "ul",
        items: [
          "Dados, fotos e documentos da conta.",
          "O computador residencial ou as máquinas da empresa.",
          "O site, contra tentativas de hacker, malware e trojan.",
          "O estado do painel: desconectado, lido, ameaça ou protegido.",
        ],
      },
      {
        type: "h2",
        text: "Como ele trabalha no dia a dia",
      },
      {
        type: "p",
        text: "Você entra com o e-mail da conta. No painel, o Guardião organiza quatro ações: entrar no computador, fazer checagem, remover vírus e ativar proteção. Cada clique vira um passo visível no console 24h — leitura, diagnóstico e escudo.",
      },
      {
        type: "p",
        text: "Se aparecer lentidão, pop-up estranho, arquivo que não abre ou login suspeito, a checagem usa só o que você marcar. O diagnóstico não inventa doença: descreve os sinais que você mesmo apontou.",
      },
      {
        type: "h2",
        text: "Pacote + Guardião",
      },
      {
        type: "p",
        text: "Remover vírus e ativar proteção pedem o pacote. Residencial cuida do PC, das fotos e dos documentos. Empresa cobre o time e o site. Site Blindado concentra a narrativa de anti-malware e anti-hack no endereço da empresa.",
      },
      {
        type: "p",
        text: "Depois da ativação, o status vira Protegido. O console fica em monitoramento contínuo e o card de sucesso confirma: você está protegido 24 horas. Sem parar.",
      },
      {
        type: "h2",
        text: "Quer conhecer melhor?",
      },
      {
        type: "p",
        text: "Este blog existe para quem quer ler com calma. Nos artigos ao lado você vê, um a um, como o Limpa e Protege destrava acessos, atualiza drivers, atualiza softwares e faz o checkout do pacote.",
      },
    ],
  },
  {
    slug: "destrava-acessos",
    title: "Destrava acessos: voltar a entrar no que o vírus travou",
    excerpt:
      "Sessão bloqueada, arquivo que não abre, login que recusa. O serviço de destravar acessos devolve o caminho legítimo da conta e da máquina.",
    category: "Serviços",
    date: "2026-09-07",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "Malware, trojan e pop-up costumam fazer a mesma coisa: empurram a pessoa para fora do próprio computador. A tela trava, o arquivo some da lista, o site da empresa não abre, o e-mail pede senha de novo. Destravar acessos é o serviço que recoloca você do lado de dentro — na sua conta, na sua máquina, nos seus documentos.",
      },
      {
        type: "h2",
        text: "O que significa destravar no Limpa e Protege",
      },
      {
        type: "p",
        text: "Não é furar senha de terceiros nem invadir sistema alheio. É recuperar o acesso da pessoa que já é dona da conta. O fluxo começa no painel, em Entrar no computador: você informa o apelido da máquina, o console identifica o perfil e desbloqueia a sessão segura daquele usuário.",
      },
      {
        type: "ul",
        items: [
          "Sessão do painel autenticada com o e-mail da conta.",
          "Máquina nomeada por você, para o console saber qual perfil está em leitura.",
          "Card de sucesso quando a sessão fica desbloqueada e segura.",
          "Depois, checagem e diagnóstico se ainda houver sintoma.",
        ],
      },
      {
        type: "h2",
        text: "Sinais de acesso travado",
      },
      {
        type: "ul",
        items: [
          "Arquivos que não abrem ou pedem permissão o tempo todo.",
          "Login suspeito e e-mails estranhos pedindo nova senha.",
          "Site da empresa fora do ar ou recusando o painel administrativo.",
          "Antivírus antigo desligado, deixando a porta aberta para o bloqueio.",
        ],
      },
      {
        type: "h2",
        text: "Depois do desbloqueio",
      },
      {
        type: "p",
        text: "Destravar é o primeiro passo. Sem o pacote, o vírus marcado no diagnóstico continua no caminho. Com o pacote, remover vírus e ativar proteção fecham a porta: o Guardião assume o monitoramento e o acesso deixa de cair a cada pop-up.",
      },
      {
        type: "p",
        text: "Se a sua máquina está recusando entrada, crie a conta, entre no painel e use Entrar no computador. O nome que aparece na ferramenta é o que o administrador define — a conta continua sendo o seu e-mail.",
      },
    ],
  },
  {
    slug: "atualiza-drivers",
    title: "Atualiza drivers: estabilidade para o escudo funcionar",
    excerpt:
      "Driver velho trava impressora, vídeo, rede e áudio. Atualizar drivers entra no cuidado contínuo do Limpa e Protege.",
    category: "Serviços",
    date: "2026-09-06",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "Driver é a ponte entre o Windows e o hardware. Quando essa ponte está antiga, a máquina parece infectada mesmo sem um vírus novo: tela preta, Wi-Fi caindo, áudio mudo, impressora sumida, notebook quente e lento. Atualizar drivers faz parte do serviço porque proteção contínua não segura um computador que já está caindo sozinho.",
      },
      {
        type: "h2",
        text: "Por que o Limpa e Protege cuida disso",
      },
      {
        type: "p",
        text: "Um driver desatualizado abre falha. Kit de vídeo, placa de rede e chipset antigos são porta comum para instabilidade e para software malicioso se esconder em erro de dispositivo. O pacote Residencial e o pacote Empresa tratam a máquina como um conjunto: limpeza, escudo e base técnica em dia.",
      },
      {
        type: "h2",
        text: "O que entra na atualização",
      },
      {
        type: "ul",
        items: [
          "Vídeo e chipset, para a interface parar de piscar e travar.",
          "Rede e Wi-Fi, para o site da empresa e o painel não caírem no meio da checagem.",
          "Áudio, teclado, touchpad e impressora, quando o dispositivo some do sistema.",
          "Armazenamento, para documentos e fotos não corromperem em queda de disco.",
        ],
      },
      {
        type: "h2",
        text: "Como isso aparece no painel",
      },
      {
        type: "p",
        text: "Na checagem profunda o console lê memória, documentos, fotos e a porta de rede. Se a máquina está lenta ou travando, esse sintoma entra no diagnóstico. Atualizar drivers entra no cuidado do Guardião depois que o pacote está ativo: a meta é deixar o computador utilizável e o escudo estável, não só pintar um selo verde.",
      },
      {
        type: "p",
        text: "Se a sua tela congela, o Wi-Fi some ou um periférico deixou de responder depois de pop-ups e lentidão, marque o sintoma na checagem e ative o pacote. Driver em dia + escudo 24h é o combo que segura o uso diário.",
      },
    ],
  },
  {
    slug: "atualiza-softwares",
    title: "Atualiza softwares: fechar a porta que o malware usa",
    excerpt:
      "Navegador, escritório, Java, PDF e o próprio sistema. Software parado no tempo é o atalho favorito de trojan e golpe.",
    category: "Serviços",
    date: "2026-09-06",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "A maior parte dos ataques não começa com um hacker digitando código na sua frente. Começa num programa atrasado: navegador sem patch, leitor de PDF de 2019, Java esquecido, WhatsApp Web em extensão duvidosa, antivírus antigo desligado. Atualizar softwares é o serviço que fecha essas janelas.",
      },
      {
        type: "h2",
        text: "O que o Limpa e Protege atualiza na prática",
      },
      {
        type: "ul",
        items: [
          "Navegador e extensões, para parar de abrir página de golpe sozinha.",
          "Pacote de escritório e leitor de PDF, comuns em anexo infectado.",
          "Apps de reunião e e-mail da empresa.",
          "O próprio runtime que o site ou o sistema ainda pedem para funcionar.",
        ],
      },
      {
        type: "h2",
        text: "Por que isso entra no pacote",
      },
      {
        type: "p",
        text: "Remover o vírus e deixar o software velho é convidar o mesmo trojan de volta. O Guardião trata atualização como camada de proteção, junto com a checagem e o escudo 24h. No plano Empresa e no Site Blindado, software atrasado no servidor ou no painel do site é risco direto de queda e de invasão.",
      },
      {
        type: "h2",
        text: "Sinais de software atrasado",
      },
      {
        type: "ul",
        items: [
          "Avisos de atualização que ninguém clicou há meses.",
          "Pop-ups e anúncios mesmo em site conhecido.",
          "Login suspeito depois de abrir um anexo.",
          "Antivírus antigo desligado ou incompatível com o sistema atual.",
        ],
      },
      {
        type: "p",
        text: "No reconhecimento de vírus, marque o que você está sentindo. Se o antivírus antigo está desligado ou os pop-ups não param, o passo seguinte é o pacote: limpeza narrativa + proteção contínua + softwares no ritmo certo para o escudo não trabalhar em cima de um buraco aberto.",
      },
    ],
  },
  {
    slug: "checkout-pacotes",
    title: "Checkout: como ativar o pacote Limpa e Protege",
    excerpt:
      "Residencial, Empresa ou Site Blindado. O checkout é o momento em que o diagnóstico vira proteção contínua.",
    category: "Checkout",
    date: "2026-09-05",
    readMinutes: 4,
    body: [
      {
        type: "p",
        text: "O checkout do Limpa e Protege não é taxa escondida nem cobrança no meio da tela preta. É a ativação do pacote: você escolhe o plano, confirma o que o diagnóstico já mostrou e liga o Guardião de verdade no painel.",
      },
      {
        type: "h2",
        text: "Quando o checkout aparece",
      },
      {
        type: "p",
        text: "Entrar no computador e fazer checagem estão liberados. Remover vírus e ativar proteção pedem o pacote. Se ainda não pagou, o painel bloqueia a limpeza e o escudo e aponta um único caminho: Pagar e proteger agora.",
      },
      {
        type: "h2",
        text: "Os três planos",
      },
      {
        type: "ul",
        items: [
          "Residencial — pessoa física. PC, fotos e documentos 24h.",
          "Empresa — CNPJ e time. Máquinas + site da empresa.",
          "Site Blindado — quem vive do endereço na web. Anti-malware e anti-hack na narrativa do site.",
        ],
      },
      {
        type: "p",
        text: "Os nomes dos planos já estão definidos. O valor de cada um o administrador publica quando fechar o preço. Até lá, a tela mostra Preço a definir e a ativação de demonstração grava o pacote na conta para você ver o estado Protegido.",
      },
      {
        type: "h2",
        text: "O que a tela de pagamento mostra",
      },
      {
        type: "ul",
        items: [
          "O que você está comprando: proteção contínua, não um clique avulso.",
          "Os sintomas que você mesmo marcou na checagem.",
          "O que acontece depois: status Protegido, console em monitoramento, dados, fotos, documentos, empresa e site sob escudo.",
        ],
      },
      {
        type: "h2",
        text: "Depois de ativar",
      },
      {
        type: "p",
        text: "O painel não volta para o começo no F5. A assinatura fica no banco. Remover vírus e ativar proteção passam a rodar o console de limpeza e o card: Escudo ativo. Você está protegido 24 horas. Sem parar.",
      },
      {
        type: "p",
        text: "Quando o gateway de pagamento entrar, o mesmo checkout recebe o cartão ou o Pix. O fluxo que você vê hoje já é o caminho comercial: diagnóstico → pacote → Guardião ligado.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((post) => post.slug === slug);
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}
