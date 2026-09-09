"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { PackageInfo } from "@/components/PackageInfo";
import { PriceCard } from "@/components/PriceCard";
import { SiteFooter } from "@/components/SiteFooter";

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
    <>
      <header className="site-header">
        <div className="header-inner">
          <Brand href="/painel" />
          <div className="header-nav">
            <Link className="btn btn-ghost" href="/blog">
              Blog
            </Link>
            <Link className="btn btn-ghost" href="/painel">
              Voltar ao painel
            </Link>
          </div>
        </div>
      </header>
      <main className="wrap">
      <section className="pay-hero">
        <p className="tiny">Checkout</p>
        <h1>Ativar pacote Guardian Proteção</h1>
        <p className="muted">
          Leia o que entra no anual. O valor aparece por último, antes de pagar na Stripe.
        </p>
      </section>
      {symptoms.length ? (
        <section className="card pillar" style={{ margin: "16px 0 28px" }}>
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

      <PackageInfo />

      <section className="price-home">
        <PriceCard wide action="pay" loading={loading} error={error} onPay={pay} />
      </section>
      <SiteFooter />
      </main>
    </>
  );
}
