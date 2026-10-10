import Link from "next/link";
import { formatBrlFromCents, type Plan } from "@/lib/pricing";
import { PriceBenefits } from "@/components/PriceBenefits";

type Props = {
  plan: Plan;
  action?: "links" | "pay";
  loading?: boolean;
  disabled?: boolean;
  onPay?: (planId: string) => void;
};

export function PriceCard({ plan, action = "links", loading, disabled, onPay }: Props) {
  const price = formatBrlFromCents(plan.amountCents);
  const next = `/pagamento?plano=${plan.id}`;
  const monthlyNote =
    plan.interval === "year"
      ? `cerca de ${formatBrlFromCents(Math.round(plan.amountCents / 12))} por mês, cobrado uma vez por ano`
      : null;

  return (
    <article className={`card price-card${plan.featured ? " featured" : ""}`}>
      <p className="tiny">Assinatura de segurança</p>
      <p className="price-badge">{plan.badge}</p>
      <h2>{plan.name}</h2>
      <p className="muted">{plan.promise}</p>
      <ul className="price-seals">
        {plan.seals.map((seal) => (
          <li key={seal}>{seal}</li>
        ))}
      </ul>
      <PriceBenefits items={plan.benefits} />
      <div className="price-tail">
        <p className="price-big">{price}</p>
        <p className="price-note">{plan.intervalLabel}</p>
        {monthlyNote ? <p className="tiny">{monthlyNote}</p> : null}
        <p className="tiny">
          Cobrança recorrente pela Stripe, em nome da Guardian Proteção. A proteção fica ativa
          enquanto a assinatura estiver em dia.
        </p>
        {action === "pay" ? (
          <div className="cta-row">
            <button
              className="btn btn-blue full"
              onClick={() => onPay?.(plan.id)}
              disabled={disabled || loading}
              type="button"
            >
              {loading ? "Abrindo Stripe..." : `Assinar ${price}`}
            </button>
          </div>
        ) : (
          <div className="cta-row">
            <Link className="btn btn-blue full" href={`/cadastro?next=${encodeURIComponent(next)}`}>
              Assinar este plano
            </Link>
            <Link className="btn btn-ghost full" href={`/login?next=${encodeURIComponent(next)}`}>
              Já tenho conta
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
