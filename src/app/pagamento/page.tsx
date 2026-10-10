"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { PackageInfo } from "@/components/PackageInfo";
import { PlanGrid } from "@/components/PlanGrid";
import { SiteFooter } from "@/components/SiteFooter";

export default function PagamentoPage() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [loadingPlan, setLoadingPlan] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.symptoms) setSymptoms(data.symptoms);
        if (data?.subscription) setPaid(true);
      });
  }, []);

  async function pay(plan: string) {
    setLoadingPlan(plan);
    setError("");
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await response.json();
    setLoadingPlan("");
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
        <h1>Escolha a assinatura de segurança</h1>
        <p className="muted">
          São três planos: Criptografia Security, Criptografia Guardian Proteção e Criptografia
          Security z1. A proteção fica ligada enquanto a assinatura estiver ativa. A cobrança
          sai pela Stripe, em nome da Guardian Proteção.
        </p>
      </section>

      {paid ? (
        <section className="success-card">
          <h2>Esta conta já tem uma assinatura ativa.</h2>
          <p>
            O plano está registrado: computador e notebook seguem sob o escudo 24 horas enquanto
            a assinatura estiver em dia.
          </p>
          <Link className="btn btn-blue" href="/painel">
            Voltar ao painel protegido
          </Link>
        </section>
      ) : null}
      {!paid && symptoms.length ? (
        <section className="card pillar" style={{ margin: "16px 0 28px" }}>
          <h3>Sintomas que você marcou</h3>
          <ul>
            {symptoms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : !paid ? (
        <p className="muted">Nenhum sintoma marcado ainda. Você ainda pode ativar o pacote.</p>
      ) : null}

      {!paid ? (
        <>
          <PackageInfo />
          {error ? <p className="error">{error}</p> : null}
          <PlanGrid action="pay" loadingPlan={loadingPlan} includeTest onPay={pay} />
        </>
      ) : null}
      <SiteFooter />
      </main>
    </>
  );
}
