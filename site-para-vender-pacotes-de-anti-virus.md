# Limpa e Protege — guia de criação (ler sempre que esquecer)

Documento-fonte. Se perder o rumo no meio da implementação, volte aqui e siga do passo em que parou. Não invente fluxo novo: aplique o que está escrito.

---

## 0. Como usar este arquivo

1. Leia a seção 1 (o que é / o que não é) antes de qualquer código.
2. Confira a paleta (seção 3) antes de estilizar qualquer tela.
3. Implemente na ordem da seção 10. Um bloco por vez.
4. Cada tela tem um critério de pronto. Não avance sem cumprir.
5. Textos entre aspas são copy literal da interface, salvo onde estiver marcado como `[EDITÁVEL]`.

---

## 1. O que estamos construindo

Site comercial do produto **Limpa e Protege**.

Promessa na interface:

- Limpa e protege o computador 24 horas, sem parar.
- Protege dados, fotos e documentos.
- Protege a empresa e o site contra ataques de hackers, malwares e trojans.

Experiência no painel: um **simulador visual** de antivírus. Parece que o sistema está lendo a máquina, desbloqueando, diagnosticando e limpando. **Não faz nada disso de verdade no sistema operacional do visitante.**

### 1.1 O que o site FAZ de verdade

- Cadastro / login de cliente.
- Painel moderno para o cliente logado.
- Animação estilo terminal (CMD) só na tela.
- Diagnóstico com sintomas que o próprio cliente escolhe.
- Pedido de pagamento para remover o vírus e ativar a proteção.
- Depois do pagamento: estado “protegido” no painel (dados salvos no Neon).

### 1.2 O que o site NÃO FAZ (regra dura)

- Não lê arquivos, fotos, processos, registro ou hardware do PC.
- Não instala agente, não desbloqueia Windows, não remove vírus de verdade.
- Não captura senhas, clipboard, teclado ou cookies de outros sites.
- O “nome da máquina” e o “nome do usuário” vêm do que a pessoa **digita no site**, não do SO.
- Todo log do CMD é texto roteirizado. É teatro de produto, não acesso ao computador.

Se em algum momento o código parecer que vai “entrar no PC”, pare e volte para esta seção.

---

## 2. Backend Neon — estado atual

Projeto já vinculado nesta pasta.

| Item | Valor |
| --- | --- |
| Project ID | `falling-rice-62186722` |
| Org | `org-calm-silence-02786562` |
| Branch | `production` (`br-twilight-bird-acpxuxow`) |
| Região | `aws-sa-east-1` (São Paulo) |
| Postgres | 18 |
| Endpoint | `ep-royal-mode-act6e46y` |
| Host | `ep-royal-mode-act6e46y.sa-east-1.aws.neon.tech` |
| Pooler | `ep-royal-mode-act6e46y-pooler.sa-east-1.aws.neon.tech` |
| Neon Auth | ainda **não** habilitado |

Arquivos de infra:

- `.neon` — contexto local (não versionar).
- `neon.ts` — `defineConfig({})` (só Lakebase Postgres, como combinado).
- Skills Neon instaladas nesta pasta para o Cursor.

Atenção: a região é **sa-east-1**. Funções, Object Storage e AI Gateway do Neon só existem em `us-east-2`. Neste projeto usamos **Postgres + Auth** (Auth entra depois, quando formos criar login de verdade).

Comandos de infra (já tentados / próximos):

```bash
npm i -g neon@latest
neon auth
neon skills -y -a cursor
neon mcp -y --oauth -a cursor
neon link --project-id falling-rice-62186722 --branch production -y
neon config init -s none
# neon.ts = defineConfig({})
neon deploy
```

`neon deploy` só roda depois de `neon auth` válido no CLI. Se o token estiver inativo, autenticar de novo e repetir só o deploy.

---

## 3. Identidade visual (obrigatória)

Tema: **azul profundo + neon roxo / violeta**, com brilho fino. Sem verde “antivírus genérico” na UI principal. Verde só no card de sucesso “desbloqueado e seguro”.

### 3.1 Paleta

