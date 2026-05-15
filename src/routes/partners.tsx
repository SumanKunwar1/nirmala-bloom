import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { partners } from "@/lib/constants";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [
    { title: "Partners — Nirmala Foundation" },
    { name: "description", content: "International and national partners advancing disability inclusion in Nepal." },
  ]}),
  component: PartnersPage,
});

function PartnersPage() {
  return (
    <>
      <PageHero title="Partners" subtitle="Together, we expand what's possible." breadcrumb="Partners" />
      <section className="py-20 mx-auto max-w-7xl px-6 space-y-16">
        {[
          { title: "International Partners", list: partners.slice(0, 2) },
          { title: "National Partners", list: partners.slice(2) },
        ].map((g) => (
          <div key={g.title}>
            <SectionHeading eyebrow="Collaborators" title={g.title} />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {g.list.map((p) => (
                <div key={p.name} className="rounded-2xl border border-border bg-white p-6 hover:shadow-lg transition-shadow">
                  <div className="aspect-video rounded-xl bg-primary-pale grid place-items-center text-primary font-display text-lg font-semibold mb-4">{p.name}</div>
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  <p className="text-text/75 text-sm mt-1">{p.desc}</p>
                  <a href="#" className="text-primary text-sm font-medium mt-3 inline-block">Visit website →</a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="py-20 grain text-center text-white" style={{ background: "linear-gradient(135deg, #6B2FA0, #F97316)" }}>
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl md:text-5xl font-semibold" style={{ color: "#fff" }}>Become a partner</h2>
          <p className="mt-3 text-white/90">Organizations, businesses, and institutions — let's build inclusion together.</p>
          <a href="/contact" className="mt-6 inline-block bg-white text-primary rounded-full px-8 py-4 font-semibold">Contact us →</a>
        </div>
      </section>
    </>
  );
}
