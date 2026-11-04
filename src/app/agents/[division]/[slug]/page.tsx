import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAgent, getAgentParams, getTools } from "@/lib/agents";
import { InstallPanel } from "@/components/agents/InstallPanel";
import { Container } from "@/components/ui/Container";

type Params = { division: string; slug: string };

export function generateStaticParams(): Params[] {
  return getAgentParams();
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const data = getAgent(params.division, params.slug);
  if (!data) return { title: "Agent not found" };
  return {
    title: data.agent.name,
    description: data.agent.description || data.agent.vibe
  };
}

const PROSE = [
  "text-sm leading-relaxed text-white/75",
  "[&_h1]:mt-10 [&_h1]:font-[var(--font-space)] [&_h1]:text-2xl [&_h1]:tracking-tight [&_h1]:text-white",
  "[&_h2]:mt-9 [&_h2]:font-[var(--font-space)] [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:text-white",
  "[&_h3]:mt-7 [&_h3]:font-[var(--font-space)] [&_h3]:text-base [&_h3]:text-white",
  "[&_h4]:mt-6 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-white",
  "[&_p]:mt-3 [&_li]:mt-1",
  "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_a]:text-cyan-300 [&_a]:underline",
  "[&_strong]:font-semibold [&_strong]:text-white",
  "[&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]",
  "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-black/40 [&_pre]:p-4 [&_pre]:ring-1 [&_pre]:ring-white/10",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-300/40 [&_blockquote]:pl-4 [&_blockquote]:text-white/60",
  "[&_table]:mt-4 [&_table]:w-full [&_table]:text-left",
  "[&_th]:border-b [&_th]:border-white/15 [&_th]:py-2 [&_th]:pr-4 [&_th]:font-medium [&_th]:text-white/80",
  "[&_td]:border-b [&_td]:border-white/10 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top",
  "[&_hr]:my-8 [&_hr]:border-white/10"
].join(" ");

export default function AgentPage({ params }: { params: Params }) {
  const data = getAgent(params.division, params.slug);
  if (!data) notFound();

  const { agent, body } = data;
  const tools = getTools();

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(34,211,238,0.12),transparent_50%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_38%)]" />

      <Container className="py-12 md:py-16">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-white/50">
          <Link href="/agents" className="transition hover:text-white">
            Agent Catalog
          </Link>
          <span className="text-white/25">/</span>
          <span style={{ color: agent.accent }}>{agent.divisionLabel}</span>
        </nav>

        <header className="mt-8 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/5 text-3xl ring-1 ring-white/10">
              {agent.emoji}
            </span>
            <div>
              <h1 className="font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
                {agent.name}
              </h1>
              <span
                className="text-sm font-medium"
                style={{ color: agent.accent }}
              >
                {agent.divisionLabel}
              </span>
            </div>
          </div>

          {agent.description ? (
            <p className="max-w-3xl text-base text-white/70">
              {agent.description}
            </p>
          ) : null}

          {agent.vibe ? (
            <p
              className="max-w-3xl border-l-2 pl-4 text-sm italic text-white/60"
              style={{ borderColor: agent.accent }}
            >
              {agent.vibe}
            </p>
          ) : null}

          {agent.tools.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-white/40">
                Tools
              </span>
              {agent.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <article
          className={`mt-10 rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 md:p-8 ${PROSE}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </article>

        <InstallPanel
          tools={tools}
          agent={{
            name: agent.name,
            stem: agent.stem,
            nameSlug: agent.nameSlug
          }}
        />

        <p className="mt-6 font-mono text-xs text-white/35">
          agency-agents/{agent.source}
        </p>
      </Container>
    </main>
  );
}
