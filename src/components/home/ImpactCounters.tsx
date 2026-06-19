import { impactStats } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function ImpactCounters() {
  return (
    <section className="relative py-20 md:py-24 bg-muted/60 border-y border-border">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">Our impact</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mt-2">
            Numbers that mean people.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {impactStats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl bg-card border border-border p-7 text-center soft-shadow lift"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary font-mono-stat">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs md:text-sm text-text/65 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
