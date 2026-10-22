import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  /** Optional link/button shown at the right of a left-aligned heading. */
  action?: ReactNode;
}) {
  const center = align === "center";

  const copy = (
    <div className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      {eyebrow && (
        <div
          className={`eyebrow mb-5 ${center ? "no-rule" : ""} ${light ? "!text-accent-light" : ""}`}
        >
          {eyebrow}
        </div>
      )}
      <h2 className={`display-2 ${light ? "!text-white" : ""}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-5 text-lg leading-relaxed ${light ? "text-white/70" : "text-text/70"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (center || !action) return <div className="mb-12 md:mb-16">{copy}</div>;

  return (
    <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      {copy}
      <div className="shrink-0">{action}</div>
    </div>
  );
}
