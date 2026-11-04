import type { Metadata } from "next";
import Link from "next/link";
import { getAgents, getDivisions } from "@/lib/agents";
import { AgentsExplorer } from "@/components/agents/AgentsExplorer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Agent Catalog",
  description:
    "Browse the NeuralOps agent catalog — specialized AI specialists across engineering, design, marketing, sales, and more."
};

export default function AgentsPage() {
  const agents = getAgents();
  const divisions = getDivisions();

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(34,211,238,0.12),transparent_50%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_38%)]" />

      <Container className="py-12 md:py-16">
        <Link
          href="/"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← NeuralOps
        </Link>

        <div className="mt-6 flex flex-col gap-3">
          <p className="text-sm font-medium text-cyan-300/90">Agent Catalog</p>
          <h1 className="font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
            The Agency roster
          </h1>
          <p className="max-w-2xl text-base text-white/70">
            {agents.length} specialized agents across {divisions.length}{" "}
            divisions. Browse the roster, then install the ones you need into
            your dev tools.
          </p>
        </div>

        {agents.length === 0 ? (
          <p className="mt-12 rounded-2xl bg-white/[0.04] p-6 text-sm text-white/60 ring-1 ring-white/10">
            The agent catalog is empty. Make sure the <code>agency-agents</code>{" "}
            submodule is checked out (<code>git submodule update --init</code>).
          </p>
        ) : (
          <div className="mt-10">
            <AgentsExplorer agents={agents} divisions={divisions} />
          </div>
        )}
      </Container>
    </main>
  );
}
