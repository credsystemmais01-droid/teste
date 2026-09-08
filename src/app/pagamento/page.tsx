"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { ANNUAL, INSTALLMENT_LABEL, PRICE_LABEL } from "@/lib/pricing";

export default function PagamentoPage() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.symptoms) setSymptoms(data.symptoms);
      });
  }, []);

  async function pay() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Não foi possível abrir o pagamento.");
      return;
    }
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setError("Stripe não devolveu a página de pagamento.");
  }

  return (
    <main className="wrap">
      <header className="site-header">
        <Brand href="/painel" />
        <div className="header-nav">
          <Link className="btn btn-ghost" href="/blog">
            Blog
          </Link>
          <Link className="btn btn-ghost" href="/painel">
            Voltar ao painel
          </Link>
        </div>
      </header>
      <section className="pay-hero">
        <p className="tiny">Checkout</p>
        <h1>Ativar pacote Limpa e Protege</h1>
        <p className="muted">
          Preço único anual. Depois do pagamento, o painel fica protegido e a narrativa cobre
          arquivos, documentos e o site.
        </p>
      </section>
      {symptoms.length ? (
        <section className="card pillar" style={{ margin: "16px 0" }}>
          <h3>Sintomas que você marcou</h3>
          <ul>
            {symptoms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="muted">Nenhum sintoma marcado ainda. Você ainda pode ativar o pacote.</p>
      )}

      <article className="card price-card">
        <p className="tiny">Uso anual · pessoa física</p>
        <h2>{ANNUAL.name}</h2>
        <p className="price-big">{PRICE_LABEL}</p>
        <p className="price-note">
          ou {ANNUAL.installmentCount}x de {INSTALLMENT_LABEL}
        </p>
        <p className="muted">{ANNUAL.promise}</p>
        <ul className="price-points">
          <li>Um único valor para o ano.</li>
          <li>Parcelamento em 12 vezes no cartão, quando a Stripe e o banco liberarem.</li>
          <li>Pagamento processado pela Stripe.</li>
        </ul>
      </article>

      {error ? <p className="error">{error}</p> : null}
      <div className="cta-row">
        <button className="btn btn-blue" onClick={pay} disabled={loading} type="button">
          {loading ? "Abrindo Stripe..." : `Pagar ${PRICE_LABEL} no Stripe`}
        </button>
      </div>
    </main>
  );
}
