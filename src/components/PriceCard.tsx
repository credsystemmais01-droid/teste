import Link from "next/link";
import { ANNUAL, INSTALLMENT_LABEL, PRICE_LABEL } from "@/lib/pricing";
import { PriceBenefits } from "@/components/PriceBenefits";

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
      <p className="tiny">Pacote anual · pessoa física</p>
      <h2>{ANNUAL.name}</h2>
      <p className="muted">{ANNUAL.promise}</p>
      <PriceBenefits />
      <p className="tiny">Pagamento processado pela Stripe, em nome da Guardian Proteção.</p>
      <div className="price-tail">
        <p className="price-big">{PRICE_LABEL}</p>
        <p className="price-note">
          ou {ANNUAL.installmentCount}x de {INSTALLMENT_LABEL}
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
            <Link className="btn btn-blue full" href="/cadastro?next=/pagamento">
              Criar conta e pagar no Stripe
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
