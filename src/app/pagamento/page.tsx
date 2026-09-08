"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";
import { PLANS } from "@/lib/symptoms";

export default function PagamentoPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<(typeof PLANS)[number]["id"]>("residencial");
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

  async function activate() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Não foi possível ativar o pacote.");
      return;
    }
    router.push("/painel?view=safe");
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
          Você está comprando proteção contínua. Depois do pagamento, o painel fica protegido
          e a narrativa cobre arquivos, documentos e o site.
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

      <div className="plans">
        {PLANS.map((item) => (
          <button
            key={item.id}
            className={`card plan ${plan === item.id ? "selected" : ""}`}
            type="button"
            onClick={() => setPlan(item.id)}
          >
            <p className="tiny">{item.forWho}</p>
            <h3>{item.name}</h3>
            <p className="muted">{item.promise}</p>
            <p className="price-note">Preço a definir</p>
          </button>
        ))}
      </div>

      {error ? <p className="error">{error}</p> : null}
      <p className="muted">Gateway de pagamento entra depois. Agora a ativação é de demonstração.</p>
      <div className="cta-row">
        <button className="btn btn-blue" onClick={activate} disabled={loading} type="button">
          {loading ? "Ativando..." : "Ativar pacote (demonstração)"}
        </button>
      </div>
    </main>
  );
}
