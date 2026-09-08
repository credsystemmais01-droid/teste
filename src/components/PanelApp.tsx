"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand } from "@/components/Brand";
import { SYMPTOMS } from "@/lib/symptoms";

type View = "hub" | "enter" | "check" | "virus" | "remove" | "protect" | "safe";
type Status = "disconnected" | "scanned" | "threat" | "protected";

type Me = {
  user: { panelName: string; email: string };
  isAdmin?: boolean;
  machine: { name: string; status: Status } | null;
  symptoms: string[];
  subscription: { plan: string; status: string } | null;
};

const STATUS_LABEL: Record<Status, string> = {
  disconnected: "Desconectado",
  scanned: "Lido",
  threat: "Ameaça detectada",
  protected: "Protegido",
};

const ENTER_LINES = (machine: string, name: string) => [
  "Limpa e Protege — console 24h",
  "--------------------------------",
  "> conectando ao perfil local...",
  `> identificando máquina: ${machine}`,
  `> usuario: ${name}`,
  "> varrendo memoria...",
  "> varrendo documentos...",
  "> varrendo fotos...",
  "> checando porta de rede do site...",
  "> desbloqueando sessao segura...",
  "> OK",
];

const CHECK_LINES = [
  "> checagem profunda iniciada",
  "> arquivos pessoais: OK (simulado)",
  "> fotos: OK (simulado)",
  "> documentos: OK (simulado)",
  "> assinaturas de malware: em analise",
  "> tráfego do site: em analise",
];

const CLEAN_LINES = [
  "> removendo assinaturas marcadas...",
  "> isolando processos simulados...",
  "> ativando escudo 24h...",
  "> escudo ativo | monitoramento continuo",
];

