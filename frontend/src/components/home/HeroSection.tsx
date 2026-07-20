import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Heart, ArrowRight } from "lucide-react";
import { imgs } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

const FALLBACK = [
  {
    id: "f1",
    image: imgs.founderCommunity,
    eyebrow: "Nirmala Foundation · Nepal",
    title: "More than support — we build belonging.",
    text: "Empowering communities, breaking barriers, and inspiring futures for people with disabilities across Nepal.",
  },
];

export function HeroSection() {
  const { heroSlides } = useContent();
  const slides = heroSlides.length ? heroSlides : FALLBACK;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % count), 6500);
    return () => clearInterval(t);
  }, [paused, count]);

  const slide = slides[i % count];

  return (
    <section
      className="relative min-h-[92vh] flex items-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-bleed rotating photography */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={i}
            src={slide.image}
            alt=""
            aria-hidden
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1 }, scale: { duration: 7, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 hero-scrim" />
      </div>

      {/* Overlay content — centered, BlinkNow-style */}
      <div className="relative z-10 mx-auto max-w-4xl w-full px-6 pb-20 md:pb-28 pt-32 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow text-accent-light mb-5">{slide.eyebrow}</div>
            <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl md:text-[4.5rem] md:leading-[1.02] tracking-tight">
              {slide.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              {slide.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/donate" className="btn-pill btn-accent">
            <Heart className="h-4 w-4" /> Donate Now
          </Link>
          <Link to="/programs" className="btn-pill btn-outline-light">
            Explore Our Work <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Slide dots */}
        <div className="mt-12 flex justify-center gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-9 bg-accent" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
