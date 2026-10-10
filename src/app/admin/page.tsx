"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";
import { Copyright } from "@/components/Copyright";
import { BlueScreenView, useLiveBlueScreen } from "@/components/BlueScreen";
import {
  BLUE_SCREEN_BG_DEFAULT,
  BLUE_SCREEN_BG_PRESETS,
  normalizeBlueScreenBg,
  BLUE_SCREEN_DURATION_DEFAULT,
  BLUE_SCREEN_DURATION_MAX,
  BLUE_SCREEN_DURATION_PRESETS,
  BLUE_SCREEN_MODES,
  BLUE_SCREEN_PRESETS,
  BLUE_SCREEN_SIZE_DEFAULT,
  BLUE_SCREEN_SIZE_MAX,
  BLUE_SCREEN_SIZE_MIN,
  blueScreenProgress,
  clampBlueScreenDuration,
  clampBlueScreenSize,
  formatClock,
  formatDurationLabel,
  normalizeBlueScreenMode,
  stepBlueScreenSize,
  type BlueScreenMode,
} from "@/lib/blueScreen";
import { SITE_URL } from "@/lib/brand";

type AdminTrial = {
  used: boolean;
  active: boolean;
  days: number;
  daysLeft: number;
  endsAt: string;
};

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
  trial: AdminTrial;
  paid: boolean;
  machineCount: number;
};

type UserDraft = {
  panelName: string;
  removeDiagnosis: string;
  removeDiagnosisEnabled: boolean;
  logReadSeconds: string;
};

const TIME_PRESETS = [5, 8, 15, 30, 60, 120, 180];
const TRIAL_PRESETS = [3, 7, 14, 30];