| Token | Hex | Uso |
| --- | --- | --- |
| `bg-void` | `#050816` | Fundo da página |
| `bg-navy` | `#0A1228` | Painéis, cards |
| `bg-panel` | `#101A38` | Superfícies elevadas |
| `blue-core` | `#2563EB` | Botão primário, links |
| `blue-neon` | `#38BDF8` | Glow, traces, hover |
| `cyan-neon` | `#22D3EE` | Linhas vivas, cursor do terminal |
| `purple-deep` | `#6D28D9` | Botão secundário, ícones |
| `purple-neon` | `#A855F7` | Bordas neon, anéis |
| `violet-glow` | `#C084FC` | Destaque, badges |
| `magenta-neon` | `#E879F9` | Acento raro (alerta suave) |
| `text-primary` | `#F4F7FF` | Títulos |
| `text-muted` | `#94A3B8` | Apoio |
| `success` | `#22C55E` | Só card “desbloqueado e seguro” |
| `danger` | `#F43F5E` | Só ameaça / vírus encontrado |
| `border-thin` | `rgba(168, 85, 247, 0.45)` | Contorno padrão 1px |

### 3.2 Regras de UI

- Fundo escuro, quase preto-azulado. Nunca branco chapado no painel.
- Cards com **borda 1px** viva (roxo/azul) e **glow suave** (`box-shadow` curto, não neon grosso de anos 2000).
- Cantos 12–16px. Tipografia moderna (Inter / Geist / similar).
- Botões: preenchimento azul ou roxo, hover com brilho cyan/violeta.
- Microinterações: pulse no glow, scanline leve no terminal, barra de progresso fina.
- Logo / nome do produto sempre: **Limpa e Protege**.
- Frase-mãe (hero e rodapé do painel): **Seu computador 24 horas. Sem parar.**

---

## 4. Marca e mensagens fixas

- Nome: **Limpa e Protege**
- Subtítulo: **Seu computador 24 horas. Sem parar.**
- Três pilares (usar iguais em landing e painel):
  1. Protege seus dados, fotos e documentos.
  2. Protege sua empresa.
  3. Protege seu site de ataques, hackers, malwares e trojans.

---

## 5. Mapa de telas

```
/                  Landing pública
/login             Entrar
/cadastro          Criar conta
/painel            Hub do cliente (logado)
/painel/entrar     Fluxo “Entrar no computador”
/painel/checagem   Fluxo “Fazer checagem”
/painel/virus      Fluxo reconhecimento / diagnóstico
/painel/remover    Remover vírus (pede pagamento se ainda não pagou)
/painel/protecao   Ativar proteção (pede pagamento se ainda não pagou)
/pagamento         Checkout do pacote
/painel/seguro     Estado final após pagamento
```

Rotas podem ser implementadas como páginas ou como etapas no mesmo painel. O fluxo abaixo é o que importa, não o path exato.

---

## 6. Jornada completa (passo a passo)

### Passo A — Landing

Visitante chega. Vê:

- Nome **Limpa e Protege**
- Frase **Seu computador 24 horas. Sem parar.**
- Os 3 pilares.
- CTA **Criar conta** e **Já tenho conta**.

Critério de pronto: a pessoa entende o produto em 5 segundos e consegue ir para login/cadastro.

### Passo B — Cadastro / login

Campos mínimos:

- Nome de exibição `[EDITÁVEL pelo cliente]` — este nome aparece no card verde depois.
- E-mail
- Senha

Depois do login: ir direto para `/painel`.

Critério de pronto: sessão persiste; nome de exibição fica salvo no banco.

### Passo C — Painel (hub)

Layout moderno, neon, bordas finas.

Cabeçalho:

- “Olá, {nome}”
- Status atual: `Desconectado` | `Lido` | `Ameaça detectada` | `Protegido`

Área principal com **4 botões**:

1. **Entrar no computador**
2. **Remover vírus**
3. **Ativar proteção**
4. **Fazer checagem**

Abaixo dos botões: um **card de terminal** (vazio até o primeiro clique).

Critério de pronto: os 4 botões existem, brilham, e cada um abre o fluxo certo.

### Passo D — “Entrar no computador” (mentira visual)

1. Cliente clica em **Entrar no computador**.
2. Se ainda não definiu apelido da máquina, pedir em um campo:
   - “Nome desta máquina” `[EDITÁVEL]` — exemplo: `PC-Bruno`, `Notebook-Escritorio`.
3. Embaixo, o card estilo **CMD** começa a “ler” (texto falso, linha a linha, com delay):

