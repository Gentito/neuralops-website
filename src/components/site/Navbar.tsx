"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navItems } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";

function scrollToHash(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const items = useMemo(() => [...navItems], []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto max-w-6xl px-5 md:px-8">
        <div
          className={cn(
            "mt-4 flex h-14 items-center justify-between rounded-2xl px-3 ring-1 backdrop-blur-2xl transition-all duration-300",
            scrolled
              ? "bg-ink/70 ring-white/12 shadow-glow"
              : "bg-ink/35 ring-white/[0.08]"
          )}
        >
          <Link href="#top" className="group flex items-center gap-2.5 pl-1">
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-white to-white/55 ring-1 ring-white/25">
              <span className="h-3 w-3 rounded-[4px] bg-ink" />
              <span className="absolute inset-0 rounded-xl shadow-[0_0_22px_-2px_rgba(88,196,255,0.75)]" />
            </span>
            <span className="font-[var(--font-space)] text-sm tracking-[0.03em] text-white">
              NeuralOps
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/agents"
              className="rounded-full px-3 py-2 text-sm text-cyan-300/90 transition hover:bg-white/[0.06] hover:text-cyan-200"
            >
              Agents
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/agents"
              className="rounded-full px-3 py-2 text-sm text-cyan-300/90 transition hover:bg-white/[0.06] hover:text-cyan-200 md:hidden"
            >
              Agents
            </Link>
            <ThemeToggle className="hidden md:inline-flex" />
            <Button
              className="h-10 px-4 text-sm"
              onClick={() => scrollToHash("#contact")}
            >
              Start a Project
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
