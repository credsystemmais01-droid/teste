"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";

type AdminUser = {
  id: string;
  email: string;
  panelName: string;
  resolvedName: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [defaultName, setDefaultName] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  async function load() {
    const me = await fetch("/api/me");
    if (!me.ok) {
      router.push("/login");
      return;
    }
    const profile = await me.json();
    if (!profile.isAdmin) {
      router.push("/painel");
      return;
    }
    const response = await fetch("/api/admin/users");
    if (!response.ok) {
      setError("Não foi possível carregar as contas.");
      return;
    }
    const data = await response.json();
    setDefaultName(data.defaultPanelName || "");
    setUsers(data.users || []);
    setDrafts(
      Object.fromEntries((data.users || []).map((user: AdminUser) => [user.id, user.panelName])),
    );
  }

  useEffect(() => {
    load();
  }, []);

  async function saveDefault() {
    setError("");
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultPanelName: defaultName }),
    });
    if (!response.ok) {
      setError("Não foi possível salvar o nome padrão.");
      return;
    }
    setSaved("Nome padrão salvo.");
    await load();
  }

  async function saveUser(userId: string) {
    setError("");
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, panelName: drafts[userId] || "" }),
    });
    if (!response.ok) {
      setError("Não foi possível salvar o nome desta conta.");
      return;
    }
    setSaved("Nome da conta salvo.");
    await load();
  }

  return (
    <main className="wrap">
      <header className="site-header">
        <Brand href="/painel" />
        <Link className="btn btn-ghost" href="/painel">
          Ir ao painel
        </Link>
      </header>

      <section className="pay-hero">
        <p className="tiny">Administração</p>
        <h1>Nome que aparece no painel</h1>
        <p className="muted">
          O cliente entra com o e-mail da conta. O nome da ferramenta — no “Olá”, no console e no
          card verde — é o que você escolher aqui.
        </p>
      </section>

      {error ? <p className="error">{error}</p> : null}
      {saved ? <p className="muted">{saved}</p> : null}

      <section className="card form" style={{ width: "100%", maxWidth: "none" }}>
        <h2>Nome padrão</h2>
        <p className="muted">Usado quando a conta ainda não tem um nome específico.</p>
        <div className="field">
          <label htmlFor="defaultName">Nome padrão do painel</label>
          <input
            id="defaultName"
            value={defaultName}
            onChange={(event) => setDefaultName(event.target.value)}
            placeholder="Ex.: Bruno"
          />
        </div>
        <button className="btn btn-blue" type="button" onClick={saveDefault}>
          Salvar nome padrão
        </button>
      </section>

      <section className="admin-list">
        {users.map((user) => (
          <article className="card admin-row" key={user.id}>
            <div>
              <strong>{user.email}</strong>
              <p className="muted">No painel agora: {user.resolvedName || "ainda sem nome"}</p>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor={`name-${user.id}`}>Nome desta conta</label>
              <input
                id={`name-${user.id}`}
                value={drafts[user.id] || ""}
                onChange={(event) =>
                  setDrafts((current) => ({ ...current, [user.id]: event.target.value }))
                }
                placeholder="Deixe vazio para usar o padrão"
              />
            </div>
            <button className="btn btn-purple" type="button" onClick={() => saveUser(user.id)}>
              Salvar
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
