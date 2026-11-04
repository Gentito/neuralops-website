"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  agent: { name: string; slug: string; division: string; accent: string };
};

type HermesEvent = {
  type?: string;
  text?: string;
  name?: string;
  input?: unknown;
  output?: string;
  is_error?: boolean;
  duration_ms?: number;
  exit_code?: number;
  error?: string;
  model?: string;
  tokens?: { total?: number };
};

type Step = {
  id: number;
  kind: "tool" | "tool_result";
  name: string;
  detail: string;
  ok: boolean;
};

type Status = "idle" | "running" | "done" | "error";

export function AgentRunPanel({ agent }: Props) {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [reply, setReply] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [meta, setMeta] = useState<{
    model?: string;
    tokens?: number;
    durationMs?: number;
  }>({});
  const [error, setError] = useState("");

  const controllerRef = useRef<AbortController | null>(null);
  const stepId = useRef(0);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus((prev) => (prev === "running" ? "idle" : prev));
  }, []);

  const run = useCallback(async () => {
    const trimmed = task.trim();
    if (!trimmed || status === "running") return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("running");
    setReply("");
    setSteps([]);
    setMeta({});
    setError("");
    stepId.current = 0;

    try {
      const res = await fetch("/api/hermes/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: agent.name,
          agentSlug: agent.slug,
          division: agent.division,
          task: trimmed
        }),
        signal: controller.signal
      });

      if (!res.ok || !res.body) {
        const message = await res
          .json()
          .then((data: { error?: string }) => data.error)
          .catch(() => null);
        throw new Error(message ?? `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sawResult = false;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: HermesEvent;
          try {
            event = JSON.parse(line) as HermesEvent;
          } catch {
            continue;
          }
          handleEvent(event);
        }
      }

      function handleEvent(event: HermesEvent) {
        switch (event.type) {
          case "system":
            if (event.model) setMeta((m) => ({ ...m, model: event.model }));
            break;
          case "text":
            setReply((prev) => prev + (event.text ?? ""));
            break;
          case "tool_use":
            if (event.name) {
              setSteps((prev) => [
                ...prev,
                {
                  id: stepId.current++,
                  kind: "tool",
                  name: event.name as string,
                  detail: event.input ? JSON.stringify(event.input) : "",
                  ok: true
                }
              ]);
            }
            break;
          case "tool_result":
            if (event.name) {
              setSteps((prev) => [
                ...prev,
                {
                  id: stepId.current++,
                  kind: "tool_result",
                  name: event.name as string,
                  detail: (event.output ?? "").slice(0, 600),
                  ok: !event.is_error
                }
              ]);
            }
            break;
          case "result": {
            sawResult = true;
            setMeta((m) => ({
              ...m,
              tokens: event.tokens?.total,
              durationMs: event.duration_ms
            }));
            if (event.text) setReply(event.text);
            if (event.error || (event.exit_code ?? 0) !== 0) {
              setError(event.error ?? `Run exited with code ${event.exit_code}.`);
              setStatus("error");
            } else {
              setStatus("done");
            }
            break;
          }
          default:
            break;
        }
      }

      if (!sawResult) setStatus((prev) => (prev === "running" ? "done" : prev));
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setStatus("idle");
      } else {
        setError((err as Error).message);
        setStatus("error");
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, [agent.name, agent.slug, agent.division, status, task]);

  const running = status === "running";

  return (
    <section className="panel mt-10 p-6 md:p-8">
      <div className="panel-topline" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: agent.accent }}
            />
            Run via Hermes
          </p>
          <h2 className="mt-2 font-[var(--font-space)] text-lg tracking-tight text-white">
            Put {agent.name} to work
          </h2>
        </div>
        <span
          className={cn(
            "self-start rounded-full px-3 py-1 text-xs ring-1",
            running
              ? "bg-cyan-300/15 text-cyan-200 ring-cyan-300/30"
              : status === "done"
                ? "bg-emerald-300/15 text-emerald-200 ring-emerald-300/30"
                : status === "error"
                  ? "bg-rose-400/15 text-rose-200 ring-rose-400/30"
                  : "bg-white/[0.05] text-white/50 ring-white/10"
          )}
        >
          {running
            ? "Running"
            : status === "done"
              ? "Complete"
              : status === "error"
                ? "Failed"
                : "Idle"}
        </span>
      </div>

      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        disabled={running}
        rows={3}
        placeholder={`Describe the task for ${agent.name}…`}
        className="mt-5 w-full resize-y rounded-2xl bg-ink/40 px-4 py-3 text-sm text-white/90 ring-1 ring-white/12 outline-none transition placeholder:text-white/40 focus:ring-cyan-300/50 disabled:opacity-60"
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={running || task.trim().length === 0}
          className="rounded-full bg-white px-5 py-2 text-sm font-medium text-ink shadow-[0_10px_40px_-12px_rgba(88,196,255,0.7)] transition hover:bg-white/95 disabled:opacity-40"
        >
          {running ? "Running…" : "Run agent"}
        </button>
        {running ? (
          <button
            type="button"
            onClick={stop}
            className="rounded-full bg-white/[0.06] px-4 py-2 text-sm text-white/70 ring-1 ring-white/10 transition hover:text-white"
          >
            Stop
          </button>
        ) : null}
        <span className="text-xs text-white/35">
          Needs a model provider configured in Hermes.
        </span>
      </div>

      {steps.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            Tool activity
          </p>
          <ul className="mt-2 space-y-1.5">
            {steps.map((step) => (
              <li
                key={step.id}
                className="flex items-start gap-2 text-xs leading-relaxed"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    step.kind === "tool"
                      ? "bg-cyan-300"
                      : step.ok
                        ? "bg-emerald-300"
                        : "bg-rose-400"
                  )}
                />
                <span className="font-mono text-white/70">{step.name}</span>
                {step.detail ? (
                  <span className="line-clamp-2 text-white/40">
                    {step.detail}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {reply ? (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            Reply
          </p>
          <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-black/40 p-4 text-sm leading-relaxed text-white/85 ring-1 ring-white/10">
            {reply}
          </pre>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-400/25">
          {error}
        </p>
      ) : null}

      {meta.model || meta.tokens || meta.durationMs ? (
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-white/40">
          {meta.model ? <span>{meta.model}</span> : null}
          {meta.tokens ? <span>{meta.tokens} tokens</span> : null}
          {meta.durationMs ? <span>{(meta.durationMs / 1000).toFixed(1)}s</span> : null}
        </p>
      ) : null}
    </section>
  );
}
