import { impactStats } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function ImpactCounters() {
  return (
    <section
      className="relative py-24 grain overflow-hidden"
      style={{
        background:
          "radial-gradient(60% 70% at 12% 0%, rgba(249,115,22,0.30), transparent 60%)," +
          "radial-gradient(50% 60% at 90% 100%, rgba(155,93,213,0.55), transparent 60%)," +
          "linear-gradient(135deg, #4F1F8C 0%, #6B2FA0 60%, #9B5DD5 100%)",
      }}
    >
      <svg
        className="absolute -top-16 right-16 w-72 h-72 opacity-15 pointer-events-none float-slow"
        viewBox="0 0 200 200"
        aria-hidden
      >
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <ellipse key={d} cx="100" cy="50" rx="18" ry="50" fill="white" transform={`rotate(${d} 100 100)`} />
        ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold tracking-[0.24em] uppercase text-accent-light">Our Impact</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mt-2">
            Numbers that mean people.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {impactStats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/15 p-7 text-center hover:bg-white/15 transition-colors"
            >
              <div className="text-5xl md:text-6xl font-bold text-white font-mono-stat">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs md:text-sm text-white/75 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
