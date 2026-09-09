"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthExtraFields } from "@/components/AuthExtraFields";
import { GoogleButton } from "@/components/GoogleButton";
import { safeNext } from "@/lib/nextPath";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me").then((response) => {
      if (response.ok) router.replace(next);
    });
  }, [next, router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        cpf: form.get("cpf"),
        phone: form.get("phone"),
        city: form.get("city"),
        email: form.get("email"),
        password: form.get("password"),
        confirm: form.get("confirm"),
        accepted: form.get("accepted") === "on",
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Falha no cadastro");
      return;
    }
    router.push(next);
  }

  return (
    <form className="card form" onSubmit={onSubmit}>
      <p className="tiny">Comece agora</p>
      <h1>Criar conta</h1>
      <p className="muted">
        {next === "/pagamento"
          ? "Crie a conta para pagar na Stripe. Sem cadastro o pagamento não abre."
          : "Precisamos dos seus dados para a conta e para o pagamento na Stripe, em nome da Guardian Proteção."}
      </p>
      {error ? <p className="error">{error}</p> : null}
      <GoogleButton label="Criar conta com Google" next={next} />
      <p className="auth-or">ou preencha os dados</p>
      <AuthExtraFields />
      <div className="field">
        <label htmlFor="email">E-mail da conta</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
      </div>
      <div className="field">
        <label htmlFor="confirm">Confirmar senha</label>
        <input id="confirm" name="confirm" type="password" required minLength={6} autoComplete="new-password" />
      </div>
      <label className="terms-accept">
        <input name="accepted" type="checkbox" required />
        <span>
          Li e aceito os <Link href="/termos">termos de serviço</Link> e a{" "}
          <Link href="/privacidade">política de privacidade</Link> da Guardian Proteção.
        </span>
      </label>
      <button className="btn btn-purple full" type="submit" disabled={loading}>
        {loading ? "Criando..." : next === "/pagamento" ? "Criar conta e ir ao pagamento" : "Criar conta"}
      </button>
      <p className="muted form-foot">
        Já tenho conta. <Link href={`/login?next=${encodeURIComponent(next)}`}>Entrar</Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <>
      <SiteNav extra="none" />
      <main className="wrap">
        <Suspense>
          <RegisterForm />
        </Suspense>
        <SiteFooter />
      </main>
    </>
  );
}
