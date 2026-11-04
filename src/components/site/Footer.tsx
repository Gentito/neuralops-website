import Link from "next/link";
import { company, navItems } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12">
      <div
        aria-hidden
        className="hairline pointer-events-none absolute inset-x-0 top-0 h-px"
      />
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-white to-white/55 ring-1 ring-white/25">
                <span className="h-3 w-3 rounded-[4px] bg-ink" />
              </span>
              <div className="font-[var(--font-space)] tracking-[0.03em] text-white">
                {company.name}
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-white/60">
              Futuristic IT solutions across web, mobile, AI systems, and UI/UX
              design.
            </p>

            <div className="mt-6 grid gap-1 text-sm text-white/60">
              <div>{company.contact.person}</div>
              <div>{company.contact.email}</div>
              <div>{company.contact.phone}</div>
            </div>

            <div className="mt-8 text-xs text-white/40">
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </div>
          </div>

          <div className="grid gap-4 md:justify-end">
            <div className="text-xs uppercase tracking-[0.18em] text-white/45">
              Links
            </div>
            <div className="flex flex-wrap gap-2">
              {navItems.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full bg-white/[0.04] px-4 py-2 text-sm text-white/65 ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href="/agents"
                className="rounded-full bg-white/[0.04] px-4 py-2 text-sm text-cyan-300/90 ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:text-cyan-200"
              >
                Agents
              </Link>
            </div>
            <div className="text-xs text-white/40">
              Deploy-ready for Vercel. Replace placeholder visuals with your real
              portfolio assets anytime.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
