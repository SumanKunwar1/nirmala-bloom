import { partners } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function PartnersMarquee() {
  const loop = [...partners, ...partners, ...partners];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Together" title="Our partners & supporters" align="center" />
      </div>
      <div className="overflow-hidden mt-8" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
        <div className="marquee flex gap-6 w-max">
          {loop.map((p, i) => (
            <div key={i} className="shrink-0 w-64 h-24 rounded-2xl bg-primary-pale border border-border grid place-items-center text-primary font-display font-semibold text-lg px-6 text-center">
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
