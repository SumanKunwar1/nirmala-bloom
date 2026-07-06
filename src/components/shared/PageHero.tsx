import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Stat = { value: string; label: string };

export function PageHero({
  title,
  subtitle,
  image,
  imageAlt = "",
  eyebrow,
  stats,
}: {
  title: ReactNode;
  subtitle?: string;
  /** Deprecated — no longer rendered. Left for backwards compatibility. */
  breadcrumb?: string;
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  stats?: Stat[];
  /** Deprecated — the values band is no longer rendered on inner heroes. */
  showValues?: boolean;
}) {
  return (
    <section className="relative overflow-hidden min-h-[54vh] md:min-h-[62vh] flex items-end">
      {/* Full-bleed photography */}
      <div className="absolute inset-0">
        {image && (
          <img src={image} alt={imageAlt} className="h-full w-full object-cover ken-burns" />
        )}
        <div className="absolute inset-0 hero-scrim" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 pb-14 md:pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && <div className="eyebrow text-accent-light mb-4">{eyebrow}</div>}
          <h1 className="font-display font-extrabold text-white text-4xl md:text-6xl leading-[1.05] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">{subtitle}</p>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-mono-stat font-bold text-white text-2xl md:text-3xl leading-none">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/65 mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/** Re-export for legacy imports (HeroSection/DonateCtaSection use it). */
export function LotusDecor() {
  return null;
}
