import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/shared/PageHero";
import { programs } from "@/lib/constants";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = programs.find((p) => p.slug === params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.program.title} — Nirmala Foundation` : "Program" },
    { name: "description", content: loaderData?.program.desc ?? "" },
  ]}),
  component: ProgramDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center"><div className="text-center"><h1 className="text-3xl font-display">Program not found</h1><Link to="/programs" className="text-primary mt-4 inline-block">All programs →</Link></div></div>
  ),
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
});

function ProgramDetail() {
  const { program: p } = Route.useLoaderData();
  return (
    <>
      <section className="relative pt-32 pb-20 grain" style={{ background: `linear-gradient(135deg, ${p.color} 0%, #1A1035 100%)` }}>
        <div className="mx-auto max-w-6xl px-6">
          <Link to="/programs" className="text-white/70 text-sm hover:text-white">← All Programs</Link>
          <div className="text-7xl mt-6">{p.icon}</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mt-4" style={{ color: "#fff" }}>{p.title}</h1>
          <p className="mt-4 text-xl text-white/85 max-w-2xl">{p.desc}</p>
        </div>
      </section>

      <section className="py-20 mx-auto max-w-6xl px-6 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="font-display text-3xl font-semibold heading-rule mb-6">About this program</h2>
            <p className="text-text/80 leading-relaxed">Our {p.title.toLowerCase()} program partners with local schools, community centres, and clinics across Kathmandu Valley to deliver year-round inclusive programming. From weekly training sessions to seasonal camps, we meet beneficiaries where they are.</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold heading-rule mb-6">Activities</h2>
            <ul className="space-y-3 text-text/80">
              {["Weekly group sessions", "Seasonal training camps", "Equipment distribution", "Family & coach workshops"].map((a) => (
                <li key={a} className="flex gap-3"><span className="text-accent">●</span>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold heading-rule mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="aspect-square rounded-xl grain" style={{ background: `linear-gradient(${45 + j * 50}deg, ${p.color}, #F97316)` }} />
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border p-6 bg-primary-pale/40">
            <h3 className="font-display text-xl font-semibold">Support this work</h3>
            <p className="text-text/75 text-sm mt-2 mb-4">Fund equipment, coaches, and travel for participants.</p>
            <Link to="/donate" className="block w-full text-center bg-accent text-white rounded-full px-6 py-3 font-semibold">Donate to {p.title}</Link>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-display text-xl font-semibold mb-3">Impact</h3>
            <div className="space-y-3 text-sm">
              <div><div className="text-2xl font-mono-stat font-bold text-primary">250+</div><div className="text-text/60">beneficiaries this year</div></div>
              <div><div className="text-2xl font-mono-stat font-bold text-primary">12</div><div className="text-text/60">partner sites</div></div>
            </div>
          </div>
        </aside>
      </section>

      <section className="py-20 grain text-center text-white" style={{ background: `linear-gradient(135deg, ${p.color}, #6B2FA0)` }}>
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl font-semibold" style={{ color: "#fff" }}>Get involved</h2>
          <p className="mt-3 text-white/85">Volunteer, partner, or donate to help expand this program.</p>
          <Link to="/contact" className="mt-6 inline-block bg-white text-primary rounded-full px-8 py-4 font-semibold">Contact us →</Link>
        </div>
      </section>
    </>
  );
}
