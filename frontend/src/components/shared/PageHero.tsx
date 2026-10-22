import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type Stat = { value: string; label: string };

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial header shared by every inner page: breadcrumb and a large serif
 * title on the ivory canvas, the summary + key figures beside it, then a wide
 * framed photograph underneath.
 */
export function PageHero({
  title,
  subtitle,
  image,
  imageAlt = "",
  eyebrow,
  breadcrumb,
  stats,
  children,
}: {
  title: ReactNode;
  subtitle?: string;
  /** Label for the current page in the breadcrumb. Falls back to the eyebrow. */
  breadcrumb?: string;
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  stats?: Stat[];
  /** Extra actions under the summary (buttons, links). */
  children?: ReactNode;
  /** Deprecated — the values band is no longer rendered on inner heroes. */
  showValues?: boolean;
}) {
  const crumb = breadcrumb ?? eyebrow;

  return (
    <section className="pt-[74px]">
      <div className="shell pt-10 md:pt-16 pb-10 md:pb-14">
        {crumb && (
          <nav
            aria-label="Breadcrumb"
            className="mb-8 md:mb-12 flex items-center gap-1.5 text-sm text-text/55"
          >
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-ink/80">{crumb}</span>
          </nav>
        )}

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="lg:col-span-7"
          >
            {eyebrow && <div className="eyebrow mb-5">{eyebrow}</div>}
            <h1 className="display-1">{title}</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="lg:col-span-5 lg:pb-2"
          >
            {subtitle && (
              <p className="text-lg md:text-xl leading-relaxed text-text/75">{subtitle}</p>
            )}
            {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
            {stats && stats.length > 0 && (
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-3xl md:text-4xl text-ink leading-none tracking-tight">
                      {s.value}
                    </dd>
                    <dd className="mt-2 text-xs text-text/55 leading-snug">{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </motion.div>
        </div>
      </div>

      {image && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="shell"
        >
          <div className="photo-frame aspect-[4/3] sm:aspect-[16/8] lg:aspect-[21/8] rounded-[1.75rem] md:rounded-[2.25rem]">
            <img src={image} alt={imageAlt} className="ken-burns" />
          </div>
        </motion.div>
      )}
    </section>
  );
}
