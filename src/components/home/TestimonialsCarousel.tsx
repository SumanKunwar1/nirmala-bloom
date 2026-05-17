import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/constants";
import { teamPhotos } from "@/lib/images";

export function TestimonialsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      className="relative py-28 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background:
          "radial-gradient(50% 60% at 80% 10%, rgba(249,115,22,0.10), transparent 60%)," +
          "radial-gradient(60% 70% at 12% 100%, rgba(155,93,213,0.16), transparent 60%)," +
          "linear-gradient(180deg, #FAF6FF 0%, #FFFFFF 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="text-xs font-semibold tracking-[0.24em] uppercase text-accent mb-4">Voices of Belonging</div>
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
              className="font-display italic text-2xl md:text-3xl text-ink leading-relaxed"
            >
              &ldquo;{testimonials[i].quote}&rdquo;
              <footer className="mt-7 not-italic flex flex-col items-center gap-2">
                <img
                  src={teamPhotos[i % teamPhotos.length]}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                <div className="text-base font-sans text-text font-semibold">{testimonials[i].name}</div>
                <div className="text-sm text-text/60">{testimonials[i].role}</div>
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
