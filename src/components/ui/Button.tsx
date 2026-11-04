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
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-all duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50";

  const sizes: Record<Size, string> = {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-7 text-[15px]"
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-white text-ink shadow-[0_10px_40px_-12px_rgba(88,196,255,0.7)] hover:shadow-[0_16px_50px_-10px_rgba(88,196,255,0.85)] hover:bg-white/95 active:translate-y-px",
    secondary:
      "bg-white/[0.05] text-white ring-1 ring-white/12 backdrop-blur-xl hover:bg-white/[0.09] hover:ring-white/20 active:translate-y-px",
    ghost:
      "bg-transparent text-white/75 hover:bg-white/[0.06] hover:text-white active:translate-y-px"
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
