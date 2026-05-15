import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/constants";

export function TestimonialsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="py-24 bg-primary-pale/60" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="text-accent text-5xl mb-6">"</div>
        <div className="relative h-48">
          <AnimatePresence mode="wait">
            <motion.blockquote key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="font-display italic text-2xl md:text-3xl text-ink leading-relaxed">
              "{testimonials[i].quote}"
              <footer className="mt-6 not-italic">
                <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ background: "linear-gradient(135deg, #6B2FA0, #F97316)" }} />
                <div className="text-base font-sans text-text font-semibold">{testimonials[i].name}</div>
                <div className="text-sm text-text/60">{testimonials[i].role}</div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-primary/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
