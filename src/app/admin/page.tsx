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
  removeDiagnosis: string;
  removeDiagnosisEnabled: boolean;
  resolvedDiagnosis: string;
};

type UserDraft = {
  panelName: string;
  removeDiagnosis: string;
  removeDiagnosisEnabled: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const [defaultName, setDefaultName] = useState("");
  const [defaultDiagnosis, setDefaultDiagnosis] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [drafts, setDrafts] = useState<Record<string, UserDraft>>({});
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
    setDefaultDiagnosis(data.defaultRemoveDiagnosis || "");
    setUsers(data.users || []);
    setDrafts(
      Object.fromEntries(
        (data.users || []).map((user: AdminUser) => [
          user.id,
          {
            panelName: user.panelName,
            removeDiagnosis: user.removeDiagnosis,
            removeDiagnosisEnabled: user.removeDiagnosisEnabled,
          },
        ]),
      ),
    );
  }

  useEffect(() => {
    load();
  }, []);

  function patchDraft(userId: string, next: Partial<UserDraft>) {
    setDrafts((current) => ({
      ...current,
      [userId]: { ...current[userId], ...next },
    }));
  }

  async function saveDefaults() {
    setError("");
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultPanelName: defaultName,
        defaultRemoveDiagnosis: defaultDiagnosis,
      }),
    });
    if (!response.ok) {
      setError("Não foi possível salvar os padrões.");
      return;
    }
    setSaved("Padrões salvos.");
    await load();
  }

  async function saveUser(userId: string) {
    setError("");
    const draft = drafts[userId];
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        panelName: draft?.panelName || "",
        removeDiagnosis: draft?.removeDiagnosis || "",
        removeDiagnosisEnabled: Boolean(draft?.removeDiagnosisEnabled),
      }),
    });
    if (!response.ok) {
      setError("Não foi possível salvar esta conta.");
      return;
    }
    setSaved("Conta salva. O cliente vê isso no próximo clique do painel.");
    await load();
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
            Ir ao painel
          </Link>
        </div>
      </header>

      <section className="pay-hero">
        <p className="tiny">Administração</p>
        <h1>Nome e diagnóstico do console</h1>
        <p className="muted">
          O cliente entra com o e-mail. O nome que você escrever aparece no CMD de “Entrar no
          computador”. O diagnóstico que você escrever e habilitar aparece no fim da leitura de
          logs de “Remover vírus”.
        </p>
      </section>

      {error ? <p className="error">{error}</p> : null}
      {saved ? <p className="muted">{saved}</p> : null}

      <section className="card form" style={{ width: "100%", maxWidth: "none" }}>
        <h2>Pronto para usar</h2>
        <p className="muted">
          Nome padrão e um diagnóstico já escrito. Em cada conta você escolhe se o log dele mostra
          esse resultado.
        </p>
        <div className="field">
          <label htmlFor="defaultName">Nome padrão do painel / CMD</label>
          <input
            id="defaultName"
            value={defaultName}
            onChange={(event) => setDefaultName(event.target.value)}
            placeholder="Ex.: Bruno"
          />
        </div>
        <div className="field">
          <label htmlFor="defaultDiagnosis">Diagnóstico pronto (log Remover vírus)</label>
          <textarea
            id="defaultDiagnosis"
            value={defaultDiagnosis}
            onChange={(event) => setDefaultDiagnosis(event.target.value)}
            placeholder="Ex.: Trojan em pasta temporária. Sessão suspeita na porta 445. Recomendado isolar e ativar o pacote."
          />
        </div>
        <button className="btn btn-blue" type="button" onClick={saveDefaults}>
          Salvar padrões
        </button>
      </section>

      <section className="admin-list">
        {users.map((user) => {
          const draft = drafts[user.id] || {
            panelName: "",
            removeDiagnosis: "",
            removeDiagnosisEnabled: false,
          };
          return (
            <article className="card admin-account" key={user.id}>
              <div>
                <strong>{user.email}</strong>
                <p className="muted">
                  No CMD agora: {user.resolvedName || "ainda sem nome"}
                  {user.removeDiagnosisEnabled
                    ? " · diagnóstico habilitado neste log"
                    : " · diagnóstico desligado neste log"}
                </p>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor={`name-${user.id}`}>Nome que aparece no CMD</label>
                <input
                  id={`name-${user.id}`}
                  value={draft.panelName}
                  onChange={(event) => patchDraft(user.id, { panelName: event.target.value })}
                  placeholder="Deixe vazio para usar o padrão"
                />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor={`diag-${user.id}`}>Resultado do log Remover vírus</label>
                <textarea
                  id={`diag-${user.id}`}
                  value={draft.removeDiagnosis}
                  onChange={(event) =>
                    patchDraft(user.id, { removeDiagnosis: event.target.value })
                  }
                  placeholder="Deixe vazio para usar o diagnóstico pronto. Só aparece se estiver habilitado."
                />
              </div>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={draft.removeDiagnosisEnabled}
                  onChange={(event) =>
                    patchDraft(user.id, { removeDiagnosisEnabled: event.target.checked })
                  }
                />
                Mostrar este diagnóstico no log desta conta
              </label>
              <button className="btn btn-purple" type="button" onClick={() => saveUser(user.id)}>
                Salvar esta conta
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
