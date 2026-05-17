import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { programs } from "@/lib/constants";
import { imgs, programImages } from "@/lib/images";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Nirmala Foundation Nepal" },
      {
        name: "description",
        content: "Adaptive sports, inclusive arts, education, mobility, health, and community programs across Nepal.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Programs"
        title="Six pathways to inclusion."
        subtitle="From the basketball court to the classroom — programs designed with, not for, Nepalis with disabilities."
        breadcrumb="Programs"
        image={imgs.pagePrograms}
        imageAlt="Inclusive program activity in Nepal"
        stats={[
          { value: "6", label: "Active programs" },
          { value: "1,200+", label: "Beneficiaries" },
          { value: "15+", label: "Partner sites" },
        ]}
      />

      <section className="py-24 mx-auto max-w-6xl px-6 space-y-12">
        {programs.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.04}>
            <div
              className={`rounded-3xl bg-white border border-border overflow-hidden soft-shadow hover:soft-shadow-lg transition-shadow grid lg:grid-cols-12 ${
                i % 2 === 0 ? "" : "lg:[&>*:first-child]:order-2"
              }`}
            >
              <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <img
                  src={programImages[p.slug]}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover ken-burns"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${i % 2 === 0 ? "90deg" : "-90deg"}, transparent 40%, ${p.color}30 100%)`,
                  }}
                />
                <div
                  className="absolute top-5 left-5 w-14 h-14 rounded-2xl grid place-items-center text-2xl bg-white/95 backdrop-blur soft-shadow"
                  style={{ color: p.color }}
                >
                  {p.icon}
                </div>
              </div>
              <div className="lg:col-span-6 p-8 md:p-10 flex flex-col justify-center">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                  Program {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-semibold mb-3" style={{ color: p.color }}>
                  {p.title}
                </h3>
                <p className="text-text/80 leading-relaxed mb-6">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mb-7">
                  <span className="inline-block bg-accent-light text-accent rounded-full px-4 py-1 text-xs font-semibold">
                    +250 beneficiaries
                  </span>
                  <span className="inline-block bg-primary-pale text-primary rounded-full px-4 py-1 text-xs font-semibold">
                    Year-round
                  </span>
                  <span className="inline-block bg-green-light text-green rounded-full px-4 py-1 text-xs font-semibold">
                    Kathmandu Valley +
                  </span>
                </div>
                <div>
                  <Link
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
                  >
                    Learn more <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>
    </>
  );
}
