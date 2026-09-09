import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY, PRODUCT, SITE_URL, SUPPORT_EMAIL } from "@/lib/brand";

export const metadata = {
  title: `Política de Privacidade | ${COMPANY}`,
  description: `Como a ${COMPANY} recolhe, usa, compartilha e protege os dados do ${PRODUCT}.`,
};

export default function PrivacidadePage() {
  return (
    <main className="wrap">
      <SiteNav extra="login" />
      <article className="article">
        <p className="tiny">Política de Privacidade</p>
        <h1>Política de Privacidade da {COMPANY}</h1>
        <p className="muted">Última atualização: 8 de setembro de 2026.</p>
        <p>
          Esta política descreve as informações que a {COMPANY} recolhe no site {PRODUCT} (
          {SITE_URL}), para que servem, com quem são compartilhadas, como você pode pedi-las e
          quais medidas de segurança usamos para protegê-las. Ao criar conta ou pagar, você
          concorda com esta política.
        </p>

        <h2>1. Quem é responsável</h2>
        <p>
          O responsável pelos dados é a {COMPANY}, que comercializa o pacote anual {PRODUCT}.
          Para falar sobre privacidade, use o e-mail {SUPPORT_EMAIL} ou a página{" "}
          <Link href="/suporte">de atendimento</Link>.
        </p>

        <h2>2. Quais informações recolhemos</h2>
        <p>Recolhemos só o que a conta, o painel e o pagamento precisam:</p>
        <ul>
          <li>Nome completo, e-mail, CPF, WhatsApp e cidade, quando você cria a conta.</li>
          <li>Senha, guardada em hash — não vemos a senha em texto aberto.</li>
          <li>
            Se você entra com Google: e-mail, nome e o identificador da conta Google que o
            Google nos envia.
          </li>
          <li>
            Nome da máquina e sintomas de diagnóstico que você mesmo digita ou marca no painel.
            Não lemos o sistema operacional, arquivos, teclado ou clipboard do seu computador.
          </li>
          <li>Estado do plano (pendente ou ativo) e referência do pagamento.</li>
          <li>
            Dados de pagamento no cartão são recolhidos e processados pela Stripe, não passam
            pelo nosso servidor.
          </li>
          <li>
            Cookie de sessão (`lp_session`), só para manter você logado no painel. É httpOnly
            e dura 14 dias.
          </li>
        </ul>

        <h2>3. Para que usamos</h2>
        <ul>
          <li>Criar e autenticar a sua conta.</li>
          <li>Mostrar o painel, o diagnóstico e o estado da proteção.</li>
          <li>Identificar o pagamento anual na Stripe, em nome da {COMPANY}.</li>
          <li>Atender suporte, estorno e exigência legal.</li>
          <li>Melhorar o site e evitar abuso da conta.</li>
        </ul>
        <p>Não usamos seus dados para anúncio de terceiros. Não vendemos lista de clientes.</p>

        <h2>4. Com quem compartilhamos</h2>
        <p>Compartilhamos o mínimo necessário, com estes prestadores:</p>
        <ul>
          <li>
            <strong>Stripe</strong> — processa o pagamento. Recebe e-mail, nome, valor e
            metadados do pedido. A cobrança sai em nome da {COMPANY}.
          </li>
          <li>
            <strong>Google</strong> — só se você escolher entrar com a conta Google.
          </li>
          <li>
            <strong>Neon</strong> — banco onde a conta e o painel ficam gravados.
          </li>
          <li>
            <strong>Vercel</strong> — hospeda o site e as APIs.
          </li>
        </ul>
        <p>
          Podemos divulgar dados se a lei, um tribunal ou uma autoridade exigir, ou para
          defender a {COMPANY} em disputa de pagamento. Fora isso, não entregamos seus dados
          a outras empresas.
        </p>

        <h2>5. Como divulgamos esta política</h2>
        <p>
          Esta página é pública em {SITE_URL}/privacidade. O link aparece no rodapé do site,
          no cadastro e pode ser enviado por e-mail quando você pedir. Se a política mudar de
          forma relevante, atualizamos a data no topo desta página.
        </p>

        <h2>6. Medidas de segurança</h2>
        <ul>
          <li>Site servido em HTTPS.</li>
          <li>Senha com hash (bcrypt). A senha pura não é gravada.</li>
          <li>Sessão em cookie httpOnly, com assinatura.</li>
          <li>Pagamento no ambiente da Stripe, com cartão fora do nosso banco.</li>
          <li>Acesso ao painel só com login.</li>
          <li>CPF e WhatsApp ficam na conta para identificar o cliente, não no blog.</li>
        </ul>
        <p>
          Nenhum sistema é 100% seguro. Se soubermos de incidente que afete a sua conta,
          avisamos no e-mail cadastrado.
        </p>

        <h2>7. Por quanto tempo guardamos</h2>
        <p>
          Os dados da conta ficam enquanto a conta existir. Dados de pagamento podem ser
          conservados pelo prazo que a Stripe e a lei fiscal pedirem. Se você pedir a
          exclusão da conta, apagamos o que não for obrigatório manter.
        </p>

        <h2>8. Seus direitos</h2>
        <p>
          Você pode pedir acesso, correção, exclusão, portabilidade ou informação sobre o
          uso dos seus dados. Escreva para {SUPPORT_EMAIL} ou use a página{" "}
          <Link href="/suporte">Atendimento</Link>. Responderemos pelo e-mail da conta.
        </p>

        <h2>9. Crianças</h2>
        <p>
          O site é para maiores de 18 anos. Não coletamos dados de menores de propósito.
        </p>

        <h2>10. Contato</h2>
        <p>
          {COMPANY} · {PRODUCT}
          <br />
          Site: <Link href="/">{SITE_URL}</Link>
          <br />
          Atendimento: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <br />
          Termos: <Link href="/termos">{SITE_URL}/termos</Link>
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
