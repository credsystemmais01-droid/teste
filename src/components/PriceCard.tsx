import Link from "next/link";
import { LIFETIME, INSTALLMENT_LABEL, PRICE_LABEL } from "@/lib/pricing";
import { PriceBenefits } from "@/components/PriceBenefits";
import { DEFAULT_TRIAL_DAYS } from "@/lib/trial";

type Props = {
  wide?: boolean;
  action?: "links" | "pay";
  loading?: boolean;
  error?: string;
  onPay?: () => void;
};

export function PriceCard({ wide, action = "links", loading, error, onPay }: Props) {
  return (
    <article className={`card price-card${wide ? " price-card-wide" : ""}`}>
      <p className="tiny">Compra única · pessoa física</p>
      <h2>{LIFETIME.name}</h2>
      <p className="price-badge">Compra única · acesso vitalício</p>
      <p className="muted">{LIFETIME.promise}</p>
      <ul className="price-seals">
        {LIFETIME.seals.map((seal) => (
          <li key={seal}>{seal}</li>
        ))}
      </ul>
      <PriceBenefits />
      <p className="tiny">
        Compra única processada pela Stripe, em nome da Guardian Proteção. Acesso vitalício,
        com 5 anos de atualização do serviço. Sem mensalidade e sem renovação.
      </p>
      <div className="price-tail">
        <p className="price-big">{PRICE_LABEL}</p>
        <p className="price-note">
          pagamento único, ou {LIFETIME.installmentCount}x de {INSTALLMENT_LABEL}
        </p>
        {error ? <p className="error">{error}</p> : null}
        {action === "pay" ? (
          <div className="cta-row">
            <button className="btn btn-blue full" onClick={onPay} disabled={loading} type="button">
              {loading ? "Abrindo Stripe..." : `Pagar ${PRICE_LABEL} no Stripe`}
            </button>
          </div>
        ) : (
          <div className="cta-row">
            <Link className="btn btn-blue full" href="/cadastro?next=/painel">
              Criar conta e testar {DEFAULT_TRIAL_DAYS} dias grátis
            </Link>
            <p className="tiny full trial-note">
              Teste de {DEFAULT_TRIAL_DAYS} dias sem cartão de crédito
            </p>
            <Link className="btn btn-purple full" href="/cadastro?next=/pagamento">
              Comprar agora no Stripe
            </Link>
            <Link className="btn btn-ghost full" href="/login?next=/pagamento">
              Já tenho conta
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
