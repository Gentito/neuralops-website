"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  const items = useMemo(() => [...testimonials], []);
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIdx((v) => (v + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [items.length, reduce]);

  const active = items[idx];

  return (
    <Section id="testimonials">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <SectionHeading
              eyebrow="Testimonials"
              title="Trusted delivery with a premium feel."
              description="Smooth transitions, clean engineering, and a consistent futuristic aesthetic across every breakpoint."
            />

            <div className="mt-7 flex flex-wrap gap-2">
              {items.map((t, i) => (
                <button
                  key={t.quote}
                  type="button"
                  className={[
                    "rounded-full px-4 py-2 text-sm ring-1 transition",
                    i === idx
                      ? "bg-white/10 text-white ring-white/20"
                      : "bg-white/[0.04] text-white/65 ring-white/10 hover:bg-white/[0.08] hover:text-white"
                  ].join(" ")}
                  onClick={() => setIdx(i)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl"
            />
            <div className="panel p-7 md:p-9">
              <div className="panel-topline" />
              <span
                aria-hidden
                className="pointer-events-none absolute right-6 top-1 font-[var(--font-space)] text-[6rem] leading-none text-white/[0.05]"
              >
                ”
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.quote}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="relative text-base leading-relaxed text-white/80 md:text-lg">
                    “{active.quote}”
                  </div>
                  <div className="relative mt-7 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {active.name}
                      </div>
                      <div className="mt-1 text-sm text-white/55">
                        {active.company}
                      </div>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-white/10">
                      <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
