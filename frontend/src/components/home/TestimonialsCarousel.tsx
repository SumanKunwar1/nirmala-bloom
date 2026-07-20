import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { teamPhotos } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

export function TestimonialsCarousel() {
  const { testimonials } = useContent();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;
  useEffect(() => {
    if (paused || count === 0) return;
    const t = setInterval(() => setI((p) => (p + 1) % count), 6000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;
  const active = testimonials[i % count];

  return (
    <section
      className="relative py-28 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background:
          "radial-gradient(50% 60% at 80% 10%, rgba(217,115,43,0.08), transparent 60%)," +
          "radial-gradient(60% 70% at 12% 100%, rgba(91,44,134,0.08), transparent 60%)," +
          "linear-gradient(180deg, #FDFAF5 0%, #FFFFFF 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="eyebrow mb-4">Faces of Nirmala</div>
        <svg className="mx-auto w-10 h-10 text-accent opacity-80" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M9.6 8c-3 0-5.6 2.6-5.6 5.6V20h6.4v-6.4H7.2c0-1.4 1-2.4 2.4-2.4V8zm9.2 0c-3 0-5.6 2.6-5.6 5.6V20h6.4v-6.4h-3.2c0-1.4 1-2.4 2.4-2.4V8z" />
        </svg>
        <div className="relative h-56 mt-4">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-semibold text-2xl md:text-[2rem] md:leading-snug text-ink"
            >
              &ldquo;{active.quote}&rdquo;
              <footer className="mt-7 not-italic flex flex-col items-center gap-2">
                <img
                  src={teamPhotos[i % teamPhotos.length]}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                <div className="text-base font-sans text-text font-semibold">{active.name}</div>
                <div className="text-sm text-text/60">{active.role}</div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
