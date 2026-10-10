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
  const [phase, setPhase] = useState<"wait" | "processing" | "paid">("wait");

  useEffect(() => {
    if (!chargeId || phase !== "wait") return;
    let stop = false;

    async function look() {
      try {
        const response = await fetch(`/api/pix/status?id=${encodeURIComponent(chargeId)}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!stop && data.paid) setPhase("processing");
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
  }, [chargeId, phase]);

  useEffect(() => {
    if (phase !== "processing") return;
    const timer = window.setTimeout(() => setPhase("paid"), 3400);
    return () => window.clearTimeout(timer);
  }, [phase]);

  async function copyPayload() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const paid = phase === "paid";
  const processing = phase === "processing";

  return (
    <div className="gw">
      <div className={`gw-banner${paid ? " paid" : ""}${processing ? " processing" : ""}`}>
        {paid
          ? "Pagamento confirmado. Seus serviços estão disponíveis."
          : processing
            ? "O banco está processando o pagamento."
            : "Aguardando o Pix."}
      </div>
      <div className="gw-top">
        <Link href="/">← Guardian Proteção</Link>
        <span>{paid ? "Pago" : processing ? "Processando" : "Checkout"}</span>
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
              : processing
                ? "A confirmação chegou. O banco está concluindo o Pix antes de liberar a tela."
                : "Aponte a câmera da conta no QR. Confirme no app para o banco processar o pagamento."}
          </p>
        </aside>

        <section className="gw-pay">
          {processing ? (
            <div className="gw-bank" role="status" aria-live="polite">
              <div className="gw-bank-mark" aria-hidden />
              <p className="gw-thanks-kicker">Banco</p>
              <h2>Processando pagamento</h2>
              <p className="gw-bank-copy">O Pix de {price} está sendo confirmado.</p>
              <div className="gw-bank-track">
                <span />
              </div>
              <ol className="gw-bank-steps">
                <li>Pagamento confirmado na conta</li>
                <li>Banco processando o Pix</li>
                <li>Liberando os serviços</li>
              </ol>
            </div>
          ) : paid ? (
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
                  No app da conta, toque em Pix e aponte a câmera. Confirme o pagamento no botão que
                  sobe embaixo. O saldo desce {price} e o banco processa o Pix nesta tela.
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
