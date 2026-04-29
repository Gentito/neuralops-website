import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";

const milestones = [
  {
    year: "Now",
    title: "Future-ready delivery",
    description:
      "NeuralOps builds modern web, mobile, and AI systems with engineering rigor and cinematic motion."
  },
  {
    year: "Principle",
    title: "Design + performance",
    description:
      "Every interface is crafted for clarity, speed, and delight—then hardened for production."
  },
  {
    year: "Focus",
    title: "AI-driven systems",
    description:
      "We architect automation and AI integration points so your product can evolve as models improve."
  }
] as const;

export function About() {
  return (
    <Section id="about">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <div>
              <p className="text-sm font-medium text-cyan-300/90">About</p>
              <h2 className="mt-3 font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
                A futuristic IT partner built for speed, craft, and scale.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                NeuralOps is an IT solutions studio focused on premium digital
                experiences. We blend product design, modern engineering, and
                AI-ready architectures to ship work that feels effortless—and
                performs like it.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Glassmorphism UI",
                  "Scroll storytelling",
                  "Micro-interactions",
                  "Production-ready"
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 ring-1 ring-white/10"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-2xl" />
            <div className="grid gap-4">
              {milestones.map((m, idx) => (
                <Reveal key={m.title} delay={idx * 0.08}>
                  <div className="group rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/[0.06]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-[var(--font-space)] text-base">
                        {m.title}
                      </div>
                      <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                        {m.year}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {m.description}
                    </p>
                    <div className="mt-4 h-px w-full bg-gradient-to-r from-cyan-400/40 via-purple-400/30 to-transparent opacity-80" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

