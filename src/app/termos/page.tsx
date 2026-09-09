import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY, PRODUCT, SITE_URL, SUPPORT_EMAIL } from "@/lib/brand";
import { PRICE_LABEL, INSTALLMENT_LABEL, ANNUAL } from "@/lib/pricing";

export const metadata = {
  title: `Termos de serviço | ${COMPANY}`,
  description: `Termos de uso e serviço do pacote anual ${PRODUCT}, da ${COMPANY}.`,
};

export default function TermosPage() {
  return (
    <>
      <SiteNav extra="login" />
      <main className="wrap">
      <article className="article">
        <p className="tiny">Termos de serviço</p>
        <h1>Termos de serviço da {COMPANY}</h1>
        <p className="muted">Última atualização: 8 de setembro de 2026.</p>
        <p>
          Estes termos regulam o uso do site {SITE_URL} e do painel {PRODUCT}, comercializado
          pela {COMPANY}. Ao criar conta, marcar os termos ou pagar, você aceita estas regras.
        </p>

        <h2>1. O serviço</h2>
        <p>
          O pacote anual dá acesso ao painel por 12 meses: diagnóstico, log, destrava de
          acessos, atualização de drivers e softwares, e a proteção 24 horas no computador,
          nos dados, na empresa e no site, conforme a narrativa do painel.
        </p>

        <h2>2. Conta</h2>
        <ul>
          <li>Você precisa ter 18 anos ou mais.</li>
          <li>Os dados (nome, CPF, WhatsApp, cidade e e-mail) devem ser seus e verdadeiros.</li>
          <li>Pode entrar com e-mail e senha ou com a conta Google.</li>
          <li>A conta é pessoal. Não compartilhe a senha.</li>
        </ul>

        <h2>3. Preço e pagamento</h2>
        <p>
          O valor do anual é {PRICE_LABEL}, ou {ANNUAL.installmentCount}x de {INSTALLMENT_LABEL}
          quando a Stripe e o banco liberarem o parcelamento. É um único valor no ano, sem
          mensalidade extra. A cobrança é processada pela Stripe, em nome da {COMPANY}.
        </p>

        <h2>4. Ativação</h2>
        <p>
          Depois do pagamento confirmado, o painel fica protegido pelo período anual. Se o
          cartão recusar, o plano não ativa.
        </p>

        <h2>5. Uso aceitável</h2>
        <p>
          Você se compromete a não atacar o site, não criar contas falsas e não usar o painel
          para fraude. Podemos suspender a conta em caso de abuso ou chargeback reiterado.
        </p>

        <h2>6. Privacidade</h2>
        <p>
          O tratamento dos dados está na{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>

        <h2>7. Atendimento</h2>
        <p>
          Dúvidas, pedido de exclusão ou problema no pagamento:{" "}
          <Link href="/suporte">página de atendimento</Link> ou {SUPPORT_EMAIL}.
        </p>

        <h2>8. Lei</h2>
        <p>
          Estes termos seguem a lei brasileira. O foro é o do domicílio da {COMPANY}, salvo
          direito do consumidor em contrário.
        </p>

        <p className="muted">
          © {new Date().getFullYear()} {COMPANY}. Todos os direitos reservados.
        </p>
      </article>
      <SiteFooter />
      </main>
    </>
  );
}
