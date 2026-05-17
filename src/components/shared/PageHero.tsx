import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { sharedValues } from "@/lib/images";

type Stat = { value: string; label: string };

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
    <section className="relative overflow-hidden aurora-soft pt-28 md:pt-36 pb-14 md:pb-20">
      <DecorPetals />
      <DecorDots />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-primary/15 px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display font-semibold text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg md:text-xl text-text/75 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/80 backdrop-blur border border-primary/10 px-4 py-2.5 soft-shadow">
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
            className="lg:col-span-5 relative h-[260px] sm:h-[320px] md:h-[380px]"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-accent/20 blur-2xl float-slow" aria-hidden />
            <div className="absolute -bottom-6 -right-4 w-28 h-28 rounded-full bg-primary/25 blur-2xl float-slower" aria-hidden />

            <div className="photo-frame absolute inset-0">
              <img src={image} alt={imageAlt} loading="lazy" className="ken-burns" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent pointer-events-none" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="hidden sm:flex absolute -bottom-5 -left-5 items-center gap-3 rounded-2xl bg-white/95 backdrop-blur border border-primary/10 px-4 py-3 soft-shadow"
            >
              <div className="w-9 h-9 rounded-full grid place-items-center bg-accent/15 text-accent text-lg">✨</div>
              <div className="text-xs">
                <div className="font-semibold text-ink leading-tight">Inclusive · Joyful</div>
                <div className="text-text/55">Built with care in Nepal</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {showValues && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="relative mx-auto max-w-7xl px-6 mt-12 md:mt-16"
        >
          <div className="rounded-3xl bg-white/75 backdrop-blur-md border border-primary/10 px-6 py-5 grid sm:grid-cols-3 gap-4 soft-shadow">
            {sharedValues.map((v) => (
              <div key={v.label} className="flex items-center gap-3">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-primary-pale to-accent-light grid place-items-center text-xl">
                  {v.icon}
                </div>
                <div>
                  <div className="font-display text-base font-semibold text-ink leading-tight">{v.label}</div>
                  <div className="text-xs text-text/60">{v.text}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

function DecorPetals() {
  return (
    <svg
      className="absolute -top-10 -right-20 w-[420px] h-[420px] opacity-[0.10] pointer-events-none float-slower text-primary"
      viewBox="0 0 200 200"
      fill="currentColor"
      aria-hidden
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="100"
          cy="58"
          rx="22"
          ry="48"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
    </svg>
  );
}

function DecorDots() {
  return (
    <svg
      className="absolute bottom-10 left-6 w-32 h-32 opacity-30 pointer-events-none text-accent"
      viewBox="0 0 120 120"
      fill="currentColor"
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={10 + c * 18} cy={10 + r * 18} r="1.6" />
        )),
      )}
    </svg>
  );
}

/** Re-export for legacy imports (HeroSection/DonateCtaSection use it). */
export function LotusDecor() {
  return (
    <svg
      className="absolute -top-20 -right-20 w-[480px] h-[480px] opacity-15 pointer-events-none float-slower"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="100"
          cy="60"
          rx="22"
          ry="50"
          fill="white"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
    </svg>
  );
}
