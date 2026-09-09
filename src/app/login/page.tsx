"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { GoogleButton } from "@/components/GoogleButton";
import { safeNext } from "@/lib/nextPath";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [error, setError] = useState(
    params.get("erro") === "google"
      ? "O login com Google ainda precisa ser liberado no console da Google."
      : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Falha no login");
      return;
    }
    router.push(next);
  }

  return (
    <form className="card form" onSubmit={onSubmit}>
      <p className="tiny">Acesso seguro</p>
      <h1>Entrar</h1>
      <p className="muted">Acesse o painel e continue a proteção 24h.</p>
      {error ? <p className="error">{error}</p> : null}
      <GoogleButton next={next} />
      <p className="auth-or">ou entre com e-mail</p>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <button className="btn btn-blue full" type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar no painel"}
      </button>
      <p className="muted form-foot">
        Novo por aqui? <Link href={`/cadastro?next=${encodeURIComponent(next)}`}>Criar conta</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="wrap">
      <SiteNav extra="none" />
      <Suspense>
        <LoginForm />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
