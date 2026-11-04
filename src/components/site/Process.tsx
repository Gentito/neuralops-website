"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Process() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;

    const ctx = gsap.context(() => {
      gsap.set(fill, { height: "0%" });

      gsap.to(fill, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 70%",
          end: "bottom 35%",
          scrub: 0.6
        }
      });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="process">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="A smooth, transparent workflow from idea to launch."
          description="A motion-forward delivery pipeline built for speed, clarity, and dependable releases."
        />

        <div
          ref={trackRef}
          className="mt-12 grid gap-10 md:grid-cols-[120px_1fr]"
        >
          <div className="relative hidden md:block">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
            <div
              ref={fillRef}
              className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300 via-cyan-400/60 to-transparent"
            />
          </div>

          <div className="grid gap-4">
            {processSteps.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 0.06}>
                <div className="panel group flex items-start gap-5 p-6 transition hover:bg-white/[0.05]">
                  <div className="panel-topline opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.05] font-[var(--font-space)] text-sm text-cyan-300 ring-1 ring-white/10">
                    0{idx + 1}
                  </div>
                  <div className="relative">
                    <h3 className="font-[var(--font-space)] text-lg tracking-tight text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {s.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
