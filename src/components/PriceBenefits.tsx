import { LIFETIME } from "@/lib/pricing";

export function PriceBenefits() {
  return (
    <ul className="price-points">
      {LIFETIME.benefits.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
