"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand } from "@/components/Brand";
import { Copyright } from "@/components/Copyright";
import { SYMPTOMS } from "@/lib/symptoms";
import { MAX_MACHINES } from "@/lib/machines";

type View = "hub" | "enter" | "check" | "virus" | "remove" | "protect" | "internet" | "keep" | "safe";
type Status = "disconnected" | "scanned" | "threat" | "protected";

type Machine = { id: string; name: string; status: Status; gmail: string };

type Me = {
  user: { panelName: string; email: string; authProvider?: string };
  profileComplete?: boolean;
  isAdmin?: boolean;
  machine: { name: string; status: Status } | null;
  machines?: Machine[];
  machineLimit?: number;
  symptoms: string[];
  subscription: { plan: string; status: string } | null;
  trial?: {
    enabled: boolean;
    used: boolean;
    active: boolean;
    days: number;
    daysLeft: number;
    endsAt: string;
  };
  access?: boolean;
  removeDiagnosis?: { enabled: boolean; text: string };
  logReadSeconds?: number;
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

const CHECK_NAMES = [
  "chrome.exe",
  "svchost.exe",
  "explorer.exe",
  "fotos/IMG_1022.jpg",
  "fotos/IMG_2041.jpg",
  "documentos/contrato.docx",
  "documentos/notas.pdf",
  "downloads/setup.exe",
  "appdata/temp/cache.tmp",
  "windows/system32/drivers",
  "desktop/backup.zip",
  "rede/porta-443",
  "rede/porta-80",
  "memoria/processo-1844",
  "memoria/processo-2201",
];

const CHECK_LOG_LINES = (name: string) => [
  `> usuario: ${name}`,
  "> checagem iniciada",
  ...CHECK_NAMES.map((item) => `> ${item}`),
];

const INTERNET_LINES = (machine: string, name: string) => [
  "Limpa e Protege — internet de volta",
  "--------------------------------",
  `> usuario: ${name}`,
  `> maquina: ${machine}`,
  "> checando adaptador de rede...",
  "> checando wi-fi e cabo...",
  "> limpando cache de DNS...",
  "> removendo proxy suspeito...",
  "> renovando IP...",
  "> liberando portas 80 e 443...",
  "> derrubando bloqueio do malware na conexao...",
  "> testando conexao...",
  "> internet respondendo",
];

const KEEP_SAFE_LINES = (machine: string, name: string) => [
  "Limpa e Protege — proteção permanente",
  "--------------------------------",
  `> usuario: ${name}`,
  `> maquina: ${machine}`,
  "> escudo permanente: ligando...",
  "> vigiando memoria e processos...",
  "> vigiando documentos, fotos e downloads...",
  "> vigiando rede, site e acessos...",
  "> conferindo drivers da maquina...",
  "> conferindo softwares do dia a dia...",
  "> compra permanente confirmada: sem validade",
  "> escudo 24h ativo | computador e notebook",
];

const CONNECT_LINES = (machine: string, gmail: string) => [
  "Limpa e Protege — conectar computador",
  "--------------------------------",
  `> computador: ${machine}`,
  `> conta vinculada: ${gmail}`,
  "> abrindo canal seguro...",
  "> conferindo identidade da conta...",
  "> vinculando computador ao acesso vitalicio...",
  "> registrando no escudo 24h...",
  "> computador conectado",
];

const TRIAL_LINES = (name: string, days: number) => [
  "Limpa e Protege — teste liberado",
  "--------------------------------",
  `> usuario: ${name}`,
  `> liberando acesso completo por ${days} dias...`,
  "> desbloqueio de computador: ok",
  "> reparo de internet: ok",
  "> checagem e remocao: ok",
  "> escudo 24h: ok",
  "> aproveite o painel completo",
];

const CLEAN_LINES = [
  "> removendo assinaturas marcadas...",
  "> isolando processos suspeitos...",
  "> ativando escudo 24h...",
  "> escudo ativo | monitoramento continuo",
];

const REMOVE_LOG_LINES = (name: string) => [
  "Limpa e Protege — leitura de logs",
  "--------------------------------",
  `> usuario: ${name}`,
  "> iniciando leitura de logs...",
  "> eventlog: carregando...",
  "> processos em memoria...",
  "> conexoes de rede...",
  "> arquivos temporarios...",
  "> assinaturas de malware...",
  "> cruzando evidencias...",
];

function diagnosisLines(text: string) {
  const parts = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return ["> --------------------------------", "> DIAGNOSTICO", ...parts.map((line) => `> ${line}`), "> fim da leitura"];
}

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
  const [removeDone, setRemoveDone] = useState(false);
  const [checkDone, setCheckDone] = useState(false);
  const [internetDone, setInternetDone] = useState(false);
  const [keepDone, setKeepDone] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeId, setActiveId] = useState("");
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectName, setConnectName] = useState("");
  const [connectGmail, setConnectGmail] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const playTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadMe(applyView = false) {
    const response = await fetch("/api/me");
    if (!response.ok) {
      router.push("/login");
      return;
    }
    const data = (await response.json()) as Me;
    if (data.user.authProvider === "google" && data.profileComplete === false) {
      router.push("/completar-cadastro");
      return;
    }
    setMe(data);
    applyMachines(data);
    if (data.symptoms?.length) setDiagnosed(data.symptoms);
    if (applyView && (data.machine?.status === "protected" || data.subscription)) setView("safe");
  }

  function applyMachines(data: Me) {
    const list = data.machines || [];
    setMachines(list);
    setActiveId((current) => {
      const keep = list.find((item) => item.id === current);
      return keep ? keep.id : list[0]?.id || "";
    });
  }

  useEffect(() => {
    loadMe(true);
  }, []);

  useEffect(() => {
    const next = params.get("view") as View | null;
    if (next) setView(next);
  }, [params]);

  useEffect(() => {
    const current = machines.find((item) => item.id === activeId);
    if (current) setMachineName(current.name);
  }, [machines, activeId]);

  const activeMachine = machines.find((item) => item.id === activeId) || machines[0] || null;
  const machineLimit = me?.machineLimit || MAX_MACHINES;
  const slotsLeft = Math.max(0, machineLimit - machines.length);
  const status = (activeMachine?.status || me?.machine?.status || "disconnected") as Status;

  async function saveMachine(nextStatus: Status, explicitName?: string) {
    const name = (explicitName ?? machineName).trim() || "PC";
    if (name.length < 2) {
      setError("Informe o nome desta máquina.");
      return false;
    }
    const response = await fetch("/api/machine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineName: name, status: nextStatus, machineId: activeId || undefined }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Não foi possível salvar a máquina.");
      return false;
    }
    setError("");
    setMachineName(name);
    return true;
  }

  function stopConsole() {
    if (playTimer.current) {
      clearInterval(playTimer.current);
      playTimer.current = null;
    }
    setRunning(false);
    setLines([]);
    setProgress(0);
  }

  function playLines(script: string[], onDone: () => void, durationSeconds?: number) {
    if (playTimer.current) clearInterval(playTimer.current);
    const first = script[0] ? [script[0]] : [];
    setLines(first);
    setProgress(script.length ? Math.round(100 / script.length) : 0);
    setRunning(true);
    if (script.length <= 1) {
      setRunning(false);
      onDone();
      return;
    }
    const seconds = Math.min(300, Math.max(2, Number(durationSeconds) || 8));
    const remaining = script.length - 1;
    const delay = Math.max(20, Math.round((seconds * 1000) / remaining));
    let index = 1;
    playTimer.current = setInterval(() => {
      setLines((current) => [...current, script[index]].slice(-8));
      setProgress(Math.round(((index + 1) / script.length) * 100));
      index += 1;
      if (index >= script.length) {
        if (playTimer.current) clearInterval(playTimer.current);
        playTimer.current = null;
        setLines(script.slice(-8));
        setRunning(false);
        onDone();
      }
    }, delay);
  }

  async function refreshMe() {
    const response = await fetch("/api/me");
    if (!response.ok) {
      router.push("/login");
      return null;
    }
    const data = (await response.json()) as Me;
    setMe(data);
    applyMachines(data);
    if (data.symptoms?.length) setDiagnosed(data.symptoms);
    return data;
  }

  async function startTrial() {
    setError("");
    setTrialLoading(true);
    const response = await fetch("/api/trial", { method: "POST" });
    const data = await response.json().catch(() => ({}));
    setTrialLoading(false);
    if (!response.ok) {
      setError(data.error || "Não foi possível liberar o teste agora.");
      await refreshMe();
      return;
    }
    const fresh = await refreshMe();
    stopConsole();
    setView("hub");
    playLines(
      TRIAL_LINES(fresh?.user.panelName || me?.user.panelName || "conta", data.trial?.days || 7),
      () => undefined,
      fresh?.logReadSeconds ?? me?.logReadSeconds,
    );
  }

  function openConnect() {
    setError("");
    setConnectOpen(true);
    setConnectName("");
    setConnectGmail("");
  }

  async function connectMachine() {
    const name = connectName.trim();
    const gmail = connectGmail.trim().toLowerCase();
    if (name.length < 2) {
      setError("Dê um nome para este computador.");
      return;
    }
    setConnecting(true);
    const response = await fetch("/api/machines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineName: name, gmail }),
    });
    const data = await response.json().catch(() => ({}));
    setConnecting(false);
    if (!response.ok) {
      setError(data.error || "Não foi possível conectar este computador.");
      return;
    }
    setError("");
    setConnectOpen(false);
    setConnectName("");
    setConnectGmail("");
    setActiveId(data.machine.id);
    setMachineName(data.machine.name);
    await refreshMe();
    setView("enter");
    setUnlocked(false);
    stopConsole();
    playLines(
      CONNECT_LINES(data.machine.name, data.machine.gmail),
      () => setUnlocked(true),
      me?.logReadSeconds,
    );
  }

  async function disconnectMachine(id: string) {
    const response = await fetch(`/api/machines?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Não foi possível desconectar este computador.");
      return;
    }
    setError("");
    stopConsole();
    setView("hub");
    if (activeId === id) setActiveId("");
    await refreshMe();
  }

  function selectMachine(machine: Machine) {
    setActiveId(machine.id);
    setMachineName(machine.name);
    setError("");
    stopConsole();
    setView("hub");
    setUnlocked(false);
    setRemoveDone(false);
    setCheckDone(false);
    setInternetDone(false);
    setKeepDone(false);
  }

  function requireMachine() {
    if (activeMachine) return true;
    setError("Conecte um computador para começar.");
    openConnect();
    return false;
  }

  function startEnter() {
    if (!requireMachine()) return;
    setView("enter");
    setUnlocked(false);
    setCheckDone(false);
    setRemoveDone(false);
    setInternetDone(false);
    setKeepDone(false);
    stopConsole();
    const machine = activeMachine?.name || machineName.trim() || "PC";
    setMachineName(machine);
    const name = me?.user.panelName || "conta";
    playLines(ENTER_LINES(machine, name), () => setUnlocked(true), me?.logReadSeconds);
    void saveMachine("scanned", machine);
  }

  function buildDiagnosisScript(name: string, fresh: Me | null, base: string[]) {
    const script = [...base];
    if (fresh?.removeDiagnosis?.enabled && fresh.removeDiagnosis.text) {
      script.push(...diagnosisLines(fresh.removeDiagnosis.text));
    } else {
      script.push("> leitura concluida.");
    }
    return script;
  }

  async function startTimedLog(kind: "remove" | "check") {
    if (kind === "remove") {
      setView("remove");
      setRemoveDone(false);
    } else {
      setView("check");
      setCheckDone(false);
    }
    stopConsole();
    setRunning(true);
    setLines(["> iniciando leitura do log..."]);
    const fresh = (await refreshMe()) || me;
    const name = fresh?.user.panelName || me?.user.panelName || "conta";
    const base = kind === "remove" ? REMOVE_LOG_LINES(name) : CHECK_LOG_LINES(name);
    playLines(
      buildDiagnosisScript(name, fresh, base),
      () => {
        if (kind === "remove") setRemoveDone(true);
        else setCheckDone(true);
      },
      fresh?.logReadSeconds ?? me?.logReadSeconds,
    );
  }

  function startRemove() {
    if (!requireMachine()) return;
    void startTimedLog("remove");
  }

  function startInternet() {
    if (!requireMachine()) return;
    setView("internet");
    setInternetDone(false);
    setKeepDone(false);
    stopConsole();
    const machine = activeMachine?.name || machineName.trim() || "PC";
    setMachineName(machine);
    const name = me?.user.panelName || "conta";
    playLines(INTERNET_LINES(machine, name), () => setInternetDone(true), me?.logReadSeconds);
  }

  function startKeepSafe() {
    if (!requireMachine()) return;
    setView("keep");
    setKeepDone(false);
    setInternetDone(false);
    stopConsole();
    const machine = activeMachine?.name || machineName.trim() || "PC";
    setMachineName(machine);
    const name = me?.user.panelName || "conta";
    playLines(
      KEEP_SAFE_LINES(machine, name),
      () => {
        setKeepDone(true);
        if (access) void saveMachine("protected", machine).then(() => refreshMe());
      },
      me?.logReadSeconds,
    );
  }

  function startCheck() {
    if (!requireMachine()) return;
    void startTimedLog("check");
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
    if (!access) {
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
  const trial = me?.trial;
  const trialActive = Boolean(trial?.active) && !paid;
  const trialDays = trial?.days || 7;
  const canStartTrial = Boolean(trial?.enabled) && !paid && !trial?.used;
  const trialOver = Boolean(trial?.used) && !trial?.active && !paid;
  const access = paid || trialActive;
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
          <Link className="btn btn-ghost" href="/blog">
            Blog
          </Link>
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
          <h1>{me.user.panelName || "Olá"}</h1>
          <p className="muted">
            {me.user.panelName
              ? "Painel de proteção contínua."
              : "Conta conectada. O administrador ainda não definiu o nome desta conta."}
          </p>
          <p className="muted">Login: {me.user.email}</p>
          {paid ? <p className="price-badge">Acesso vitalício ativo</p> : null}
          {trialActive ? (
            <p className="price-badge trial-badge">
              Teste grátis · {trial?.daysLeft} dia{trial?.daysLeft === 1 ? "" : "s"} restante
              {trial?.daysLeft === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <div className={`status ${status}`}>{STATUS_LABEL[status]}</div>
      </div>

      {canStartTrial ? (
        <section className="card trial-card">
          <p className="tiny">Teste grátis</p>
          <h2>Use tudo por {trialDays} dias, sem pagar nada</h2>
          <p className="muted">
            Conecte o computador, desbloqueie o acesso, faça a internet voltar, rode a checagem e
            ligue o escudo 24h. O painel completo fica liberado por {trialDays} dias.
          </p>
          <p className="muted trial-nocard">
            Sem cartão de crédito, sem cobrança automática: o teste começa e termina sozinho. Você
            só paga se decidir ficar.
          </p>
          <div className="cta-row">
            <button className="btn btn-blue" onClick={startTrial} disabled={trialLoading} type="button">
              {trialLoading ? "Liberando..." : `Começar teste grátis de ${trialDays} dias`}
            </button>
            <Link className="btn btn-ghost" href="/pagamento">
              Ver o acesso vitalício
            </Link>
          </div>
        </section>
      ) : null}

      {trialActive ? (
        <section className="card trial-card active">
          <p className="tiny">Teste grátis rodando</p>
          <h2>
            Faltam {trial?.daysLeft} dia{trial?.daysLeft === 1 ? "" : "s"} do seu teste
          </h2>
          <p className="muted">
            Está tudo liberado no painel e nenhum cartão foi pedido. Para não perder a proteção
            quando o teste acabar, garanta o acesso vitalício — compra única, sem mensalidade.
          </p>
          <div className="cta-row">
            <Link className="btn btn-blue" href="/pagamento">
              Garantir acesso vitalício
            </Link>
          </div>
        </section>
      ) : null}

      {trialOver ? (
        <section className="danger-card">
          <h2>Seu teste grátis terminou</h2>
          <p>
            O painel completo — desbloqueio, internet, checagem e escudo 24h — volta com a compra
            única de acesso vitalício.
          </p>
          <Link className="btn btn-blue" href="/pagamento">
            Ativar acesso vitalício
          </Link>
        </section>
      ) : null}

      <section className="machines">
        <div className="machines-head">
          <div>
            <p className="tiny">Computadores conectados</p>
            <h2>
              {machines.length} de {machineLimit}
            </h2>
            <p className="muted">
              {slotsLeft > 0
                ? `Você ainda pode conectar ${slotsLeft} computador${slotsLeft > 1 ? "es" : ""} nesta conta.`
                : "Limite de computadores desta conta atingido. Desconecte um para liberar a vaga."}
            </p>
          </div>
          <button
            className="btn btn-purple"
            onClick={openConnect}
            disabled={slotsLeft === 0}
            type="button"
          >
            Conectar computador
          </button>
        </div>

        {machines.length ? (
          <div className="machine-grid">
            {machines.map((machine) => (
              <article
                className={`card machine-card${machine.id === activeMachine?.id ? " selected" : ""}`}
                key={machine.id}
              >
                <div className="machine-top">
                  <strong>{machine.name}</strong>
                  <span className={`status ${machine.status}`}>{STATUS_LABEL[machine.status]}</span>
                </div>
                <p className="muted machine-gmail">{machine.gmail || "sem Gmail vinculado"}</p>
                <div className="cta-row" style={{ marginTop: 4 }}>
                  {machine.id === activeMachine?.id ? (
                    <span className="machine-active">Computador em uso</span>
                  ) : (
                    <button
                      className="btn btn-ghost"
                      onClick={() => selectMachine(machine)}
                      type="button"
                    >
                      Usar este
                    </button>
                  )}
                  <button
                    className="btn btn-ghost"
                    onClick={() => disconnectMachine(machine.id)}
                    type="button"
                  >
                    Desconectar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">
            Nenhum computador conectado ainda. Conecte o primeiro com o Gmail dele para liberar o
            painel.
          </p>
        )}
      </section>

      <div className="actions">
        <button className="card action-card" onClick={startEnter} type="button">
          <div className="ico">⌘</div>
          <strong>Entrar no computador</strong>
          <span>Leitura da máquina e liberação do acesso.</span>
        </button>
        <button className="card action-card" onClick={startRemove} type="button">
          <div className="ico">⊘</div>
          <strong>Remover vírus</strong>
          <span>Leitura de logs e diagnóstico do administrador.</span>
        </button>
        <button
          className="card action-card"
          onClick={() => {
            setView("protect");
            if (access) startPaidAction();
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
          <span>Leitura de logs e diagnóstico definido para esta conta.</span>
        </button>
        <button className="card action-card" onClick={startInternet} type="button">
          <div className="ico">⇄</div>
          <strong>Fazer internet voltar</strong>
          <span>Reparo da conexão: DNS, proxy, IP e portas de rede.</span>
        </button>
        <button className="card action-card" onClick={startKeepSafe} type="button">
          <div className="ico">∞</div>
          <strong>Manter máquina segura</strong>
          <span>Escudo permanente no computador e no notebook.</span>
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {connectOpen ? (
        <section className="card form" style={{ marginTop: 0 }}>
          <h2>Conectar computador</h2>
          <p className="muted">
            Dê um nome ao computador e informe o Gmail que fica vinculado a ele. Cada
            computador usa o seu próprio Gmail.
          </p>
          <div className="field">
            <label htmlFor="connect-name">Nome do computador</label>
            <input
              id="connect-name"
              placeholder="Ex.: PC da sala, Notebook do trabalho"
              value={connectName}
              onChange={(event) => setConnectName(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="connect-gmail">Gmail deste computador</label>
            <input
              id="connect-gmail"
              type="email"
              inputMode="email"
              autoComplete="off"
              placeholder="nome@gmail.com"
              value={connectGmail}
              onChange={(event) => setConnectGmail(event.target.value)}
            />
          </div>
          <div className="cta-row" style={{ marginTop: 8 }}>
            <button className="btn btn-blue" onClick={connectMachine} disabled={connecting} type="button">
              {connecting ? "Conectando..." : "Conectar computador"}
            </button>
            <button className="btn btn-ghost" onClick={() => setConnectOpen(false)} type="button">
              Cancelar
            </button>
          </div>
        </section>
      ) : null}

      {view === "virus" ? (
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
              Console 24h em espera. Escolha uma ação acima para iniciar a leitura.
              <span className="cursor" />
            </p>
          ) : (
            lines.map((line, index) => {
              const diagStart = lines.findIndex((item) => item === "> DIAGNOSTICO");
              const isDiag = diagStart >= 0 && index >= diagStart;
              return (
                <p className={isDiag ? "line diag" : "line"} key={`${line}-${index}`}>
                  {line}
                  {index === lines.length - 1 && running ? <span className="cursor" /> : null}
                </p>
              );
            })
          )}
        </div>
      </section>

      {((view === "remove" && removeDone) || (view === "check" && checkDone)) &&
      me.removeDiagnosis?.enabled &&
      me.removeDiagnosis.text ? (
        <section className="danger-card">
          <h3>Diagnóstico do administrador</h3>
          {me.removeDiagnosis.text.split(/\r?\n/).map((line, index) =>
            line.trim() ? <p key={`${line}-${index}`}>{line}</p> : null,
          )}
        </section>
      ) : null}

      {(view === "remove" || view === "protect") && !access && (view === "protect" || removeDone) ? (
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
          ) : me.removeDiagnosis?.enabled ? (
            <p className="muted">O resultado da leitura está no console acima.</p>
          ) : (
            <p className="muted">Ainda não há sintomas marcados. Faça a checagem se quiser complementar.</p>
          )}
          <Link className="btn btn-blue" href="/pagamento">
            Pagar e proteger agora
          </Link>
        </section>
      ) : null}

      {unlocked && view === "enter" ? (
        <section className="success-card">
          <h2>{me.user.panelName || "Conta"} desbloqueado e seguro</h2>
          <p>Máquina {machineName} autenticada no Limpa e Protege.</p>
        </section>
      ) : null}

      {diagnosed.length > 0 && view === "virus" ? (
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

      {view === "internet" && internetDone ? (
        access ? (
          <section className="success-card">
            <h2>Internet de volta em {machineName || "sua máquina"}.</h2>
            <p>
              Conexão restabelecida: DNS limpo, proxy removido, IP renovado e portas liberadas.
              O escudo permanente segue vigiando a rede.
            </p>
          </section>
        ) : (
          <section className="danger-card">
            <h2>A conexão está travada por ameaça</h2>
            <p>
              A leitura mostra a rede derrubada: DNS sequestrado, proxy estranho e portas
              fechadas por malware. Para fazer a internet voltar e manter a rede limpa, ative a
              compra permanente do Limpa e Protege.
            </p>
            <Link className="btn btn-blue" href="/pagamento">
              Pagar uma vez e liberar a internet
            </Link>
          </section>
        )
      ) : null}

      {view === "keep" && keepDone ? (
        access ? (
          <section className="success-card">
            <h2>{me.user.panelName || "Sua conta"}, a máquina fica segura para sempre.</h2>
            <p>
              Compra permanente ativa: computador e notebook sob escudo 24 horas, sem
              mensalidade, sem renovação e sem data para acabar.
            </p>
          </section>
        ) : (
          <section className="danger-card">
            <h2>Deixe a máquina segura para sempre</h2>
            <p>
              O escudo permanente mantém computador e notebook vigiados 24 horas: memória,
              documentos, fotos, rede, site, drivers e softwares. É uma compra única, sem
              mensalidade e sem renovação.
            </p>
            <Link className="btn btn-blue" href="/pagamento">
              Pagar uma vez e proteger para sempre
            </Link>
          </section>
        )
      ) : null}

      {(view === "safe" || view === "protect" || (view === "remove" && removeDone)) && access ? (
        <section className="success-card">
          <h2>
            Escudo ativo. {me.user.panelName || "Sua conta"}, você está protegido 24 horas. Sem parar.
          </h2>
          <p>
            Dados, fotos, documentos, empresa e site — sob proteção permanente, no computador e
            no notebook.
          </p>
        </section>
      ) : null}

      <footer className="site-footer site-footer-simple">
        <span className="muted">{footer}</span>
        <Copyright />
      </footer>
    </main>
  );
}
