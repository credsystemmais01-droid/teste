"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PixQr } from "@/components/PixQr";
import { usePixPayload } from "@/components/PixLiveQr";
import { PIX_DEMO_CENTS, PIX_DEMO_NAME } from "@/lib/pixDemo";
import { formatBrlFromCents } from "@/lib/pricing";

const SERVICES = [
  "Criptografia dos dados, fotos e documentos.",
  "Escudo 24 horas no computador e no notebook.",
  "Cuidado da empresa e do site pelo ano contratado.",
  "Internet, checagem e log do Guardião.",
];

const CHARGE_KEY = "pix-charge-id";

function useCheckoutCharge() {
  const [chargeId, setChargeId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startNew = params.get("novo") === "1";
    let id = startNew ? "" : sessionStorage.getItem(CHARGE_KEY) || "";
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(CHARGE_KEY, id);
    }
    if (startNew) {
      window.history.replaceState(null, "", "/pix");
    }
    setChargeId(id);
  }, []);

  return chargeId;
}

export function PixGateway() {
  const price = formatBrlFromCents(PIX_DEMO_CENTS);
  const chargeId = useCheckoutCharge();
  const payload = usePixPayload(chargeId);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!chargeId) return;
    let stop = false;

    async function look() {
      try {
        const response = await fetch(`/api/pix/status?id=${encodeURIComponent(chargeId)}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!stop && data.paid) setPaid(true);
      } catch {
        // A tela segue aguardando a leitura do QR.
      }
    }

    void look();
    const timer = window.setInterval(look, 1500);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, [chargeId]);

  async function copyPayload() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="gw">
      <div className={`gw-banner${paid ? " paid" : ""}`}>
        {paid ? "Pagamento confirmado. Seus serviços estão disponíveis." : "Aguardando o Pix."}
      </div>
      <div className="gw-top">
        <Link href="/">← Guardian Proteção</Link>
        <span>{paid ? "Pago" : "Checkout"}</span>
      </div>
      <div className="gw-shell">
        <aside className="gw-summary">
          <p className="gw-merchant">Guardian Proteção</p>
          <p className="gw-kicker">Assinatura anual</p>
          <h1>{price}</h1>
          <ul className="gw-lines">
            <li>
              <span>{PIX_DEMO_NAME}</span>
              <b>{price}</b>
            </li>
            <li>
              <span>Subtotal</span>
              <b>{price}</b>
            </li>
          </ul>
          <div className="gw-total">
            <span>{paid ? "Pago" : "Total a pagar"}</span>
            <b>{price}</b>
          </div>
          <p className="gw-note">
            {paid
              ? "O Pix foi recebido. A assinatura anual está ativa e os serviços já podem ser usados."
              : "Aponte a câmera da conta no QR. O valor sai do saldo e esta tela confirma o pagamento."}
          </p>
        </aside>

        <section className="gw-pay">
          {paid ? (
            <div className="gw-thanks">
              <p className="gw-thanks-kicker">Pagamento recebido</p>
              <h2>Obrigado pelo pagamento</h2>
              <p className="gw-thanks-price">{price}</p>
              <p>Seus serviços estão disponíveis.</p>
              <ul>
                {SERVICES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="gw-thanks-btn" href="/painel">
                Ir para os serviços
              </Link>
            </div>
          ) : (
            <>
              <h2>Pagamento</h2>
              <div className="gw-methods" role="radiogroup" aria-label="Forma de pagamento">
                <div className="gw-method" aria-disabled="true">
                  <span className="gw-radio" />
                  <span>
                    <strong>Cartão</strong>
                    <small>Use o Pix para esta assinatura</small>
                  </span>
                </div>
                <div className="gw-method selected">
                  <span className="gw-radio on" />
                  <span>
                    <strong>Pix</strong>
                    <small>Aponte a câmera da conta neste QR</small>
                  </span>
                </div>
              </div>

              <div className="gw-pix">
                <p className="gw-pix-title">Escaneie o QR para pagar</p>
                <div className="pix-qr-frame gw-qr">
                  {payload ? <PixQr value={payload} size={232} alt="QR Code Pix" /> : null}
                </div>
                <p className="gw-help">
                  No app da conta, toque em Pix e aponte a câmera para este código. O saldo desce{" "}
                  {price} e esta tela agradece o pagamento.
                </p>
                <label className="gw-copy-label" htmlFor="pix-code">
                  Pix copia e cola
                </label>
                <div className="gw-copy-row">
                  <input id="pix-code" readOnly value={payload} />
                  <button type="button" onClick={copyPayload}>
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
