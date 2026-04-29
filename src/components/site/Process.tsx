"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";

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
        <Reveal>
          <div>
            <p className="text-sm font-medium text-cyan-300/90">Process</p>
            <h2 className="mt-3 font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
              A smooth, transparent workflow from idea to launch.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-white/70">
              A motion-forward delivery pipeline built for speed, clarity, and
              dependable releases.
            </p>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="mt-10 grid gap-10 md:grid-cols-[140px_1fr]"
        >
          <div className="relative hidden md:block">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
            <div
              ref={fillRef}
              className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-400/80 via-purple-400/70 to-transparent"
            />
          </div>

          <div className="grid gap-4">
            {processSteps.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 0.06}>
                <div className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-[var(--font-space)] text-lg tracking-tight">
                      {s.title}
                    </div>
                    <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                      Step {idx + 1}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {s.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
