"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function TiltCard({
  className,
  children,
  intensity = 10
}: {
  className?: string;
  children: ReactNode;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "transform-gpu transition-transform will-change-transform",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const rx = (-py * intensity).toFixed(2);
        const ry = (px * intensity).toFixed(2);
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        el.style.setProperty("--x", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--y", `${(py + 0.5) * 100}%`);
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      }}
    >
      {children}
    </div>
  );
}

