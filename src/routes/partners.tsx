import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { partners } from "@/lib/constants";
import { imgs } from "@/lib/images";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Nirmala Foundation" },
      { name: "description", content: "International and national partners advancing disability inclusion in Nepal." },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Together, we expand what's possible."
        subtitle="A growing circle of national and international collaborators. Inclusion is faster when we build it side by side."
        breadcrumb="Partners"
        image={imgs.pagePartners}
        imageAlt="Partnership and collaboration"
        stats={[
          { value: "15+", label: "Collaborators" },
          { value: "4", label: "Continents" },
        ]}
      />

      <section className="py-24 mx-auto max-w-7xl px-6 space-y-16">
        {[
          { title: "International Partners", list: partners.slice(0, 2), color: "#6B2FA0" },
          { title: "National Partners", list: partners.slice(2), color: "#F97316" },
        ].map((g) => (
          <ScrollReveal key={g.title}>
            <SectionHeading eyebrow="Collaborators" title={g.title} />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {g.list.map((p) => (
                <article
                  key={p.name}
                  className="group rounded-3xl border border-border bg-white p-6 soft-shadow hover:soft-shadow-lg transition-shadow"
                >
                  <div
                    className="aspect-video rounded-2xl bg-gradient-to-br from-primary-pale to-accent-light grid place-items-center text-primary font-display text-lg font-semibold mb-4 text-center px-4"
                  >
                    {p.name}
                  </div>
                  <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-text/75 text-sm mt-1 leading-relaxed">{p.desc}</p>
                  <a
                    href="#"
                    className="text-primary text-sm font-medium mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Visit website <span aria-hidden>→</span>
                  </a>
                </article>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden grain">
        <div className="absolute inset-0">
          <img src={imgs.heroCommunity} alt="" aria-hidden className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(26,16,53,0.92), rgba(107,47,160,0.85) 55%, rgba(249,115,22,0.6))" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.18em] mb-5">
            Join Our Network
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold" style={{ color: "#fff" }}>
            Become a partner.
          </h2>
          <p className="mt-3 text-white/85">
            Organizations, businesses, and institutions — let&apos;s build inclusion together.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-block bg-white text-primary rounded-full px-8 py-4 font-semibold hover:-translate-y-0.5 transition-transform"
          >
            Contact us →
          </Link>
        </div>
      </section>
    </>
  );
}
