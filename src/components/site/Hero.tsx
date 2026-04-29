"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { company } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVideo } from "./HeroVideo";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/5 to-transparent" />
    )
  }
);

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <HeroVideo className="absolute inset-0 h-full w-full object-cover" />
        <HeroCanvas />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/10 to-ink" />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-center py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
            Futuristic IT solutions for modern teams
          </div>

          <h1 className="font-[var(--font-space)] text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {company.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75 md:text-xl">
            {company.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                })
              }
            >
              Start a Project
            </Button>
            <Link href="#work" className="inline-flex">
              <Button
                size="lg"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("work")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }}
              >
                View Our Work
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 text-sm text-white/70 md:grid-cols-3">
            <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
              <div className="text-white">Performance-first</div>
              <div className="mt-1 text-white/60">90+ Lighthouse targets</div>
            </div>
            <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
              <div className="text-white">Smooth motion</div>
              <div className="mt-1 text-white/60">Framer + GSAP</div>
            </div>
            <div className="hidden rounded-2xl bg-white/4 p-4 ring-1 ring-white/10 md:block">
              <div className="text-white">3D immersion</div>
              <div className="mt-1 text-white/60">React Three Fiber</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
