import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium tracking-tight transition will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-0 disabled:opacity-50";

  const sizes: Record<Size, string> = {
    md: "h-11",
    lg: "h-12 px-6 text-[15px]"
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-b from-white/12 to-white/5 text-white shadow-glow ring-1 ring-white/10 hover:from-white/16 hover:to-white/7 active:translate-y-[1px]",
    secondary:
      "bg-white/6 text-white ring-1 ring-white/12 hover:bg-white/9 active:translate-y-[1px]",
    ghost:
      "bg-transparent text-white/85 ring-1 ring-white/10 hover:bg-white/6 active:translate-y-[1px]"
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

