import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  const center = align === "center";
  return (
    <div className={`mb-12 ${center ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}`}>
      {eyebrow && (
        <div className={`eyebrow mb-4 ${light ? "text-accent-light" : "text-accent"}`}>{eyebrow}</div>
      )}
      <h2
        className={`heading-rule ${center ? "is-center" : ""} text-3xl md:text-[2.75rem] md:leading-[1.1] font-display font-bold ${light ? "text-white" : "text-ink"}`}
        style={light ? { color: "#fff" } : undefined}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-6 text-lg leading-relaxed ${light ? "text-white/80" : "text-text/75"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
