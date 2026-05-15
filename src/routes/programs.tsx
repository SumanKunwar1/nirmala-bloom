import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { programs } from "@/lib/constants";

export const Route = createFileRoute("/programs")({
  head: () => ({ meta: [
    { title: "Programs — Nirmala Foundation Nepal" },
    { name: "description", content: "Adaptive sports, inclusive arts, education, mobility, health, and community programs across Nepal." },
  ]}),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <PageHero title="Our Programs" subtitle="Six pathways to inclusion, woven into Nepali communities." breadcrumb="Programs" />
      <section className="py-20 mx-auto max-w-6xl px-6 space-y-10">
        {programs.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}>
            <div className="rounded-3xl bg-white border border-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 p-10 grid place-items-center" style={{ background: `linear-gradient(135deg, ${p.color}20, ${p.color}05)` }}>
                <div className="text-9xl">{p.icon}</div>
              </div>
              <div className="lg:col-span-4 p-10">
                <h3 className="font-display text-3xl font-semibold mb-3" style={{ color: p.color }}>{p.title}</h3>
                <p className="text-text/80 leading-relaxed mb-5">{p.desc}</p>
                <span className="inline-block bg-accent-light text-accent rounded-full px-4 py-1 text-sm font-semibold mb-6">+250 beneficiaries</span>
                <div>
                  <Link to="/programs/$slug" params={{ slug: p.slug }} className="inline-block bg-primary text-white rounded-full px-6 py-3 font-semibold hover:scale-105 transition-transform">
                    Learn More →
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-3 p-6 grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="aspect-square rounded-xl grain" style={{ background: `linear-gradient(${45 + j * 30}deg, ${p.color}, #F97316)` }} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>
    </>
  );
}
