import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY, PRODUCT, SUPPORT_EMAIL } from "@/lib/brand";

export const metadata = {
  title: `Atendimento | ${COMPANY}`,
  description: `Fale com o atendimento da ${COMPANY} sobre conta, painel e pagamento.`,
};

export default function SuportePage() {
  return (
    <main className="wrap">
      <SiteNav extra="login" />
      <article className="article">
        <p className="tiny">Atendimento ao cliente</p>
        <h1>Fale com a {COMPANY}</h1>
        <p>
          Aqui você resolve conta, painel {PRODUCT}, pagamento na Stripe e pedidos sobre os
          seus dados.
        </p>

        <h2>E-mail</h2>
        <p>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
        <p className="muted">
          Escreva com o e-mail da conta, o assunto (cadastro, pagamento, painel ou
          privacidade) e o que aconteceu. Respondemos em dias úteis.
        </p>

        <h2>Páginas úteis</h2>
        <ul>
          <li>
            <Link href="/cadastro">Criar conta</Link>
          </li>
          <li>
            <Link href="/login">Entrar no painel</Link>
          </li>
          <li>
            <Link href="/pagamento">Checkout do pacote anual</Link>
          </li>
          <li>
            <Link href="/privacidade">Política de Privacidade</Link>
          </li>
          <li>
            <Link href="/termos">Termos de serviço</Link>
          </li>
        </ul>

        <h2>Pagamento</h2>
        <p>
          A cobrança é feita pela Stripe, em nome da {COMPANY}. Se o cartão não passar ou o
          comprovante não bater, mande o e-mail da conta e o horário da tentativa.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
