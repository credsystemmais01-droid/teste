"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";
import { Copyright } from "@/components/Copyright";

type AdminUser = {
  id: string;
  email: string;
  panelName: string;
  resolvedName: string;
  removeDiagnosis: string;
  removeDiagnosisEnabled: boolean;
  resolvedDiagnosis: string;
  logReadSeconds: number | "";
  resolvedLogReadSeconds: number;
};

type UserDraft = {
  panelName: string;
  removeDiagnosis: string;
  removeDiagnosisEnabled: boolean;
  logReadSeconds: string;
};

const TIME_PRESETS = [5, 8, 15, 30, 60, 120, 180];

function formatSeconds(value: string | number) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n < 60) return `${n} segundos`;
  const min = Math.floor(n / 60);
  const sec = n % 60;
  return sec ? `${min} min ${sec} s` : `${min} minuto${min > 1 ? "s" : ""}`;
}

function TimePicker({
  id,
  value,
  onChange,
  emptyHint,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
  emptyHint?: string;
}) {
  const preview = value ? formatSeconds(value) : emptyHint;
  return (
    <div className="field" style={{ margin: 0 }}>
      <label htmlFor={id}>1. Tempo da leitura no CMD</label>
      <p className="admin-help">
        É o tempo que o console fica passando os nomes dos arquivos. Quando esse tempo acaba, a
        mensagem final aparece.
      </p>
      <input
        id={id}
        type="number"
        min={2}
        max={300}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={emptyHint || "Segundos"}
      />
      <div className="time-presets">
        {TIME_PRESETS.map((seconds) => (
          <button
            key={seconds}
            className={`btn btn-ghost time-chip${value === String(seconds) ? " selected" : ""}`}
            type="button"
            onClick={() => onChange(String(seconds))}
          >
            {seconds}s
          </button>
        ))}
      </div>
      {preview ? <p className="muted">Neste CMD: {preview} de leitura, depois a mensagem.</p> : null}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [defaultDiagnosis, setDefaultDiagnosis] = useState("");
  const [defaultLogReadSeconds, setDefaultLogReadSeconds] = useState("8");
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
    setDefaultDiagnosis(data.defaultRemoveDiagnosis || "");
    setDefaultLogReadSeconds(String(data.defaultLogReadSeconds || 8));
    setUsers(data.users || []);
    setDrafts(
      Object.fromEntries(
        (data.users || []).map((user: AdminUser) => [
          user.id,
          {
            panelName: user.panelName,
            removeDiagnosis: user.removeDiagnosis,
            removeDiagnosisEnabled: user.removeDiagnosisEnabled,
            logReadSeconds:
              user.logReadSeconds === "" || user.logReadSeconds == null
                ? ""
                : String(user.logReadSeconds),
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
        defaultRemoveDiagnosis: defaultDiagnosis,
        defaultLogReadSeconds,
      }),
    });
    if (!response.ok) {
      setError("Não foi possível salvar os padrões.");
      return;
    }
    setSaved("Padrão salvo. Vale para contas sem tempo ou mensagem próprios.");
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
        logReadSeconds: draft?.logReadSeconds || "",
      }),
    });
    if (!response.ok) {
      setError("Não foi possível salvar esta conta.");
      return;
    }
    setSaved("Conta salva. No próximo clique de checagem ou remover vírus o cliente já vê o tempo e a mensagem novos.");
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
        <h1>Tempo do CMD e mensagem final</h1>
        <p className="muted">
          Você define duas coisas: quanto tempo o console fica lendo, e qual texto aparece quando
          essa leitura acaba. O cliente vê isso em “Fazer checagem” e em “Remover vírus”.
        </p>
      </section>

      {error ? <p className="error">{error}</p> : null}
      {saved ? <p className="muted">{saved}</p> : null}

      <section className="card form admin-defaults">
        <h2>Padrão para todo mundo</h2>
        <p className="muted">
          Se a conta não tiver tempo ou mensagem próprios, usa o que está aqui.
        </p>
        <TimePicker
          id="defaultLogReadSeconds"
          value={defaultLogReadSeconds}
          onChange={setDefaultLogReadSeconds}
        />
        <div className="field">
          <label htmlFor="defaultDiagnosis">2. Mensagem final (aparece depois do tempo)</label>
          <p className="admin-help">
            Este texto entra no CMD no fim da leitura, em rosa. Também aparece no card abaixo do
            console.
          </p>
          <textarea
            id="defaultDiagnosis"
            value={defaultDiagnosis}
            onChange={(event) => setDefaultDiagnosis(event.target.value)}
            placeholder="Ex.: Trojan em pasta temporária. Sessão suspeita na porta 445. Recomendado isolar e ativar o pacote."
          />
        </div>
        <p className="muted">
          Resumo: o CMD lê por {formatSeconds(defaultLogReadSeconds) || "—"} e depois mostra a
          mensagem padrão.
        </p>
        <button className="btn btn-blue" type="button" onClick={saveDefaults}>
          Salvar padrão
        </button>
      </section>

      <section className="admin-list">
        {users.map((user) => {
          const draft = drafts[user.id] || {
            panelName: "",
            removeDiagnosis: "",
            removeDiagnosisEnabled: false,
            logReadSeconds: "",
          };
          const usedSeconds = draft.logReadSeconds || defaultLogReadSeconds;
          const usedMessage = (draft.removeDiagnosis || defaultDiagnosis).trim();
          return (
            <article className="card admin-account" key={user.id}>
              <div>
                <strong>{user.email}</strong>
                <p className="muted">
                  Nome no painel: {user.resolvedName || "ainda sem nome"}
                  {` · CMD: ${formatSeconds(user.resolvedLogReadSeconds)}`}
                  {user.removeDiagnosisEnabled
                    ? " · mensagem ligada"
                    : " · mensagem desligada (só o log, sem o texto final)"}
                </p>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor={`name-${user.id}`}>Nome desta conta (grande no painel e no CMD)</label>
                <input
                  id={`name-${user.id}`}
                  value={draft.panelName}
                  onChange={(event) => patchDraft(user.id, { panelName: event.target.value })}
                  placeholder="Ex.: Pedro"
                />
              </div>
              <TimePicker
                id={`time-${user.id}`}
                value={draft.logReadSeconds}
                onChange={(next) => patchDraft(user.id, { logReadSeconds: next })}
                emptyHint={`Usa o padrão: ${formatSeconds(defaultLogReadSeconds)}`}
              />
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor={`diag-${user.id}`}>2. Mensagem final desta conta</label>
                <p className="admin-help">
                  Vazio = usa a mensagem padrão. Só aparece se o interruptor abaixo estiver ligado.
                </p>
                <textarea
                  id={`diag-${user.id}`}
                  value={draft.removeDiagnosis}
                  onChange={(event) => patchDraft(user.id, { removeDiagnosis: event.target.value })}
                  placeholder={defaultDiagnosis || "Escreva a mensagem que o cliente lê no fim do CMD."}
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
                Ligar a mensagem final no CMD desta conta
              </label>
              <p className="muted">
                {draft.removeDiagnosisEnabled
                  ? `Este cliente: o CMD lê ${formatSeconds(usedSeconds)} e depois mostra “${usedMessage.slice(0, 80) || "…"}${usedMessage.length > 80 ? "…" : ""}”.`
                  : "Este cliente: o CMD lê os logs e termina sem a sua mensagem, porque o interruptor está desligado."}
              </p>
              <button className="btn btn-purple" type="button" onClick={() => saveUser(user.id)}>
                Salvar esta conta
              </button>
            </article>
          );
        })}
      </section>
      <Copyright />
    </main>
  );
}
