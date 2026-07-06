import { impactStats } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function ImpactCounters() {
  return (
    <section className="relative py-20 md:py-24 bg-muted/60 border-y border-border">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="eyebrow mb-4">Our Impact</div>
          <h2 className="font-display text-2xl md:text-[2.1rem] md:leading-[1.3] font-bold text-ink">
            Our community-led model makes sure no one is left behind — and the results speak for
            themselves.
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
