"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "./Section";

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
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-medium text-cyan-300/90">Testimonials</p>
            <h2 className="mt-3 font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
              Trusted delivery with a premium feel.
            </h2>
            <p className="mt-3 max-w-md text-base text-white/70">
              Smooth transitions, clean engineering, and a consistent futuristic
              aesthetic across every breakpoint.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {items.map((t, i) => (
                <button
                  key={t.quote}
                  type="button"
                  className={[
                    "rounded-full px-4 py-2 text-sm ring-1 transition",
                    i === idx
                      ? "bg-white/10 text-white ring-white/20"
                      : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/8"
                  ].join(" ")}
                  onClick={() => setIdx(i)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-2xl" />
            <div className="rounded-[2.5rem] bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-xl md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.quote}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="text-base leading-relaxed text-white/80 md:text-lg">
                    “{active.quote}”
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {active.name}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {active.company}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-white/5 ring-1 ring-white/10" />
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

