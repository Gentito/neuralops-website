import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

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

const chips = [
  "Glassmorphism UI",
  "Scroll storytelling",
  "Micro-interactions",
  "Production-ready"
];

export function About() {
  return (
    <Section id="about">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading
              eyebrow="About"
              title="A futuristic IT partner built for speed, craft, and scale."
              description="NeuralOps is an IT solutions studio focused on premium digital experiences. We blend product design, modern engineering, and AI-ready architectures to ship work that feels effortless—and performs like it."
            />
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/70 ring-1 ring-white/10"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl"
            />
            <div className="grid gap-4">
              {milestones.map((m, idx) => (
                <Reveal key={m.title} delay={idx * 0.08}>
                  <div className="panel group p-6 transition hover:bg-white/[0.05]">
                    <div className="panel-topline opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-[var(--font-space)] text-xs text-cyan-300/80">
                          0{idx + 1}
                        </span>
                        <span className="font-[var(--font-space)] text-base text-white">
                          {m.title}
                        </span>
                      </div>
                      <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/55 ring-1 ring-white/10">
                        {m.year}
                      </span>
                    </div>
                    <p className="relative mt-3 text-sm leading-relaxed text-white/65">
                      {m.description}
                    </p>
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
