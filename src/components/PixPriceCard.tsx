import Link from "next/link";
import { PixLiveQr } from "@/components/PixLiveQr";
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
        <div className="pix-qr-frame">
          <PixLiveQr size={168} />
        </div>
        <p className="price-big">{price}</p>
        <p className="price-note">por ano</p>
        <p className="tiny">
          Aponte a câmera no QR, ou abra o pagamento e aponte lá. O valor sai da conta e os
          serviços ficam disponíveis.
        </p>
        <div className="cta-row">
          <Link className="btn btn-blue full" href="/pix">
            Pagar com Pix
          </Link>
        </div>
      </div>
    </article>
  );
}
