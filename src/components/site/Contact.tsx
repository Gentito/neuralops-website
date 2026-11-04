"use client";

import { useState } from "react";
import { company } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "h-11 rounded-2xl bg-ink/40 px-4 text-sm text-white ring-1 ring-white/12 outline-none transition placeholder:text-white/35 focus:ring-cyan-400/60";

const details = [
  { label: "Email", value: company.contact.email },
  { label: "Phone", value: company.contact.phone },
  { label: "Contact person", value: company.contact.person }
] as const;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <Section id="contact" className="pb-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Let’s build something unforgettable."
              description="Share your idea. We’ll respond with next steps, timeline, and a clear path to launch."
            />

            <div className="mt-8 grid gap-3">
              {details.map((d) => (
                <Reveal key={d.label}>
                  <div className="panel group px-5 py-4 transition hover:bg-white/[0.05]">
                    <div className="panel-topline opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative text-xs uppercase tracking-[0.18em] text-white/45">
                      {d.label}
                    </div>
                    <div className="relative mt-1.5 text-sm text-white/75">
                      {d.value}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl"
            />
            <form
              className="panel p-6 md:p-7"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setStatus("sending");

                const form = e.currentTarget;
                const data = new FormData(form);
                const payload = {
                  name: String(data.get("name") ?? ""),
                  email: String(data.get("email") ?? ""),
                  message: String(data.get("message") ?? "")
                };

                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload)
                  });

                  if (!res.ok) {
                    const body = (await res.json().catch(() => null)) as
                      | { error?: string }
                      | null;
                    throw new Error(body?.error ?? "Failed to send message.");
                  }

                  form.reset();
                  setStatus("sent");
                  window.setTimeout(() => setStatus("idle"), 2500);
                } catch (err) {
                  setStatus("error");
                  setError(err instanceof Error ? err.message : "Unknown error");
                  window.setTimeout(() => setStatus("idle"), 2500);
                }
              }}
            >
              <div className="panel-topline" />
              <div className="relative grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Name</span>
                  <input
                    name="name"
                    required
                    className={fieldClass}
                    placeholder="Your name"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className={fieldClass}
                    placeholder="you@company.com"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="rounded-2xl bg-ink/40 px-4 py-3 text-sm text-white ring-1 ring-white/12 outline-none transition placeholder:text-white/35 focus:ring-cyan-400/60"
                    placeholder="Tell us what you want to build..."
                  />
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-white/55">
                    {status === "sent"
                      ? "Message sent."
                      : status === "error"
                        ? error ?? "Something went wrong."
                        : "We typically reply within 24 hours."}
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className="min-w-[160px]"
                  >
                    {status === "sending"
                      ? "Sending…"
                      : status === "sent"
                        ? "Sent"
                        : "Send Message"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
