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
            "mt-4 flex h-14 items-center justify-between rounded-2xl px-4 ring-1 transition",
            "bg-ink/40 backdrop-blur-xl",
            scrolled ? "ring-white/14 shadow-glow" : "ring-white/10"
          )}
        >
          <Link href="#top" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400/70 to-purple-500/60 ring-1 ring-white/15" />
            <span className="font-[var(--font-space)] text-sm tracking-wide">
              NeuralOps
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
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

