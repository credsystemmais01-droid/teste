"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
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
    router.push("/painel");
  }

  return (
    <main className="wrap">
      <SiteNav extra="none" />
      <form className="card form" onSubmit={onSubmit}>
        <p className="tiny">Acesso seguro</p>
        <h1>Entrar</h1>
        <p className="muted">Acesse o painel e continue a proteção 24h.</p>
        {error ? <p className="error">{error}</p> : null}
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button className="btn btn-blue full" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar no painel"}
        </button>
        <p className="muted form-foot">
          Novo por aqui? <Link href="/cadastro">Criar conta</Link>
        </p>
      </form>
    </main>
  );
}
