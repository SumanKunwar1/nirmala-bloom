import { partners } from "@/lib/constants";

export function PartnersMarquee() {
  const loop = [...partners, ...partners, ...partners];
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="text-xs font-semibold tracking-[0.24em] uppercase text-accent">Together</div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mt-2">
          Trusted by partners across Nepal &amp; beyond
        </h2>
      </div>
      <div
        className="overflow-hidden mt-10"
        style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
      >
        <div className="marquee flex gap-5 w-max">
          {loop.map((p, i) => (
            <div
              key={i}
              className="shrink-0 w-56 h-20 rounded-2xl bg-white border border-border grid place-items-center text-primary font-display font-semibold text-base px-6 text-center soft-shadow"
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
