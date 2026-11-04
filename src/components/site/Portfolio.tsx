"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { projects } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
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
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected work with premium motion and performance."
          description="Concept projects with a consistent futuristic aesthetic. Swap in your real case studies anytime—structure is modular."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {items.map((p, idx) => (
            <Reveal key={p.title} delay={idx * 0.06}>
              <TiltCard className="h-full">
                <button
                  type="button"
                  className="panel group h-full w-full p-7 text-left transition hover:bg-white/[0.05]"
                  onClick={() => setActive(p)}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent opacity-70"
                  />
                  <div className="panel-topline opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/55 ring-1 ring-white/10">
                        {p.tag}
                      </div>
                      <h3 className="mt-4 font-[var(--font-space)] text-xl tracking-tight text-white">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/65">
                        {p.description}
                      </p>
                    </div>
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/[0.05] font-[var(--font-space)] text-sm text-cyan-300 ring-1 ring-white/10 md:h-14 md:w-14">
                      0{idx + 1}
                    </div>
                  </div>

                  <div className="relative mt-6 flex flex-wrap gap-2">
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/65 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-white/80">
                    <span>Open details</span>
                    <span className="transition group-hover:translate-x-0.5">
                      →
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
            <div className="panel p-4">
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
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                {active.description}
              </p>
            </div>

            <div className="panel p-5">
              <div className="text-sm font-medium text-white/80">
                Technologies
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/65 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-sm font-medium text-white/80">
                Next steps
              </div>
              <ul className="mt-3 grid gap-2 text-sm text-white/65">
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