```
Limpa e Protege — console 24h
--------------------------------
> conectando ao perfil local...
> identificando máquina: {nome_maquina}
> usuario: {nome_exibicao}
> varrendo memoria...
> varrendo documentos...
> varrendo fotos...
> checando porta de rede do site...
> desbloqueando sessao segura...
> OK
```

4. Ao terminar: card **verde** (único uso de verde na UI) com a mensagem:

   **{nome_exibicao} desbloqueado e seguro**

   Subtexto: `Máquina {nome_maquina} autenticada no Limpa e Protege.`

5. Status do painel muda para `Lido`.

Critério de pronto: o terminal anima sozinho; no fim o card verde mostra o nome que o cliente escolheu.

### Passo E — “Fazer checagem”

Mesmo terminal, roteiro de varredura mais longo (ainda falso):

```
> checagem profunda iniciada
> arquivos pessoais: OK (simulado)
> fotos: OK (simulado)
> documentos: OK (simulado)
> assinaturas de malware: em analise
> tráfego do site: em analise
```

Não conclui “limpo”. Encaminha para o reconhecimento de vírus.

Critério de pronto: a checagem termina pedindo o próximo passo (reconhecer vírus).

### Passo F — Reconhecimento de vírus (sintomas escolhidos pelo cliente)

Esta etapa **não inventa** a doença do PC. O cliente escolhe os sintomas; o site só descreve o que ele marcou.

1. Título: **Reconhecimento de vírus**
2. Texto: “Marque o que você está sentindo nesta máquina. O diagnóstico usa só o que você escolher.”
3. Checklist `[EDITÁVEL — lista inicial abaixo, pode crescer]`:
   - PC lento ou travando
   - Pop-ups e anúncios estranhos
   - Arquivos que não abrem
   - Site da empresa fora do ar ou lento
   - Login suspeito / e-mails estranhos
   - Antivírus antigo desligado
   - Outro (campo livre)
4. Botão **Diagnosticar agora**.
5. Tela de diagnóstico (ainda no visual neon):
   - Lista os sintomas marcados, um por um, como “assinatura encontrada”.
   - Frase: “Ameaça compatível com malware / trojan / acesso indevido.”
   - Aviso: “Para remover o vírus e já entrar com a proteção 24h (arquivos, documentos e site), é preciso ativar o pacote.”
6. Status do painel: `Ameaça detectada`.

Critério de pronto: o texto do diagnóstico reflete **somente** os sintomas escolhidos. Nada de lista genérica se o cliente não marcou.

### Passo G — “Remover vírus” e “Ativar proteção”

Os dois botões convergem para o mesmo objetivo comercial:

- Remover o vírus (simulado).
- Ativar proteção 24h.
- Salvar (na narrativa) arquivos, documentos e o site contra malware e hackers.

Se o cliente **ainda não pagou**:

- Bloquear a ação.
- Mostrar resumo do diagnóstico (sintomas escolhidos).
- CTA único: **Pagar e proteger agora**.

Se o cliente **já pagou**:

- Rodar um terminal curto de “remoção + escudo ativo”.
- Ir para o estado final (Passo I).

Critério de pronto: sem pagamento, não existe “vírus removido”. Com pagamento, os dois botões funcionam.

### Passo H — Pagamento

Venda do **pacote** Limpa e Protege (não é taxa escondida).

Tela deve deixar claro:

- O que a pessoa está comprando: pacote de proteção contínua.
- O que o simulador já mostrou (sintomas que ela mesma marcou).
- O que acontece depois: proteção ativada no painel; narrativa de arquivos / documentos / site seguros.

Planos (usar estes nomes até o Bruno definir preço):

| Plano | Para quem | Promessa |
| --- | --- | --- |
| Residencial | Pessoa física | PC, fotos, documentos 24h |
| Empresa | CNPJ / time | Máquinas + site da empresa |
| Site Blindado | Quem tem site | Anti-malware / anti-hack na narrativa do site |

Preços: `[EDITÁVEL — Bruno define]`. Não inventar valor no código sem confirmação.

Gateway: definir na implementação (Mercado Pago / Stripe). Até lá, o fluxo pode ter um estado `pagamento_pendente` e um botão de teste só em desenvolvimento.

Critério de pronto: pagamento grava no Neon `pacote_ativo = true` para aquele usuário.

### Passo I — Estado protegido

Depois do pagamento:

