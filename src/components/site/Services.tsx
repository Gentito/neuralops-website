import { services } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./TiltCard";

export function Services() {
  return (
    <Section id="services">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Build fast. Ship clean. Scale with confidence."
          description="Modular delivery across web, mobile, AI, and design—optimized for premium UX and production performance."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map((s, idx) => (
            <Reveal key={s.title} delay={idx * 0.06}>
              <TiltCard className="h-full">
                <div className="panel group h-full p-7 transition hover:bg-white/[0.05]">
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.accent} opacity-70`}
                  />
                  <div className="panel-topline opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="font-[var(--font-space)] text-xs text-cyan-300/70">
                          0{idx + 1}
                        </div>
                        <h3 className="mt-2 font-[var(--font-space)] text-xl tracking-tight text-white">
                          {s.title}
                        </h3>
                      </div>
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-white/10">
                        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                      {s.description}
                    </p>

                    <ul className="mt-6 grid gap-2.5 text-sm text-white/70">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3">
                          <span className="h-px w-4 bg-gradient-to-r from-cyan-300/80 to-transparent" />
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
