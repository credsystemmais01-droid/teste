import Link from "next/link";
import { PriceBenefits } from "@/components/PriceBenefits";
import { PIX_DEMO_CENTS, PIX_DEMO_NAME } from "@/lib/pixDemo";
import { formatBrlFromCents } from "@/lib/pricing";

const BENEFITS = [
  "Doze meses de escudo contínuo, pagos uma vez no Pix.",
  "Criptografia dos dados, fotos, documentos e da rede da máquina.",
  "Vigilância 24 horas no computador e no notebook durante o ano.",
  "Depois do pagamento, os serviços ficam disponíveis na conta.",
];

export function PixPriceCard() {
  const price = formatBrlFromCents(PIX_DEMO_CENTS);

  return (
    <article className="card price-card pix-price-card">
      <p className="tiny">Assinatura de segurança</p>
      <p className="price-badge">Pix</p>
      <h2>{PIX_DEMO_NAME}</h2>
      <p className="muted">
        Um ano de criptografia e vigilância. O pagamento de {price} sai pelo QR Pix desta
        assinatura.
      </p>
      <ul className="price-seals">
        <li>Anual</li>
        <li>Pix</li>
        <li>12 meses</li>
        <li>Serviços após o pagamento</li>
      </ul>
      <PriceBenefits items={BENEFITS} />
      <div className="price-tail">
        <p className="price-big">{price}</p>
        <p className="price-note">por ano</p>
        <p className="tiny">
          Cada conta abre o próprio checkout. Aponte a câmera no QR dessa tela para o valor sair
          do saldo e os serviços ficarem disponíveis.
        </p>
        <div className="cta-row">
          <Link className="btn btn-blue full" href="/pix?novo=1">
            Pagar com Pix
          </Link>
        </div>
      </div>
    </article>
  );
}
