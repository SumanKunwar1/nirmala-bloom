import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}`}>
      {eyebrow && (
        <div className={`mb-3 text-xs font-semibold tracking-[0.2em] uppercase ${light ? "text-accent-light" : "text-accent"}`}>
          {eyebrow}
        </div>
      )}
      <h2 className={`heading-rule text-4xl md:text-5xl font-display font-semibold ${light ? "text-white [&]:text-white" : ""}`}
          style={light ? { color: "#fff" } : undefined}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-lg leading-relaxed ${light ? "text-white/80" : "text-text/80"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
