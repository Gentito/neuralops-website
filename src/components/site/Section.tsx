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
      className={cn(
        "relative scroll-mt-28 py-16 md:py-24",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-radial-glow before:opacity-80",
        className
      )}
    >
      {children}
    </section>
  );
}