export function PanelApp() {
  const router = useRouter();
  const params = useSearchParams();
  const [me, setMe] = useState<Me | null>(null);
  const [view, setView] = useState<View>("hub");
  const [machineName, setMachineName] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [diagnosed, setDiagnosed] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function loadMe() {
    const response = await fetch("/api/me");
    if (!response.ok) {
      router.push("/login");
      return;
    }
    const data = (await response.json()) as Me;
    setMe(data);
    if (data.machine?.name) setMachineName(data.machine.name);
    if (data.symptoms?.length) setDiagnosed(data.symptoms);
    if (data.machine?.status === "protected" || data.subscription) setView("safe");
  }

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    const next = params.get("view") as View | null;
    if (next) setView(next);
  }, [params]);

  const status = (me?.machine?.status || "disconnected") as Status;

  async function saveMachine(nextStatus: Status) {
    const name = machineName.trim();
    if (name.length < 2) {
      setError("Informe o nome desta máquina.");
      return false;
    }
    const response = await fetch("/api/machine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineName: name, status: nextStatus }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Não foi possível salvar a máquina.");
      return false;
    }
    setError("");
    await loadMe();
    return true;
  }

  function playLines(script: string[], onDone: () => void) {
    setLines([]);
    setProgress(0);
    setRunning(true);
    let index = 0;
    const timer = setInterval(() => {
      setLines((current) => [...current, script[index]]);
      setProgress(Math.round(((index + 1) / script.length) * 100));
      index += 1;
      if (index >= script.length) {
        clearInterval(timer);
        setRunning(false);
        onDone();
      }
    }, 420);
  }

  async function startEnter() {
    setView("enter");
    setUnlocked(false);
    if (machineName.trim().length < 2) return;
    const ok = await saveMachine("scanned");
    if (!ok) return;
    playLines(ENTER_LINES(machineName.trim(), me?.user.panelName || "conta"), () => {
      setUnlocked(true);
    });
  }

  function startCheck() {
    setView("check");
    playLines(CHECK_LINES, () => undefined);
  }

  async function diagnose() {
    const symptoms = [...selected];
    if (other.trim()) symptoms.push(other.trim());
    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Diagnóstico incompleto.");
      return;
    }
    setDiagnosed(data.symptoms);
    setError("");
    await loadMe();
  }

  async function startPaidAction() {
    if (!me?.subscription) {
      router.push("/pagamento");
      return;
    }
    setView("safe");
    playLines(CLEAN_LINES, () => undefined);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const paid = Boolean(me?.subscription);
  const footer = useMemo(() => "Seu computador 24 horas. Sem parar.", []);

  if (!me) {
    return (
      <main className="wrap loader">
        <p className="muted">Abrindo o escudo 24h...</p>
      </main>
    );
  }

  return (
    <main className="wrap">
      <header className="site-header">
        <Brand href="/painel" />
        <div className="cta-row" style={{ marginTop: 0 }}>
          {me.isAdmin ? (
            <Link className="btn btn-ghost" href="/admin">
              Admin
            </Link>
          ) : null}
          <button className="btn btn-ghost" onClick={logout} type="button">
            Sair
          </button>
        </div>
      </header>

      <div className="panel-top">
        <div>
          <p className="tiny">Painel ao vivo</p>
          <h1>{me.user.panelName ? `Olá, ${me.user.panelName}` : "Olá"}</h1>
          <p className="muted">
            {me.user.panelName
              ? "Painel de proteção contínua."
              : "Conta conectada. O administrador ainda não definiu o nome desta conta."}
          </p>
          <p className="muted">Login: {me.user.email}</p>
        </div>
        <div className={`status ${status}`}>{STATUS_LABEL[status]}</div>
      </div>

      <div className="actions">
        <button className="card action-card" onClick={startEnter} type="button">
          <div className="ico">⌘</div>
          <strong>Entrar no computador</strong>
          <span>Leitura simulada e desbloqueio visual.</span>
        </button>
        <button
          className="card action-card"
          onClick={() => {
            setView("remove");
            if (paid) startPaidAction();
          }}
          type="button"
        >
          <div className="ico">⊘</div>
          <strong>Remover vírus</strong>
          <span>Limpeza narrativa após o pacote.</span>
        </button>
        <button
          className="card action-card"
          onClick={() => {
            setView("protect");
            if (paid) startPaidAction();
          }}
          type="button"
        >
          <div className="ico">◈</div>
          <strong>Ativar proteção</strong>
          <span>Escudo 24h para arquivos e site.</span>
        </button>
        <button className="card action-card" onClick={startCheck} type="button">
          <div className="ico">◎</div>
          <strong>Fazer checagem</strong>
          <span>Varredura profunda que leva ao diagnóstico.</span>
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {view === "enter" && machineName.trim().length < 2 ? (
        <section className="card form" style={{ marginTop: 0 }}>
          <h2>Nome desta máquina</h2>
          <p className="muted">Você escolhe o apelido. O site não lê o Windows.</p>
          <div className="field">
            <label htmlFor="machine">Ex.: PC-Bruno, Notebook-Escritorio</label>
            <input
              id="machine"
              value={machineName}
              onChange={(event) => setMachineName(event.target.value)}
            />
          </div>
          <button className="btn btn-blue" onClick={startEnter} type="button">
            Iniciar leitura
          </button>
        </section>
      ) : null}

      {view === "virus" || (view === "check" && !running && lines.length > 0) ? (
        <section className="card form" style={{ marginTop: 0, width: "100%" }}>
          <h2>Reconhecimento de vírus</h2>
          <p className="muted">
            Marque o que você está sentindo nesta máquina. O diagnóstico usa só o que você escolher.
          </p>
          {SYMPTOMS.map((item) => (
            <label className="check" key={item}>
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={(event) => {
                  setSelected((current) =>
                    event.target.checked ? [...current, item] : current.filter((value) => value !== item),
                  );
                }}
              />
              {item}
            </label>
          ))}
          <div className="field">
            <label htmlFor="other">Outro</label>
            <input id="other" value={other} onChange={(event) => setOther(event.target.value)} />
          </div>
          <button className="btn btn-purple" onClick={diagnose} type="button">
            Diagnosticar agora
          </button>
        </section>
      ) : null}

      {view === "check" && !running && lines.length > 0 ? (
        <p className="muted">A checagem não conclui “limpo”. Siga para o reconhecimento de vírus.</p>
      ) : null}

      {(view === "remove" || view === "protect") && !paid ? (
        <section className="danger-card">
          <h2>Ative o pacote para continuar</h2>
          <p>
            Encontramos sinais compatíveis com os sintomas que você marcou. Para remover o vírus e
            ativar a proteção Limpa e Protege no computador, nos arquivos, nos documentos e no site,
            ative um pacote.
          </p>
          {diagnosed.length ? (
            <ul>
              {diagnosed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Ainda não há diagnóstico. Faça a checagem e marque os sintomas.</p>
          )}
          <Link className="btn btn-blue" href="/pagamento">
            Pagar e proteger agora
          </Link>
        </section>
      ) : null}

      <section className="terminal">
        <div className="term-bar">
          <span className="term-dot" style={{ background: "#f43f5e" }} />
          <span className="term-dot" style={{ background: "#e879f9" }} />
          <span className="term-dot" style={{ background: "#22d3ee" }} />
          <span>Limpa e Protege — console 24h</span>
        </div>
        <div className="progress">
          <i style={{ ["--w" as string]: `${progress}%` }} />
        </div>
        <div className="term-body">
          {lines.length === 0 ? (
            <p className="muted">
              Console 24h. Clique em um botão para iniciar a leitura simulada.
              <span className="cursor" />
            </p>
          ) : (
            lines.map((line, index) => (
              <p className="line" key={`${line}-${index}`}>
                {line}
                {index === lines.length - 1 && running ? <span className="cursor" /> : null}
              </p>
            ))
          )}
        </div>
      </section>

      {unlocked && view === "enter" ? (
        <section className="success-card">
          <h2>{me.user.panelName || "Conta"} desbloqueado e seguro</h2>
          <p>Máquina {machineName} autenticada no Limpa e Protege.</p>
        </section>
      ) : null}

      {diagnosed.length > 0 && (view === "virus" || view === "check") ? (
        <section className="danger-card">
          <h3>Ameaça compatível com malware / trojan / acesso indevido.</h3>
          {diagnosed.map((item) => (
            <p key={item}>assinatura encontrada: {item}</p>
          ))}
          <p>
            Para remover o vírus e já entrar com a proteção 24h (arquivos, documentos e site), é
            preciso ativar o pacote.
          </p>
        </section>
      ) : null}

      {(view === "safe" || paid) && (view === "safe" || view === "remove" || view === "protect") ? (
        <section className="success-card">
          <h2>
            Escudo ativo. {me.user.panelName || "Sua conta"}, você está protegido 24 horas. Sem parar.
          </h2>
          <p>Dados, fotos, documentos, empresa e site — sob proteção.</p>
        </section>
      ) : null}

      <footer className="site-footer">
        <span className="muted">Limpa e Protege</span>
        <span className="muted">{footer}</span>
      </footer>
    </main>
  );
}
