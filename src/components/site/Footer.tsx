import Link from "next/link";
import { company, navItems } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink/60 py-10">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400/70 to-purple-500/60 ring-1 ring-white/15" />
              <div className="font-[var(--font-space)] tracking-wide">
                {company.name}
              </div>
            </div>
            <p className="mt-3 max-w-md text-sm text-white/65">
              Futuristic IT solutions across web, mobile, AI systems, and UI/UX
              design.
            </p>

            <div className="mt-5 grid gap-1 text-sm text-white/65">
              <div>{company.contact.person}</div>
              <div>{company.contact.email}</div>
              <div>{company.contact.phone}</div>
            </div>

            <div className="mt-6 text-xs text-white/45">
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </div>
          </div>

          <div className="grid gap-4 md:justify-end">
            <div className="text-sm font-medium text-white/80">Links</div>
            <div className="flex flex-wrap gap-2">
              {navItems.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/70 ring-1 ring-white/10 transition hover:bg-white/8 hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="text-xs text-white/45">
              Deploy-ready for Vercel. Replace placeholder visuals with your
              real portfolio assets anytime.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

