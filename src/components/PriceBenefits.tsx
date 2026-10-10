export function PriceBenefits({ items }: { items: string[] }) {
  return (
    <ul className="price-points">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
