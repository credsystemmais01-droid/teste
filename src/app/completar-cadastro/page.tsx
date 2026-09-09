"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeNext } from "@/lib/nextPath";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthExtraFields } from "@/components/AuthExtraFields";

function CompletarForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [defaults, setDefaults] = useState({
    fullName: "",
    cpf: "",
    phone: "",
    city: "",
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data) {
          router.push("/login");
          return;
        }
        if (data.profileComplete) {
          router.push(next);
          return;
        }
        setDefaults({
          fullName: data.fullName || "",
          cpf: data.cpf || "",
          phone: data.phone || "",
          city: data.city || "",
        });
        setReady(true);
      });
  }, [next, router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        cpf: form.get("cpf"),
        phone: form.get("phone"),
        city: form.get("city"),
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Não foi possível salvar os dados.");
      return;
    }
    router.push(next);
  }

  if (!ready) {
    return (
      <main className="wrap loader">
        <p className="muted">Abrindo o cadastro...</p>
      </main>
    );
  }

  return (
    <main className="wrap">
      <SiteNav extra="none" />
      <form className="card form" onSubmit={onSubmit}>
        <p className="tiny">Quase lá</p>
        <h1>Completar dados</h1>
        <p className="muted">
          Sua conta Google entrou. Falta nome, CPF, WhatsApp e cidade para o pagamento na Stripe.
        </p>
        {error ? <p className="error">{error}</p> : null}
        <AuthExtraFields {...defaults} />
        <button className="btn btn-purple full" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar e entrar"}
        </button>
      </form>
      <SiteFooter />
    </main>
  );
}

export default function CompletarCadastroPage() {
  return (
    <Suspense>
      <CompletarForm />
    </Suspense>
  );
}