function trialLabel(trial: AdminTrial, paid: boolean) {
  if (paid) return "assinatura ativa";
  if (!trial.used) return "ainda não começou o teste";
  if (trial.active) return `teste rodando · ${trial.daysLeft} dia${trial.daysLeft > 1 ? "s" : ""} restante${trial.daysLeft > 1 ? "s" : ""}`;
  return "teste encerrado";
}

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
        O console fica passando os nomes dos arquivos durante todo esse tempo, sem parar antes.
        Só quando o tempo acaba é que a mensagem final aparece.
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
  const [trialEnabled, setTrialEnabled] = useState(true);
  const [trialDays, setTrialDays] = useState("7");
  const [blueScreenText, setBlueScreenText] = useState("");
  const [blueScreenSize, setBlueScreenSize] = useState(BLUE_SCREEN_SIZE_DEFAULT);
  const [blueScreenMode, setBlueScreenMode] = useState<BlueScreenMode>("text");
  const [blueScreenBg, setBlueScreenBg] = useState(BLUE_SCREEN_BG_DEFAULT);
  const [blueScreenDuration, setBlueScreenDuration] = useState(BLUE_SCREEN_DURATION_DEFAULT);
  const live = useLiveBlueScreen(null);
  const liveMode = live.state?.mode ?? "text";
  const liveProgress = live.state ? blueScreenProgress(live.state, live.now) : null;
  const liveStatus = !live.state
    ? "Buscando o que está no ar…"
    : liveMode === "text"
      ? "No ar: só o texto, sem contagem."
      : !live.state.startedAt
        ? "No ar: contagem ainda não iniciada."
        : liveProgress?.done
          ? liveMode === "countdown"
            ? "No ar: a contagem chegou a 00:00."
            : "No ar: o carregamento chegou a 100%."
          : liveMode === "countdown"
            ? `No ar: faltam ${formatClock(liveProgress?.remainingSeconds ?? 0)}.`
            : `No ar: ${liveProgress?.percent ?? 0}% concluído.`;
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
    setTrialEnabled(data.trialEnabled !== false);
    setTrialDays(String(data.trialDays || 7));
    setBlueScreenText(data.blueScreenText || "");
    setBlueScreenSize(clampBlueScreenSize(data.blueScreenSize));
    setBlueScreenMode(normalizeBlueScreenMode(data.blueScreenMode));
    setBlueScreenBg(normalizeBlueScreenBg(data.blueScreenBg));
    setBlueScreenDuration(clampBlueScreenDuration(data.blueScreenDuration));
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

  async function saveBlueScreen(onlyRestart = false) {
    setError("");
    const body = onlyRestart
      ? { blueScreenRestart: true }
      : {
          blueScreenText,
          blueScreenSize,
          blueScreenMode,
          blueScreenDuration,
          blueScreenBg,
          blueScreenRestart: blueScreenMode !== "text",
        };
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      setError("Não foi possível salvar a tela azul.");
      return;
    }
    const mode = onlyRestart ? liveMode : blueScreenMode;
    setSaved(
      onlyRestart
        ? "Contagem reiniciada. Quem está com o link aberto vê começar do zero."
        : mode === "countdown"
          ? `Salvo. A contagem de ${formatDurationLabel(blueScreenDuration)} começou agora no link público.`
          : mode === "loading"
            ? `Salvo. O carregamento de ${formatDurationLabel(blueScreenDuration)} começou agora no link público.`
            : "Salvo. O link público mostra só o texto.",
    );
    await Promise.all([load(), live.refresh()]);
  }

  async function saveDefaults() {
    setError("");
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultRemoveDiagnosis: defaultDiagnosis,
        defaultLogReadSeconds,
        trialEnabled,
        trialDays,
      }),
    });
    if (!response.ok) {
      setError("Não foi possível salvar os padrões.");
      return;
    }
    setSaved("Padrão salvo. Vale para contas sem tempo ou mensagem próprios.");
    await load();
  }

  async function runTrialAction(userId: string, trialAction: "start" | "reset" | "end") {
    setError("");
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, trialAction }),
    });
    if (!response.ok) {
      setError("Não foi possível mudar o teste desta conta.");
      return;
    }
    const message = {
      start: "Teste iniciado agora para esta conta.",
      reset: "Teste liberado de novo. A conta pode começar um teste novo.",
      end: "Teste encerrado. A conta volta a precisar de uma assinatura.",
    }[trialAction];
    setSaved(message);
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
        <h1>O que o cliente vê no painel</h1>
        <p className="muted">
          Aqui você define o tempo da leitura no console, o texto que aparece no fim e o teste
          grátis de quem ainda não comprou. Dá para mudar o padrão de todo mundo ou conta por
          conta.
        </p>
      </section>

      {error ? <p className="error">{error}</p> : null}
      {saved ? <p className="muted">{saved}</p> : null}

      <section className="card form admin-defaults">
        <h2>Tela azul</h2>
        <p className="muted">
          Esse texto aparece em letras brancas grandes, numa página só de fundo azul. Ela não entra
          no menu do site. O que você salvar fica guardado e qualquer pessoa com o link vê.
        </p>
        <div className="field">
          <label htmlFor="blueScreenText">Texto da tela</label>
          <textarea
            id="blueScreenText"
            value={blueScreenText}
            maxLength={5000}
            rows={6}
            onChange={(event) => setBlueScreenText(event.target.value)}
            placeholder="Escreva a mensagem que vai aparecer na tela azul."
          />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Tamanho das letras</label>
          <p className="admin-help">
            Vai de {BLUE_SCREEN_SIZE_MIN} até {BLUE_SCREEN_SIZE_MAX}. O número é o tamanho numa tela
            de 1920 px de largura; em telas menores ou maiores as letras acompanham. Salve para
            valer no link público.
          </p>
          <div className="blue-size-row">
            <button
              className="btn btn-ghost"
              type="button"
              disabled={blueScreenSize <= BLUE_SCREEN_SIZE_MIN}
              onClick={() => setBlueScreenSize((current) => stepBlueScreenSize(current, -1))}
            >
              Diminuir
            </button>
            <input
              className="blue-size-range"
              type="range"
              aria-label="Tamanho das letras"
              min={BLUE_SCREEN_SIZE_MIN}
              max={BLUE_SCREEN_SIZE_MAX}
              step={1}
              value={blueScreenSize}
              onChange={(event) => setBlueScreenSize(clampBlueScreenSize(event.target.value))}
            />
            <button
              className="btn btn-ghost"
              type="button"
              disabled={blueScreenSize >= BLUE_SCREEN_SIZE_MAX}
              onClick={() => setBlueScreenSize((current) => stepBlueScreenSize(current, 1))}
            >
              Aumentar
            </button>
            <strong className="blue-size-value">{blueScreenSize}</strong>
          </div>
          <div className="time-presets">
            {BLUE_SCREEN_PRESETS.map((preset) => (
              <button
                key={preset.size}
                className={`btn btn-ghost time-chip${blueScreenSize === preset.size ? " selected" : ""}`}
                type="button"
                onClick={() => setBlueScreenSize(preset.size)}
              >
                {preset.label}
              </button>
            ))}
            <button
              className={`btn btn-ghost time-chip${blueScreenSize === BLUE_SCREEN_SIZE_DEFAULT ? " selected" : ""}`}
              type="button"
              onClick={() => setBlueScreenSize(BLUE_SCREEN_SIZE_DEFAULT)}
            >
              Padrão
            </button>
          </div>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Cor de fundo</label>
          <p className="admin-help">
            Escolha uma cor pronta ou qualquer outra no seletor. Em fundo claro as letras ficam
            pretas sozinhas, para dar para ler.
          </p>
          <div className="blue-mode-row">
            {BLUE_SCREEN_BG_PRESETS.map((preset) => (
              <button
                key={preset.color}
                className={`btn btn-ghost time-chip bg-chip${blueScreenBg === preset.color ? " selected" : ""}`}
                type="button"
                onClick={() => setBlueScreenBg(preset.color)}
              >
                <span className="bg-swatch" style={{ background: preset.color }} />
                {preset.label}
              </button>
            ))}
            <label className="btn btn-ghost time-chip bg-chip">
              <input
                type="color"
                className="bg-picker"
                aria-label="Outra cor"
                value={blueScreenBg}
                onChange={(event) => setBlueScreenBg(normalizeBlueScreenBg(event.target.value))}
              />
              Outra cor
            </label>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Cor escolhida: {blueScreenBg.toUpperCase()}
          </p>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Contagem na tela</label>
          <p className="admin-help">
            Escolha o que aparece embaixo do texto. A contagem começa do zero na hora em que você
            salva, e todo mundo com o link vê o mesmo tempo.
          </p>
          <div className="blue-mode-row">
            {BLUE_SCREEN_MODES.map((mode) => (
              <button
                key={mode.id}
                className={`btn btn-ghost time-chip${blueScreenMode === mode.id ? " selected" : ""}`}
                type="button"
                onClick={() => setBlueScreenMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        {blueScreenMode !== "text" ? (
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="blueScreenMinutes">
              {blueScreenMode === "countdown" ? "Tempo da contagem" : "Tempo até chegar a 100%"}
            </label>
            <div className="blue-size-row">
              <input
                id="blueScreenMinutes"
                type="number"
                min={0}
                max={BLUE_SCREEN_DURATION_MAX / 60}
                value={Math.floor(blueScreenDuration / 60)}
                onChange={(event) =>
                  setBlueScreenDuration(
                    clampBlueScreenDuration(
                      Math.max(0, Number(event.target.value) || 0) * 60 + (blueScreenDuration % 60),
                    ),
                  )
                }
                style={{ width: 110 }}
              />
              <span className="muted">min</span>
              <input
                aria-label="Segundos"
                type="number"
                min={0}
                max={59}
                value={blueScreenDuration % 60}
                onChange={(event) =>
                  setBlueScreenDuration(
                    clampBlueScreenDuration(
                      Math.floor(blueScreenDuration / 60) * 60 +
                        Math.min(59, Math.max(0, Number(event.target.value) || 0)),
                    ),
                  )
                }
                style={{ width: 90 }}
              />
              <span className="muted">s</span>
            </div>
            <div className="time-presets">
              {BLUE_SCREEN_DURATION_PRESETS.map((seconds) => (
                <button
                  key={seconds}
                  className={`btn btn-ghost time-chip${blueScreenDuration === seconds ? " selected" : ""}`}
                  type="button"
                  onClick={() => setBlueScreenDuration(seconds)}
                >
                  {formatDurationLabel(seconds)}
                </button>
              ))}
            </div>
            <p className="muted" style={{ margin: 0 }}>
              {blueScreenMode === "countdown"
                ? `Mostra ${formatClock(blueScreenDuration)} descendo até 00:00.`
                : `Mostra de 0% a 100% em ${formatDurationLabel(blueScreenDuration)}, com barra.`}
            </p>
          </div>
        ) : null}
        <div className="blue-monitor">
          <div className="blue-monitor-pane">
            <p className="blue-monitor-title">
              <span className="live-dot" /> Ao vivo agora, no link público
            </p>
            {live.state ? (
              <BlueScreenView state={live.state} now={live.now} preview />
            ) : (
              <div className="blue-screen-preview blue-monitor-empty">Carregando a tela…</div>
            )}
            <p className="muted" style={{ margin: 0 }}>{liveStatus}</p>
          </div>
          <div className="blue-monitor-pane">
            <p className="blue-monitor-title">Prévia do que você está editando</p>
            <BlueScreenView
              state={{
                text: blueScreenText || "Assim ficam as letras",
                size: blueScreenSize,
                mode: blueScreenMode,
                duration: blueScreenDuration,
                startedAt: 0,
                bg: blueScreenBg,
              }}
              now={0}
              preview
            />
            <p className="muted" style={{ margin: 0 }}>
              Só vai para o link quando você salvar.
            </p>
          </div>
        </div>
        <p className="muted">
          Link público:{" "}
          <a href={`${SITE_URL}/tela`} target="_blank" rel="noreferrer">
            {SITE_URL}/tela
          </a>
        </p>
        <div className="cta-row" style={{ marginTop: 0 }}>
          <button className="btn btn-blue" type="button" onClick={() => saveBlueScreen()}>
            {blueScreenMode === "text" ? "Salvar tela azul" : "Salvar e começar a contagem"}
          </button>
          {liveMode !== "text" ? (
            <button className="btn btn-ghost" type="button" onClick={() => saveBlueScreen(true)}>
              Reiniciar contagem
            </button>
          ) : null}
          <a className="btn btn-ghost" href="/tela" target="_blank" rel="noreferrer">
            Abrir a tela
          </a>
        </div>
      </section>

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
        <div className="field" style={{ margin: "6px 0 0" }}>
          <label htmlFor="trialDays">3. Teste grátis para quem ainda não comprou</label>
          <p className="admin-help">
            Quantos dias a conta nova usa o painel completo antes de comprar: desbloqueio do
            computador, internet, checagem e proteção.
          </p>
          <input
            id="trialDays"
            type="number"
            min={1}
            max={90}
            value={trialDays}
            onChange={(event) => setTrialDays(event.target.value)}
          />
          <div className="time-presets">
            {TRIAL_PRESETS.map((days) => (
              <button
                key={days}
                className={`btn btn-ghost time-chip${trialDays === String(days) ? " selected" : ""}`}
                type="button"
                onClick={() => setTrialDays(String(days))}
              >
                {days} dias
              </button>
            ))}
          </div>
        </div>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={trialEnabled}
            onChange={(event) => setTrialEnabled(event.target.checked)}
          />
          Deixar o botão de teste grátis aparecer no painel
        </label>
        <p className="muted">
          {trialEnabled
            ? `Conta nova vê o botão e ganha ${trialDays || 7} dias com tudo liberado.`
            : "O botão de teste fica escondido. Só quem comprou usa o painel completo."}
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
                  {` · ${trialLabel(user.trial, user.paid)}`}
                  {` · ${user.machineCount} computador${user.machineCount === 1 ? "" : "es"}`}
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
              <div className="cta-row" style={{ marginTop: 0 }}>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => runTrialAction(user.id, "start")}
                >
                  Iniciar teste agora
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => runTrialAction(user.id, "reset")}
                >
                  Liberar teste de novo
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => runTrialAction(user.id, "end")}
                >
                  Encerrar teste
                </button>
              </div>
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
