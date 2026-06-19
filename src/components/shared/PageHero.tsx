import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Scale, Users, Vote, MapPin } from "lucide-react";

type Stat = { value: string; label: string };

/** Rights-based value strip — inspired by CIL-Kathmandu's advocacy framing. */
const rights = [
  { icon: Scale, label: "Dignity", text: "The right to live with dignity." },
  { icon: Users, label: "Participation", text: "The right to take part in every aspect of life." },
  { icon: Vote, label: "Self-determination", text: "The right to make our own decisions." },
];

export function PageHero({
  title,
  subtitle,
  image,
  imageAlt = "",
  eyebrow,
  stats,
  showValues = true,
}: {
  title: ReactNode;
  subtitle?: string;
  /** Deprecated — no longer rendered. Left for backwards compatibility. */
  breadcrumb?: string;
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  stats?: Stat[];
  showValues?: boolean;
}) {
  return (
    <section className="relative overflow-hidden aurora-soft grain pt-28 md:pt-36 pb-14 md:pb-20">
      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary soft-shadow">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {eyebrow}
            </div>
          )}
          <h1 className="font-display font-semibold text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg md:text-xl text-text/80 max-w-2xl leading-relaxed">{subtitle}</p>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-card border border-border px-4 py-2.5 soft-shadow">
                  <div className="font-mono-stat font-bold text-primary text-lg leading-none">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-text/55 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-5 relative h-[260px] sm:h-[320px] md:h-[400px]"
          >
            <div className="photo-frame absolute inset-0">
              <img src={image} alt={imageAlt} loading="lazy" className="ken-burns" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-ink">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Kathmandu, Nepal
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {showValues && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="relative mx-auto max-w-7xl px-6 mt-12 md:mt-16"
        >
          <div className="rounded-3xl bg-card border border-border px-6 py-5 grid sm:grid-cols-3 gap-5 soft-shadow">
            {rights.map((v) => (
              <div key={v.label} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-pale text-primary">
                  <v.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-base font-semibold text-ink leading-tight">{v.label}</div>
                  <div className="text-xs text-text/65 leading-snug">{v.text}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

/** Re-export for legacy imports (HeroSection/DonateCtaSection use it). */
export function LotusDecor() {
  return null;
}
