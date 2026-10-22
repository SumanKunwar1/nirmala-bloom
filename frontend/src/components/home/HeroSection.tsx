import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

const SLIDE_MS = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const { heroSlides, impactStats } = useContent();
  const slides = heroSlides.length ? heroSlides : FALLBACK;
  const reduceMotion = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const autoplay = count > 1 && !reduceMotion;

  const go = (n: number) => setI(((n % count) + count) % count);
  const slide = slides[i % count];
  const stat = impactStats[0];

  return (
    <section className="pt-[74px]">
      <div className="px-3 md:px-5 pt-2">
        <div
          className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-plum min-h-[clamp(620px,calc(100svh-74px-1.25rem),880px)] flex flex-col justify-end"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Photography */}
          <AnimatePresence initial={false}>
            <motion.img
              key={i}
              src={slide.image}
              alt=""
              aria-hidden
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.1 }, scale: { duration: 8, ease: "linear" } }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 hero-scrim" />
          <div className="absolute inset-0 bg-gradient-to-r from-plum/70 via-plum/20 to-transparent" />

          {/* Floating proof point */}
          {stat && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
              className="hidden md:flex absolute top-8 right-8 items-center gap-4 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 pl-5 pr-6 py-4 text-white"
            >
              <span className="font-display text-4xl leading-none">
                {stat.value.toLocaleString()}
                <span className="text-accent">{stat.suffix}</span>
              </span>
              <span className="text-sm leading-snug text-white/80 max-w-[8rem]">{stat.label}</span>
            </motion.div>
          )}

          {/* Copy */}
          <div className="relative z-10 px-6 sm:px-10 md:px-14 pt-28 md:pt-32 pb-8 md:pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease }}
                className="max-w-4xl"
              >
                <div className="eyebrow !text-white/80 mb-6">{slide.eyebrow}</div>
                <h1 className="display-1 !text-white">{slide.title}</h1>
                <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                  {slide.text}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/donate" className="btn-pill btn-accent btn-lg">
                <Heart className="h-4 w-4" fill="currentColor" /> Donate now
              </Link>
              <Link to="/programs" className="btn-pill btn-light btn-lg">
                Explore our work <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Slide controls */}
            {count > 1 && (
              <div className="mt-10 md:mt-14 flex items-center gap-5 border-t border-white/15 pt-6">
                <span className="font-mono-stat text-sm text-white/70 tabular-nums">
                  {String(i + 1).padStart(2, "0")}{" "}
                  <span className="text-white/35">/ {String(count).padStart(2, "0")}</span>
                </span>
                <div className="flex flex-1 gap-2 max-w-md">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id ?? idx}
                      type="button"
                      onClick={() => go(idx)}
                      aria-label={`Show slide ${idx + 1}`}
                      aria-current={idx === i}
                      className="group relative h-6 flex-1"
                    >
                      <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-white/25 overflow-hidden">
                        {idx === i && autoplay ? (
                          <span
                            key={i}
                            className="absolute inset-0 origin-left bg-white rounded-full"
                            style={{
                              animation: `heroProgress ${SLIDE_MS}ms linear forwards`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                            onAnimationEnd={() => go(i + 1)}
                          />
                        ) : (
                          <span
                            className={`absolute inset-0 rounded-full ${idx < i || idx === i ? "bg-white" : ""}`}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="ml-auto hidden sm:flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(i - 1)}
                    aria-label="Previous slide"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white hover:text-ink transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(i + 1)}
                    aria-label="Next slide"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white hover:text-ink transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
