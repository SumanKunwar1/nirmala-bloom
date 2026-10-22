import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/admin/context";

export function PartnersMarquee() {
  const { partners } = useContent();
  if (partners.length === 0) return null;
  const loop = [...partners, ...partners];

  return (
    <section className="py-16 md:py-20 border-y border-border">
      <div className="shell flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h2 className="font-display text-2xl md:text-3xl max-w-md">
          Trusted by partners across Nepal &amp; beyond
        </h2>
        <Link
          to="/partners"
          className="group inline-flex items-center gap-2 font-semibold text-ink"
        >
          <span className="link-draw">Meet our partners</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <ul className="marquee flex w-max items-center">
          {loop.map((p, i) => (
            <li
              key={i}
              aria-hidden={i >= partners.length}
              className="flex items-center gap-10 pr-10 font-display text-2xl md:text-3xl text-ink/45 whitespace-nowrap"
            >
              {p.name}
              <span className="h-2 w-2 rounded-full bg-accent/60" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
