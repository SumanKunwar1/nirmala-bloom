import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useContent } from "@/lib/admin/context";

export function ImpactCounters() {
  const { impactStats } = useContent();
  if (impactStats.length === 0) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-5">Our impact</div>
            <h2 className="display-2">
              A community-led model, so <span className="serif-em">no one is left behind.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-lg text-text/70 leading-relaxed">
            We measure success in people reached, schools opened up and partnerships that last — and
            we publish what we learn so others can build on it.
          </p>
        </div>

        <dl className="grid grid-cols-2 lg:grid-cols-4 border-t border-ink/15">
          {impactStats.map((s, i) => (
            <div
              key={s.id ?? s.label}
              className={`py-8 md:py-10 pr-4 ${i % 2 === 1 ? "pl-4 md:pl-8 border-l border-ink/15" : ""} ${
                i > 0 && i % 2 === 0 ? "lg:pl-8 lg:border-l lg:border-ink/15" : ""
              } ${i >= 2 ? "border-t lg:border-t-0 border-ink/15" : ""}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="display-1 !text-[clamp(2.75rem,6vw,4.75rem)] text-ink">
                <AnimatedCounter value={s.value} suffix={s.suffix} className="" />
              </dd>
              <dd className="mt-3 text-sm md:text-base text-text/65">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