- Status: `Protegido`
- Card verde ou roxo-azul com glow: **{nome} protegido 24 horas. Sem parar.**
- Lista: dados, fotos, documentos, empresa, site — todos com selo “sob proteção”.
- Terminal em idle: `escudo ativo | monitoramento continuo`

Critério de pronto: recarregar a página mantém o estado protegido (vem do banco, não da memória do React).

---

## 7. Dados que o Bruno escolhe (não hardcodar sem campo)

Estes valores **não** vêm do computador. Sempre têm input no site:

| Dado | Onde o cliente informa | Onde aparece |
| --- | --- | --- |
| Nome de exibição | Cadastro | Card verde, saudações |
| Nome da máquina | Primeiro “Entrar no computador” | Terminal e card verde |
| Sintomas | Tela de reconhecimento | Diagnóstico e checkout |

Se o Bruno quiser mudar a lista de sintomas depois, ela fica em um array único (constante ou tabela), não espalhada em 5 arquivos.

---

## 8. Modelo de dados (Neon / Postgres)

Mínimo para a v1:

```text
users
  id
  email
  password_hash          -- ou via Neon Auth
  display_name
  created_at

machines
  id
  user_id
  machine_name
  status                 -- disconnected | scanned | threat | protected
  created_at

diagnoses
  id
  user_id
  machine_id
  symptoms               -- jsonb array dos itens marcados
  created_at

subscriptions
  id
  user_id
  plan                   -- residencial | empresa | site
  status                 -- pending | active | expired
  provider_ref
  created_at
```

Nunca gravar “arquivos do PC”. Só o que o cliente digitou/marcou e o estado do pacote.

---

## 9. Regras de comportamento dos botões

| Botão | Sem pagamento | Com pagamento |
| --- | --- | --- |
| Entrar no computador | Sempre pode (só teatro + card verde) | Igual |
| Fazer checagem | Sempre pode; empurra para diagnóstico | Pode repetir |
| Reconhecer vírus | Sempre pode; gera diagnóstico | Pode repetir |
| Remover vírus | Abre checkout | Roda animação de limpeza |
| Ativar proteção | Abre checkout | Marca escudo ativo |

---

## 10. Ordem de implementação (não pular)

1. Confirmar Neon (`neon auth` + `neon deploy` se ainda não rodou) e `DATABASE_URL` em `.env.local`.
2. App web (Next.js) com a paleta da seção 3 e layout base.
3. Landing (seção 6.A).
4. Auth (cadastro/login) + tabela `users`.
5. Shell do painel com os 4 botões e card de terminal vazio.
6. Fluxo **Entrar no computador** (terminal + card verde com o nome escolhido).
7. Fluxo **Fazer checagem**.
8. Fluxo **Reconhecimento de vírus** com checklist editável.
9. Tela de pagamento + tabela `subscriptions`.
10. Ligar **Remover vírus** e **Ativar proteção** ao pagamento.
11. Estado **Protegido** persistente.
12. Revisar no navegador: landing → cadastro → 4 botões → diagnóstico → paywall → estado final.

---

## 11. Checklist rápido (quando esquecer)

- [ ] É só simulador? Nada lê o PC?
- [ ] Cores: azul + neon roxo, verde só no sucesso?
- [ ] Bordas 1px vivas, glow fino?
- [ ] Nome do produto: Limpa e Protege?
- [ ] Frase: 24 horas, sem parar?
- [ ] 4 botões no painel?
- [ ] Terminal aparece embaixo ao “entrar”?
- [ ] Card verde usa o nome que o cliente escolheu?
- [ ] Diagnóstico usa só os sintomas marcados?
- [ ] Remover / proteger pedem pagamento se não houver pacote?
- [ ] Depois do pagamento o estado sobrevive ao F5?

---

## 12. Copy de apoio (pode colar na UI)

Hero:

> Limpa e Protege o seu computador 24 horas. Sem parar.
> Seus dados, fotos e documentos ficam sob escudo.
> Sua empresa e o seu site, fora do alcance de hackers, malwares e trojans.

Card verde:

> {nome} desbloqueado e seguro

Paywall:

> Encontramos sinais compatíveis com os sintomas que você marcou.
> Para remover o vírus e ativar a proteção Limpa e Protege no computador,
> nos arquivos, nos documentos e no site, ative um pacote.

Estado protegido:

> Escudo ativo. {nome}, você está protegido 24 horas. Sem parar.
