"use client";

import { useMemo, useState } from "react";
import type { Tool } from "@/lib/agents";

type Props = {
  tools: Tool[];
  agent: { name: string; stem: string; nameSlug: string };
};

function slugFor(tool: Tool, agent: Props["agent"]) {
  const base = tool.slugFrom === "name" ? agent.nameSlug : agent.stem;
  return `${tool.slugPrefix ?? ""}${base}`;
}

function destinations(tool: Tool, agent: Props["agent"]) {
  const slug = slugFor(tool, agent);
  const project = tool.scope.project ? tool.dest.project : [];
  const user = tool.scope.user ? tool.dest.user : [];
  const paths = project.length > 0 ? project : user;
  const scope = project.length > 0 ? "project" : "user";
  return {
    scope,
    paths: paths.map((p) => p.replace(/\{slug\}/g, slug))
  };
}

function command(tool: Tool, agent: Props["agent"]) {
  if (tool.installKind === "per-agent") {
    return `./scripts/install.sh --tool ${tool.kebab} --agent ${agent.stem}`;
  }
  return `./scripts/install.sh --tool ${tool.kebab}`;
}

export function InstallPanel({ tools, agent }: Props) {
  const [selected, setSelected] = useState(
    tools.find((t) => t.kebab === "cursor")?.kebab ?? tools[0]?.kebab ?? ""
  );
  const [copied, setCopied] = useState(false);

  const tool = useMemo(
    () => tools.find((t) => t.kebab === selected) ?? null,
    [tools, selected]
  );

  if (!tool) return null;

  const { scope, paths } = destinations(tool, agent);
  const block = `cd agency-agents
./scripts/convert.sh
${command(tool, agent)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — user can select manually */
    }
  };

  return (
    <section className="mt-10 rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-[var(--font-space)] text-lg tracking-tight text-white">
          Install this agent
        </h2>
        <label className="flex items-center gap-2 text-sm text-white/50">
          Tool
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-white/90 ring-1 ring-white/10 outline-none focus:ring-cyan-300/40"
          >
            {tools.map((t) => (
              <option key={t.kebab} value={t.kebab} className="bg-navy">
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            {scope === "project" ? "Project install path" : "User install path"}
          </p>
          {paths.length > 0 ? (
            <ul className="mt-2 space-y-1 font-mono text-xs text-white/70">
              {paths.map((p) => (
                <li key={p} style={{ color: tool.accent }}>
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-white/50">
              CLI-only — no direct file destination.
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            What gets installed
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            {tool.installKind === "per-agent"
              ? "This single agent, rendered into the tool's native format."
              : tool.installKind === "roster"
                ? "A single combined roster file containing all agents."
                : "A CLI-only plugin; it cannot be rendered per agent."}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            Commands
          </p>
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10 transition hover:text-white"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="mt-2 overflow-x-auto rounded-2xl bg-black/40 p-4 font-mono text-xs text-white/80 ring-1 ring-white/10">
          {block}
        </pre>
        <p className="mt-2 text-xs text-white/40">
          Run from the repository root. Requires the{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">agency-agents</code>{" "}
          submodule to be initialized.
        </p>
      </div>
    </section>
  );
}
