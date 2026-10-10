import { PLANS, PUBLIC_PLANS } from "@/lib/pricing";
import { PixPriceCard } from "@/components/PixPriceCard";
import { PriceCard } from "@/components/PriceCard";

type Props = {
  action?: "links" | "pay";
  loadingPlan?: string;
  includeTest?: boolean;
  onPay?: (planId: string) => void;
};

export function PlanGrid({ action = "links", loadingPlan, includeTest, onPay }: Props) {
  const plans = includeTest ? PLANS : PUBLIC_PLANS;
  return (
    <section className="price-home">
      {plans.map((plan) => (
        <PriceCard
          key={plan.id}
          plan={plan}
          action={action}
          loading={loadingPlan === plan.id}
          disabled={Boolean(loadingPlan)}
          onPay={onPay}
        />
      ))}
      <PixPriceCard />
    </section>
  );
}
