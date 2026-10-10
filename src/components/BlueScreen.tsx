"use client";

import { useEffect, useRef, useState } from "react";
import {
  blueScreenFontSize,
  blueScreenPreviewFontSize,
  blueScreenProgress,
  clampBlueScreenDuration,
  clampBlueScreenSize,
  blueScreenTextColor,
  formatClock,
  normalizeBlueScreenBg,
  normalizeBlueScreenMode,
  type BlueScreenMode,
  type BlueScreenState,
} from "@/lib/blueScreen";

function readState(data: Record<string, unknown>): BlueScreenState {
  const startedAt = Number(data.startedAt);
  return {
    text: String(data.text ?? ""),
    size: clampBlueScreenSize(data.size),
    mode: normalizeBlueScreenMode(data.mode),
    duration: clampBlueScreenDuration(data.duration),
    startedAt: Number.isFinite(startedAt) ? startedAt : 0,
    bg: normalizeBlueScreenBg(data.bg),
  };
}

export function BlueScreenCounter({
  mode,
  duration,
  startedAt,
  now,
}: {
  mode: BlueScreenMode;
  duration: number;
  startedAt: number;
  now: number;
}) {
  if (mode === "text") return null;
  const { remainingSeconds, percent } = blueScreenProgress({ duration, startedAt }, now);

  if (mode === "countdown") {
    return <p className="blue-counter-clock">{formatClock(remainingSeconds)}</p>;
  }

  return (
    <div className="blue-counter-loading">
      <p className="blue-counter-percent">{percent}% concluído</p>
      <div
        className="blue-counter-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function useLiveBlueScreen(initial: BlueScreenState | null, serverNow = 0) {
  const [state, setState] = useState(initial);
  const [now, setNow] = useState(serverNow);
  const offset = useRef(0);
  const pullRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    if (serverNow) offset.current = serverNow - Date.now();
  }, [serverNow]);

  useEffect(() => {
    let stop = false;

    async function pull() {
      if (document.visibilityState === "hidden") return;
      try {
        const response = await fetch("/api/tela", { cache: "no-store" });
        if (!response.ok || stop) return;
        const data = await response.json();
        if (stop) return;
        const remoteNow = Number(data.serverNow);
        if (Number.isFinite(remoteNow)) offset.current = remoteNow - Date.now();
        setState(readState(data));
      } catch {
        /* mantém o que já está na tela */
      }
    }

    pullRef.current = pull;
    if (!initial) pull();
    const id = window.setInterval(pull, 4000);
    document.addEventListener("visibilitychange", pull);
    return () => {
      stop = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", pull);
    };
  }, []);

  const mode = state?.mode ?? "text";
  useEffect(() => {
    if (mode === "text") return;
    const tick = () => setNow(Date.now() + offset.current);
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [mode, state?.startedAt, state?.duration]);

  return { state, now, refresh: () => pullRef.current() };
}

export function BlueScreenView({
  state,
  now,
  preview = false,
}: {
  state: BlueScreenState;
  now: number;
  preview?: boolean;
}) {
  return (
    <div
      className={preview ? "blue-screen-preview" : "blue-screen"}
      aria-hidden={preview || undefined}
      style={{ background: state.bg, color: blueScreenTextColor(state.bg) }}
    >
      <div
        className="blue-screen-content"
        style={{
          fontSize: preview ? blueScreenPreviewFontSize(state.size) : blueScreenFontSize(state.size),
        }}
      >
        {state.text ? <p className="blue-screen-text">{state.text}</p> : null}
        <BlueScreenCounter
          mode={state.mode}
          duration={state.duration}
          startedAt={state.startedAt}
          now={now}
        />
      </div>
    </div>
  );
}

export function BlueScreen({ initial, serverNow }: { initial: BlueScreenState; serverNow: number }) {
  const { state, now } = useLiveBlueScreen(initial, serverNow);
  return <BlueScreenView state={state ?? initial} now={now} />;
}
