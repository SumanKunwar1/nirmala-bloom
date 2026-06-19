import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { imgs } from "@/lib/images";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 * i },
  }),
};

const trust = [
  { v: "1,200+", l: "Lives changed" },
  { v: "8", l: "Active programs" },
  { v: "15+", l: "Partner organisations" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden aurora-soft grain pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Mission-forward copy */}
        <div className="lg:col-span-6">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-border pl-2 pr-4 py-1.5 text-sm soft-shadow"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-pale text-primary">
              <Heart className="h-3.5 w-3.5" />
            </span>
            <span className="text-text">Founded &amp; led by people with lived experience</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-display text-[2.6rem] leading-[1.05] md:text-6xl md:leading-[1.04] tracking-tight text-ink mt-6"
          >
            Championing dignity, mobility &amp; <span className="gradient-text-warm">belonging</span> for people with disabilities across Nepal.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-lg md:text-xl text-text/80 max-w-xl leading-relaxed"
          >
            The Nirmala Foundation creates pathways to inclusion through sport, the arts,
            education and mobility — so every person can take part, contribute and thrive.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/donate"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-white shadow-[0_18px_40px_-14px_rgba(217,115,43,0.7)] transition-all hover:-translate-y-0.5"
            >
              <Heart className="h-5 w-5" />
              Donate now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-7 py-4 font-semibold text-primary transition-colors hover:bg-primary-pale"
            >
              Our story
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap gap-x-10 gap-y-4"
          >
            {trust.map((s) => (
              <div key={s.l}>
                <div className="font-mono-stat text-2xl md:text-3xl font-bold text-primary">{s.v}</div>
                <div className="mt-0.5 text-xs uppercase tracking-[0.16em] text-text/55">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Founder-forward imagery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="photo-frame aspect-[4/5] md:aspect-[5/6]">
              <img
                src={imgs.founderPortrait}
                alt="Nirmala Bhandari, founder of the Nirmala Foundation"
                className="ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              {/* Founder name plate */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-accent">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <div className="font-display text-base font-semibold text-ink">Nirmala Bhandari</div>
                  <div className="text-xs text-text/65">Founder &amp; Executive Director · Para-athlete</div>
                </div>
              </div>
            </div>

            {/* Supporting image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="hidden md:block absolute -bottom-8 -left-8 w-44 photo-frame aspect-square ring-4 ring-background"
            >
              <img src={imgs.heroCommunity} alt="Community members together at a foundation event" className="ken-burns" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
