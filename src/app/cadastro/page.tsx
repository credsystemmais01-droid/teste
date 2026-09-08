"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
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
      setError(data.error || "Falha no cadastro");
      return;
    }
    router.push("/painel");
  }

  return (
    <main className="wrap">
      <header className="site-header">
        <Brand />
      </header>
      <form className="card form" onSubmit={onSubmit}>
        <p className="tiny">Comece agora</p>
        <h1>Criar conta</h1>
        <p className="muted">
          Você entra com o e-mail da conta. O nome que aparece no painel é definido pelo
          administrador.
        </p>
        {error ? <p className="error">{error}</p> : null}
        <div className="field">
          <label htmlFor="email">E-mail da conta</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" required minLength={6} />
        </div>
        <button className="btn btn-purple full" type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
        <p className="muted form-foot">
          Já tenho conta. <Link href="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
