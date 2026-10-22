import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { teamPhotos } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

export function TestimonialsCarousel() {
  const { testimonials } = useContent();
  const reduceMotion = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  useEffect(() => {
    if (paused || count <= 1 || reduceMotion) return;
    const t = setInterval(() => setI((p) => (p + 1) % count), 7000);
    return () => clearInterval(t);
  }, [paused, count, reduceMotion]);

  if (count === 0) return null;
  const active = testimonials[i % count];
  const go = (n: number) => setI(((n % count) + count) % count);

  return (
    <section
      className="py-24 md:py-32 bg-sand"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="shell grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-4 flex lg:flex-col justify-between gap-6">
          <div>
            <div className="eyebrow mb-5">In their words</div>
            <h2 className="display-3 max-w-xs">Faces of the foundation.</h2>
          </div>
          {count > 1 && (
            <div className="flex items-center gap-4 self-end lg:self-start">
              <button
                type="button"
                onClick={() => go(i - 1)}
                aria-label="Previous testimonial"
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 text-ink hover:bg-ink hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(i + 1)}
                aria-label="Next testimonial"
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 text-ink hover:bg-ink hover:text-white transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <span className="font-mono-stat text-sm text-text/50 tabular-nums">
                {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 min-h-[300px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg
                className="w-12 h-12 text-accent"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9.6 8c-3 0-5.6 2.6-5.6 5.6V20h6.4v-6.4H7.2c0-1.4 1-2.4 2.4-2.4V8zm9.2 0c-3 0-5.6 2.6-5.6 5.6V20h6.4v-6.4h-3.2c0-1.4 1-2.4 2.4-2.4V8z" />
              </svg>
              <blockquote className="mt-6 display-3 !leading-[1.3] text-ink">
                {active.quote}
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <img
                  src={teamPhotos[i % teamPhotos.length]}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-white"
                />
                <span>
                  <span className="block font-semibold text-ink">{active.name}</span>
                  <span className="block text-sm text-text/60">{active.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
