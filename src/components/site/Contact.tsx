"use client";

import { useState } from "react";
import { company } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Section } from "./Section";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <Section id="contact" className="pb-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <p className="text-sm font-medium text-cyan-300/90">Contact</p>
            <h2 className="mt-3 font-[var(--font-space)] text-3xl tracking-tight md:text-4xl">
              Let’s build something unforgettable.
            </h2>
            <p className="mt-3 max-w-md text-base text-white/70">
              Share your idea. We’ll respond with next steps, timeline, and a
              clear path to launch.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 backdrop-blur-xl">
                <div className="text-sm font-medium text-white/85">Email</div>
                <div className="mt-1 text-sm text-white/70">
                  {company.contact.email}
                </div>
              </div>
              <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 backdrop-blur-xl">
                <div className="text-sm font-medium text-white/85">Phone</div>
                <div className="mt-1 text-sm text-white/70">
                  {company.contact.phone}
                </div>
              </div>
              <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 backdrop-blur-xl">
                <div className="text-sm font-medium text-white/85">
                  Contact person
                </div>
                <div className="mt-1 text-sm text-white/70">
                  {company.contact.person}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-2xl" />
            <form
              className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-xl"
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
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Name</span>
                  <input
                    name="name"
                    required
                    className="h-11 rounded-2xl bg-ink/40 px-4 text-sm text-white ring-1 ring-white/12 outline-none transition focus:ring-cyan-400/50"
                    placeholder="Your name"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="h-11 rounded-2xl bg-ink/40 px-4 text-sm text-white ring-1 ring-white/12 outline-none transition focus:ring-cyan-400/50"
                    placeholder="you@company.com"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="rounded-2xl bg-ink/40 px-4 py-3 text-sm text-white ring-1 ring-white/12 outline-none transition focus:ring-cyan-400/50"
                    placeholder="Tell us what you want to build..."
                  />
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-white/65">
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

