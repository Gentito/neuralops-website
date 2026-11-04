"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Agent, Division } from "@/lib/agents";
import { cn } from "@/lib/utils";

type Props = {
  agents: Agent[];
  divisions: Division[];
};

export function AgentsExplorer({ agents, divisions }: Props) {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((a) => {
      if (division !== "all" && a.division !== division) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.vibe.toLowerCase().includes(q) ||
        a.tools.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [agents, division, query]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, skills, tools…"
            className="w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-white/90 ring-1 ring-white/10 outline-none transition placeholder:text-white/40 focus:ring-cyan-300/40 sm:max-w-sm"
          />
          <p className="text-sm text-white/50">
            {filtered.length} of {agents.length} agents
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-white/50">
          No agents match that search.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Link
              key={a.source}
              href={`/agents/${a.division}/${a.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
            >
              <span
                className="absolute inset-x-0 top-0 h-0.5 opacity-70"
                style={{ backgroundColor: a.accent }}
              />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-xl ring-1 ring-white/10">
                  {a.emoji}
                </span>
                <div>
                  <h3 className="font-[var(--font-space)] text-base tracking-tight text-white">
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
          ))}
        </div>
      )}
    </>
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
