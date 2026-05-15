import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { LotusDecor } from "@/components/shared/PageHero";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden grain flex items-center" style={{
      background: "radial-gradient(ellipse at 80% 100%, #F97316 0%, transparent 55%), linear-gradient(135deg, #1A1035 0%, #6B2FA0 60%, #9B5DD5 100%)",
    }}>
      <LotusDecor />
      <svg className="absolute -bottom-40 -left-40 w-[640px] h-[640px] opacity-15 pointer-events-none" viewBox="0 0 200 200">
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <ellipse key={d} cx="100" cy="50" rx="20" ry="55" fill="white" transform={`rotate(${d} 100 100)`} />
        ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 grid lg:grid-cols-12 gap-12 items-center w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="lg:col-span-7 text-white">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <span>🏀</span><span>Nepal's only Wheelchair Basketball NGO</span>
          </motion.div>
          <h1 className="font-display font-semibold text-5xl md:text-7xl leading-[1.05] tracking-tight" style={{ color: "#fff" }}>
            Breaking Barriers.<br/>Building <span className="text-accent">Belonging</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
            Empowering people with disabilities through sports, arts, education & mobility in Nepal.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/donate" className="bg-accent text-white rounded-full px-8 py-4 font-semibold shadow-lg shadow-orange-900/40 hover:scale-105 hover:shadow-xl transition-all">
              Donate Now
            </Link>
            <Link to="/programs" className="border-2 border-white/70 text-white rounded-full px-8 py-4 font-semibold hover:bg-white hover:text-primary transition-all">
              Our Programs
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
          className="lg:col-span-5 relative h-[420px] hidden lg:block">
          <motion.div animate={{ y: [0, -16, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-[40%_60%_60%_40%/50%_40%_60%_50%] grain"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #9B5DD5 80%)", boxShadow: "0 30px 80px rgba(249,115,22,0.4)" }} />
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 -left-10 w-40 h-40 rounded-full"
            style={{ background: "radial-gradient(circle, #FEF3E2, transparent)", filter: "blur(20px)" }} />
          <div className="absolute inset-0 grid place-items-center text-[160px]" aria-hidden>
            <motion.span animate={{ rotate: [0, 4, 0, -4, 0] }} transition={{ repeat: Infinity, duration: 8 }}>♿🏀</motion.span>
          </div>
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs uppercase tracking-widest flex flex-col items-center gap-2">
        Scroll
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 4v14M2 12l6 6 6-6"/></svg>
      </motion.div>
    </section>
  );
}
