import { ANNUAL } from "@/lib/pricing";

export function PriceBenefits() {
  return (
    <ul className="price-points">
      {ANNUAL.benefits.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
