import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal>
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto text-center",
          className
        )}
      >
        <p className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
          {eyebrow}
        </p>
        <h2 className="text-gradient mt-4 font-[var(--font-space)] text-3xl tracking-tight md:text-[2.6rem] md:leading-[1.1]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-white/65">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
