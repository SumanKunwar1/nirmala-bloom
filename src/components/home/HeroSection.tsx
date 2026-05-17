import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { imgs } from "@/lib/images";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 * i },
  }),
};

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden grain flex items-center"
      style={{
        background:
          "radial-gradient(60% 65% at 80% 95%, rgba(249,115,22,0.55) 0%, transparent 60%)," +
          "radial-gradient(45% 55% at 12% 18%, rgba(254,243,226,0.18) 0%, transparent 65%)," +
          "linear-gradient(140deg, #1A1035 0%, #3B1670 40%, #6B2FA0 75%, #9B5DD5 100%)",
      }}
    >
      <BackdropArt />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-24 grid lg:grid-cols-12 gap-12 items-center w-full">
        <div className="lg:col-span-6 text-white">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-2 pr-4 py-1.5 text-sm"
          >
            <span className="w-7 h-7 rounded-full bg-accent grid place-items-center text-base">🏀</span>
            <span className="text-white/90">Nepal&apos;s only Wheelchair Basketball NGO</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-display font-semibold text-5xl md:text-7xl leading-[1.02] tracking-tight mt-6"
            style={{ color: "#fff" }}
          >
            Breaking Barriers.
            <br />
            Building <span className="gradient-text-warm">Belonging</span>.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed"
          >
            Empowering people with disabilities across Nepal through{" "}
            <span className="underline-wavy-accent text-white">sports, arts, education &amp; mobility</span>.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/donate"
              className="group relative bg-accent text-white rounded-full px-8 py-4 font-semibold shadow-[0_20px_45px_-12px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-12px_rgba(249,115,22,0.7)] transition-all"
            >
              Donate Now
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/programs"
              className="border border-white/40 bg-white/5 backdrop-blur text-white rounded-full px-8 py-4 font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Our Programs
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-white/85"
          >
            {[
              { v: "1,200+", l: "Lives touched" },
              { v: "8", l: "Active programs" },
              { v: "15+", l: "Partners" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-mono-stat text-2xl md:text-3xl font-bold text-white">{s.v}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/55 mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="lg:col-span-6 relative h-[460px] md:h-[520px] hidden lg:block"
        >
          <HeroCollage />
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/65 text-[11px] uppercase tracking-[0.3em] flex flex-col items-center gap-2"
      >
        Scroll
        <svg width="14" height="22" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 4v14M2 12l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}

function HeroCollage() {
  return (
    <div className="relative w-full h-full">
      {/* Soft glow blobs */}
      <div className="absolute -top-10 right-10 w-40 h-40 rounded-full bg-accent/40 blur-3xl float-slow" aria-hidden />
      <div className="absolute -bottom-10 -left-6 w-48 h-48 rounded-full bg-primary-light/40 blur-3xl float-slower" aria-hidden />

      {/* Main image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
        className="absolute top-0 right-0 w-[78%] h-[78%] photo-frame rotate-[2deg]"
      >
        <img src={imgs.heroAthlete} alt="Wheelchair basketball athlete in action" className="ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
      </motion.div>

      {/* Secondary image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
        className="absolute bottom-0 left-2 w-[52%] h-[44%] photo-frame -rotate-[3deg]"
      >
        <img src={imgs.heroCommunity} alt="Community hands together" className="ken-burns" />
      </motion.div>

      {/* Floating badge — donor count */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="absolute top-6 left-0 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-2xl shadow-purple-900/30"
      >
        <div className="w-10 h-10 rounded-full bg-green/15 grid place-items-center text-green text-lg">📈</div>
        <div className="text-xs text-text leading-tight">
          <div className="font-semibold text-ink">+38% this year</div>
          <div className="text-text/60">beneficiaries reached</div>
        </div>
      </motion.div>

      {/* Floating badge — programs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.05 }}
        className="absolute -bottom-2 right-4 flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-2xl shadow-orange-900/20"
      >
        <div className="flex -space-x-2">
          {["🏀", "🎨", "📚"].map((e) => (
            <div key={e} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-pale to-accent-light grid place-items-center text-sm border-2 border-white">
              {e}
            </div>
          ))}
        </div>
        <div className="text-xs leading-tight">
          <div className="font-semibold text-ink">6 pathways</div>
          <div className="text-text/60">to inclusion</div>
        </div>
      </motion.div>
    </div>
  );
}

function BackdropArt() {
  return (
    <>
      <svg
        className="absolute -bottom-40 -left-32 w-[640px] h-[640px] opacity-[0.08] pointer-events-none float-slower"
        viewBox="0 0 200 200"
        aria-hidden
      >
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <ellipse key={d} cx="100" cy="50" rx="20" ry="55" fill="white" transform={`rotate(${d} 100 100)`} />
        ))}
      </svg>
      <svg
        className="absolute top-32 right-12 w-32 h-32 opacity-30 pointer-events-none text-accent"
        viewBox="0 0 120 120"
        fill="currentColor"
        aria-hidden
      >
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={10 + c * 18} cy={10 + r * 18} r="1.5" />
          )),
        )}
      </svg>
    </>
  );
}
