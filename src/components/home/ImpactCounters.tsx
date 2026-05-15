import { impactStats } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function ImpactCounters() {
  return (
    <section className="relative py-20 grain overflow-hidden" style={{
      background: "linear-gradient(135deg, #6B2FA0 0%, #9B5DD5 100%)",
    }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {impactStats.map((s) => (
            <div key={s.label}>
              <div className="text-5xl md:text-6xl font-bold text-white">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm md:text-base text-white/75 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
