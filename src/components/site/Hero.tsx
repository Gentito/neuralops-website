"use client";

import dynamic from "next/dynamic";
import { company } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const AiHeroBackground = dynamic(
  () =>
    import("@/components/three/AiHeroBackground").then(
      (m) => m.AiHeroBackground
    ),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-ink" />
  }
);

const stats = [
  { label: "Performance-first", value: "90+ Lighthouse" },
  { label: "Motion system", value: "Framer + GSAP" },
  { label: "Immersive", value: "WebGL / R3F" }
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      <AiHeroBackground className="opacity-90" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_circle_at_20%_20%,rgba(88,196,255,0.10),transparent_55%)]"
      />
      <div
        aria-hidden
        className="noise pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />

      <Container className="relative py-28">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </span>
            Futuristic IT solutions
          </div>

          <h1 className="text-gradient mt-7 font-[var(--font-space)] text-[2.6rem] leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {company.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/65 md:text-xl">
            {company.subheadline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => scrollTo("contact")}>
              Start a Project
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => scrollTo("work")}
            >
              View Our Work
            </Button>
          </div>

          <div className="mt-14 grid max-w-3xl divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                  {s.label}
                </div>
                <div className="mt-2 font-[var(--font-space)] text-lg text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
