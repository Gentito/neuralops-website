"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { projects } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "./Section";
import { TiltCard } from "./TiltCard";
import { ProjectModal } from "./ProjectModal";

type Project = (typeof projects)[number];

const visualMap: Record<string, { webp: string; fallback: string }> = {
  "Aurora Commerce": { webp: "/visuals/aurora.webp", fallback: "/visuals/aurora.svg" },
  "PulseOps Mobile": { webp: "/visuals/pulse.webp", fallback: "/visuals/pulse.svg" },
  "NeuralFlow Automations": {
    webp: "/visuals/neuralflow.webp",
    fallback: "/visuals/neuralflow.svg"
  },
  "Helix Design System": { webp: "/visuals/helix.webp", fallback: "/visuals/helix.svg" }
};

export function Portfolio() {
  const items = useMemo(() => [...projects], []);
  const [active, setActive] = useState<Project | null>(null);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const preferWebp = process.env.NEXT_PUBLIC_PREFER_WEBP_VISUALS === "1";

  useEffect(() => {
    if (!preferWebp) return;
    if (!active) {
      setResolvedSrc(null);
      return;
    }

    const entry = visualMap[active.title] ?? {
      webp: "/visuals/aurora.webp",
      fallback: "/visuals/aurora.svg"
    };

    const img = new window.Image();
    img.onload = () => setResolvedSrc(entry.webp);
    img.onerror = () => setResolvedSrc(entry.fallback);
    img.src = entry.webp;
  }, [active, preferWebp]);

  return (
    <Section id="work">
      <Container>
        <Reveal>
          <div>
            <p className="text-sm font-medium text-cyan-300/90">Portfolio</p>
            <h2 className="mt-3 font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
              Selected work with premium motion and performance.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-white/70">
              Concept projects with a consistent futuristic aesthetic. Swap in
              your real case studies anytime—structure is modular.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((p, idx) => (
            <Reveal key={p.title} delay={idx * 0.06}>
              <TiltCard>
                <button
                  type="button"
                  className="group relative w-full overflow-hidden rounded-3xl bg-white/[0.04] p-6 text-left ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/[0.06]"
                  onClick={() => setActive(p)}
                >
                  <div className="absolute inset-0 opacity-100">
                    <div className="absolute -inset-10 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-2xl" />
                  </div>

                  <div className="relative flex items-start justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                        {p.tag}
                      </div>
                      <h3 className="mt-3 font-[var(--font-space)] text-xl tracking-tight">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        {p.description}
                      </p>
                    </div>
                    <div className="hidden h-12 w-12 shrink-0 rounded-2xl bg-white/5 ring-1 ring-white/10 md:block" />
                  </div>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-6 text-sm text-white/80">
                    <span className="inline-flex items-center gap-2">
                      Open details
                      <span className="transition group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                </button>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>

      <ProjectModal
        open={!!active}
        title={active?.title ?? ""}
        onClose={() => setActive(null)}
      >
        {active ? (
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent ring-1 ring-white/10">
                <Image
                  src={
                    preferWebp
                      ? resolvedSrc ??
                        (visualMap[active.title]?.fallback ?? "/visuals/aurora.svg")
                      : visualMap[active.title]?.fallback ?? "/visuals/aurora.svg"
                  }
                  alt={`${active.title} mockup`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 640px"
                  priority={false}
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {active.description}
              </p>
            </div>

            <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10">
              <div className="text-sm font-medium text-white/80">
                Technologies
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-sm font-medium text-white/80">
                Next steps
              </div>
              <ul className="mt-3 grid gap-2 text-sm text-white/70">
                {[
                  "Replace visuals with real case study images or videos.",
                  "Add project links and deeper technical breakdowns.",
                  "Hook CTA to a scheduling or lead-gen workflow."
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/90" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button
                  className="w-full"
                  onClick={() => {
                    setActive(null);
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start"
                    });
                  }}
                >
                  Build something like this
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </ProjectModal>
    </Section>
  );
}
