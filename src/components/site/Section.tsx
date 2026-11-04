import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-28 py-20 md:py-28", className)}
    >
      <div
        aria-hidden
        className="hairline pointer-events-none absolute inset-x-0 top-0 h-px"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow opacity-70"
      />
      {children}
    </section>
  );
}
