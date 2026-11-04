import type { Metadata } from "next";
import Link from "next/link";
import { getAgents, getDivisions, getTools } from "@/lib/agents";
import { AgentsDashboard } from "@/components/agents/AgentsDashboard";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Agent Command Center",
  description:
    "Search, favorite, and bulk-install NeuralOps agents across engineering, design, marketing, sales, and more."
};

export default function AgentsPage() {
  const agents = getAgents();
  const divisions = getDivisions();
  const tools = getTools();

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(88,196,255,0.10),transparent_50%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.08),transparent_55%)]" />
      <div className="cinematic-grid pointer-events-none fixed inset-0 -z-10 opacity-60" />

      <Container className="py-12 pb-40 md:py-16 md:pb-44">
        <Link
          href="/"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← NeuralOps
        </Link>

        <div className="mt-6 flex flex-col gap-3">
          <p className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            Agent Command Center
          </p>
          <h1 className="text-gradient font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
            The Agency roster
          </h1>
          <p className="max-w-2xl text-base text-white/65">
            {agents.length} specialized agents across {divisions.length}{" "}
            divisions and {tools.length} install targets. Search the roster,
            favorite the ones you keep coming back to, then generate a single
            install command for everything you select.
          </p>
        </div>

        {agents.length === 0 ? (
          <p className="mt-12 rounded-3xl bg-white/[0.04] p-6 text-sm text-white/60 ring-1 ring-white/10">
            The agent catalog is empty. Make sure the <code>agency-agents</code>{" "}
            submodule is checked out (<code>git submodule update --init</code>).
          </p>
        ) : (
          <div className="mt-10">
            <AgentsDashboard
              agents={agents}
              divisions={divisions}
              tools={tools}
            />
          </div>
        )}
      </Container>
    </main>
  );
}
