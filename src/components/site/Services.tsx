import { services } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "./Section";
import { TiltCard } from "./TiltCard";

export function Services() {
  return (
    <Section id="services">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-cyan-300/90">Services</p>
              <h2 className="mt-3 font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
                Build fast. Ship clean. Scale with confidence.
              </h2>
              <p className="mt-3 max-w-2xl text-base text-white/70">
                Modular delivery across web, mobile, AI, and design—optimized for
                premium UX and production performance.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {services.map((s, idx) => (
            <Reveal key={s.title} delay={idx * 0.06}>
              <TiltCard className="h-full">
                <div
                  className={[
                    "relative h-full overflow-hidden rounded-3xl p-6 ring-1 ring-white/10 backdrop-blur-xl transition",
                    "bg-white/[0.04] hover:bg-white/[0.06]",
                    "before:pointer-events-none before:absolute before:inset-0 before:opacity-100",
                    `before:bg-gradient-to-br ${s.accent}`
                  ].join(" ")}
                >
                  <div className="relative">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="font-[var(--font-space)] text-xl tracking-tight">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/70">
                          {s.description}
                        </p>
                      </div>
                      <div className="hidden h-11 w-11 shrink-0 rounded-2xl bg-white/5 ring-1 ring-white/10 md:block" />
                    </div>

                    <ul className="mt-5 grid gap-2 text-sm text-white/70">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/90" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

