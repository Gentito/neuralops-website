"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Agent, Division, Tool } from "@/lib/agents";
import { cn } from "@/lib/utils";

type Props = {
  agents: Agent[];
  divisions: Division[];
  tools: Tool[];
};

type ViewFilter = "all" | "favorites" | "selected";
type SortKey = "name" | "division";

const FAV_KEY = "neuralops.agents.favorites";
const SEL_KEY = "neuralops.agents.selected";

/** Agents beyond this count switch to the `--agents-file` install form. */
const INLINE_AGENT_LIMIT = 25;

function readSet(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

function writeSet(key: string, value: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    /* storage unavailable or full — selection stays in memory */
  }
}

export function AgentsDashboard({ agents, divisions, tools }: Props) {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("all");
  const [view, setView] = useState<ViewFilter>("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [toolKebab, setToolKebab] = useState(
    tools.find((t) => t.kebab === "cursor")?.kebab ?? tools[0]?.kebab ?? ""
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFavorites(readSet(FAV_KEY));
    setSelected(readSet(SEL_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeSet(FAV_KEY, favorites);
  }, [favorites, hydrated]);

  useEffect(() => {
    if (hydrated) writeSet(SEL_KEY, selected);
  }, [selected, hydrated]);

  useEffect(() => {
    if (!installOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInstallOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [installOpen]);

  const toggleFavorite = useCallback((source: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }, []);

  const toggleSelected = useCallback((source: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = agents.filter((a) => {
      if (division !== "all" && a.division !== division) return false;
      if (view === "favorites" && !favorites.has(a.source)) return false;
      if (view === "selected" && !selected.has(a.source)) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.vibe.toLowerCase().includes(q) ||
        a.divisionLabel.toLowerCase().includes(q) ||
        a.tools.some((t) => t.toLowerCase().includes(q))
      );
    });

    return [...list].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : a.divisionLabel.localeCompare(b.divisionLabel) ||
          a.name.localeCompare(b.name)
    );
  }, [agents, division, favorites, query, selected, sort, view]);

  const visibleSources = useMemo(
    () => filtered.map((a) => a.source),
    [filtered]
  );

  const allVisibleSelected =
    visibleSources.length > 0 &&
    visibleSources.every((s) => selected.has(s));

  const selectedAgents = useMemo(
    () => agents.filter((a) => selected.has(a.source)),
    [agents, selected]
  );

  const tool = useMemo(
    () => tools.find((t) => t.kebab === toolKebab) ?? null,
    [tools, toolKebab]
  );

  const toggleAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleSources.forEach((s) => next.delete(s));
      else visibleSources.forEach((s) => next.add(s));
      return next;
    });
  };

  const clearSelection = () => {
    setSelected(new Set());
    setInstallOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Agents" value={agents.length} />
        <Stat label="Divisions" value={divisions.length} />
        <Stat label="Install targets" value={tools.length} />
        <Stat label="Favorites" value={favorites.size} accent />
      </div>

      <div className="panel mt-6 p-4 md:p-5">
        <div className="panel-topline" />

        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents, skills, tools…"
              className="w-full rounded-2xl bg-ink/40 px-4 py-2.5 text-sm text-white/90 ring-1 ring-white/12 outline-none transition placeholder:text-white/40 focus:ring-cyan-300/50 sm:max-w-sm"
            />

            <div className="flex gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10">
              {(
                [
                  ["all", `All ${agents.length}`],
                  ["favorites", `Favorites ${favorites.size}`],
                  ["selected", `Selected ${selected.size}`]
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs transition",
                    view === key
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-white/45">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs text-white/90 ring-1 ring-white/10 outline-none focus:ring-cyan-300/40"
              >
                <option value="name" className="bg-navy">
                  Name A–Z
                </option>
                <option value="division" className="bg-navy">
                  Division
                </option>
              </select>
            </label>

            <button
              type="button"
              onClick={toggleAllVisible}
              disabled={visibleSources.length === 0}
              className="rounded-full bg-white/[0.05] px-3.5 py-2 text-xs text-white/70 ring-1 ring-white/10 transition hover:text-white disabled:opacity-40"
            >
              {allVisibleSelected ? "Deselect shown" : "Select shown"}
            </button>
          </div>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-2">
          <Chip
            label="All"
            count={agents.length}
            color="#58C4FF"
            active={division === "all"}
            onClick={() => setDivision("all")}
          />
          {divisions.map((d) => (
            <Chip
              key={d.key}
              label={d.label}
              count={d.count}
              color={d.color}
              active={division === d.key}
              onClick={() => setDivision(d.key)}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/40">
        {filtered.length} of {agents.length} agents
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-3xl bg-white/[0.03] p-8 text-center text-sm text-white/50 ring-1 ring-white/10">
          {view === "favorites"
            ? "No favorites yet — star an agent to pin it here."
            : view === "selected"
              ? "Nothing selected yet — tick an agent to build an install."
              : "No agents match that search."}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => {
            const isFav = favorites.has(a.source);
            const isSelected = selected.has(a.source);
            return (
              <div
                key={a.source}
                className={cn(
                  "group panel relative transition",
                  isSelected
                    ? "bg-white/[0.06] ring-cyan-300/40"
                    : "hover:bg-white/[0.05]"
                )}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 opacity-70"
                  style={{ backgroundColor: a.accent }}
                />

                <Link
                  href={`/agents/${a.division}/${a.slug}`}
                  className="block p-5"
                >
                  <div className="flex items-center gap-3 pr-20">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-xl ring-1 ring-white/10">
                      {a.emoji}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-[var(--font-space)] text-base tracking-tight text-white">
                        {a.name}
                      </h3>
                      <span
                        className="text-xs font-medium"
                        style={{ color: a.accent }}
                      >
                        {a.divisionLabel}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/65">
                    {a.description || a.vibe}
                  </p>
                  <span className="mt-4 inline-block text-xs text-white/40 transition group-hover:text-cyan-300">
                    View personality →
                  </span>
                </Link>

                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={
                      isFav ? `Unfavorite ${a.name}` : `Favorite ${a.name}`
                    }
                    aria-pressed={isFav}
                    onClick={() => toggleFavorite(a.source)}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-xl ring-1 transition",
                      isFav
                        ? "bg-amber-300/15 text-amber-300 ring-amber-300/30"
                        : "bg-white/[0.06] text-white/45 ring-white/10 hover:text-white"
                    )}
                  >
                    <StarIcon filled={isFav} />
                  </button>
                  <button
                    type="button"
                    aria-label={
                      isSelected
                        ? `Remove ${a.name} from selection`
                        : `Add ${a.name} to selection`
                    }
                    aria-pressed={isSelected}
                    onClick={() => toggleSelected(a.source)}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-xl ring-1 transition",
                      isSelected
                        ? "bg-cyan-300/20 text-cyan-200 ring-cyan-300/40"
                        : "bg-white/[0.06] text-white/45 ring-white/10 hover:text-white"
                    )}
                  >
                    <CheckIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected.size > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 px-5 pb-5 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-3xl bg-navy/90 p-4 shadow-panel ring-1 ring-white/12 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-white/80">
              <span className="font-[var(--font-space)] text-white">
                {selected.size}
              </span>{" "}
              {selected.size === 1 ? "agent" : "agents"} selected
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-full bg-white/[0.06] px-4 py-2 text-sm text-white/70 ring-1 ring-white/10 transition hover:text-white"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setInstallOpen((v) => !v)}
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-ink shadow-[0_10px_40px_-12px_rgba(88,196,255,0.7)] transition hover:bg-white/95"
              >
                {installOpen ? "Hide install" : "Generate install"}
              </button>
            </div>
          </div>

          {installOpen ? (
            <div className="mx-auto mt-3 max-h-[60vh] max-w-6xl overflow-y-auto rounded-3xl bg-navy/95 p-5 shadow-panel ring-1 ring-white/12 backdrop-blur-2xl md:p-6">
              <InstallConsole
                tools={tools}
                tool={tool}
                toolKebab={toolKebab}
                onToolChange={setToolKebab}
                agents={selectedAgents}
                copied={copied}
                onCopy={async (block) => {
                  try {
                    await navigator.clipboard.writeText(block);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  } catch {
                    /* clipboard unavailable — user can select manually */
                  }
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function InstallConsole({
  tools,
  tool,
  toolKebab,
  onToolChange,
  agents,
  copied,
  onCopy
}: {
  tools: Tool[];
  tool: Tool | null;
  toolKebab: string;
  onToolChange: (kebab: string) => void;
  agents: Agent[];
  copied: boolean;
  onCopy: (block: string) => void;
}) {
  if (!tool) return null;

  const perAgent = tool.installKind === "per-agent";
  const stems = agents.map((a) => a.stem);
  const useFileForm = perAgent && stems.length > INLINE_AGENT_LIMIT;

  const lines = [`cd agency-agents`, `./scripts/convert.sh --tool ${tool.kebab}`];

  if (!perAgent) {
    lines.push(`./scripts/install.sh --tool ${tool.kebab}`);
  } else if (useFileForm) {
    lines.push(
      "cat > selected-agents.txt <<'EOF'",
      ...stems,
      "EOF",
      `./scripts/install.sh --tool ${tool.kebab} --agents-file selected-agents.txt`
    );
  } else {
    lines.push(
      `./scripts/install.sh --tool ${tool.kebab} --agent ${stems.join(",")}`
    );
  }

  const block = lines.join("\n");

  const projectDest = tool.scope.project ? tool.dest.project : [];
  const userDest = tool.scope.user ? tool.dest.user : [];
  const dest = projectDest.length > 0 ? projectDest : userDest;
  const scope = projectDest.length > 0 ? "project" : "user";

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-[var(--font-space)] text-lg tracking-tight text-white">
          Install {agents.length} {agents.length === 1 ? "agent" : "agents"}
        </h2>
        <label className="flex items-center gap-2 text-sm text-white/50">
          Tool
          <select
            value={toolKebab}
            onChange={(e) => onToolChange(e.target.value)}
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
          {dest.length > 0 ? (
            <ul className="mt-2 space-y-1 font-mono text-xs text-white/70">
              {dest.map((p) => (
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
          <p className="mt-2 text-xs text-white/40">
            {perAgent
              ? "One file per selected agent; {slug} resolves per agent."
              : "A single combined roster file — the agent selection does not apply."}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            Selected
          </p>
          <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-white/60">
            {agents.map((a) => a.name).join(" · ")}
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
            onClick={() => onCopy(block)}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10 transition hover:text-white"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="mt-2 max-h-64 overflow-auto rounded-2xl bg-black/40 p-4 font-mono text-xs text-white/80 ring-1 ring-white/10">
          {block}
        </pre>
        {useFileForm ? (
          <p className="mt-2 text-xs text-white/40">
            More than {INLINE_AGENT_LIMIT} agents — written to a file instead of
            a single flag list.
          </p>
        ) : null}
        <p className="mt-2 text-xs text-white/40">
          Run from the repository root. Requires the{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">agency-agents</code>{" "}
          submodule to be initialized.
        </p>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="panel px-5 py-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div
        className={cn(
          "mt-1.5 font-[var(--font-space)] text-2xl",
          accent ? "text-amber-300" : "text-white"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function Chip({
  label,
  count,
  color,
  active,
  onClick
}: {
  label: string;
  count: number;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm ring-1 transition",
        active
          ? "bg-white/10 text-white ring-white/25"
          : "bg-white/[0.03] text-white/60 ring-white/10 hover:text-white"
      )}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
      <span className="text-xs text-white/40">{count}</span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3Z" />
    </svg>
  );
}
