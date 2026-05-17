import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { programs } from "@/lib/constants";
import { programImages, sharedValues } from "@/lib/images";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = programs.find((p) => p.slug === params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.program.title} — Nirmala Foundation` : "Program" },
      { name: "description", content: loaderData?.program.desc ?? "" },
    ],
  }),
  component: ProgramDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-display">Program not found</h1>
        <Link to="/programs" className="text-primary mt-4 inline-block">
          All programs →
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
});

function ProgramDetail() {
  const { program: p } = Route.useLoaderData();
  const image = programImages[p.slug];

  return (
    <>
      <section className="relative overflow-hidden aurora-soft pt-28 md:pt-36 pb-14 md:pb-20">
        <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-sm text-text/60 mb-5 hover:text-primary transition-colors"
            >
              <span aria-hidden>←</span> All programs
            </Link>
            <div
              className="inline-flex items-center gap-3 rounded-full bg-white/80 backdrop-blur border border-primary/15 pl-2 pr-4 py-1.5 mb-5"
            >
              <span className="w-8 h-8 rounded-full grid place-items-center text-lg bg-gradient-to-br from-primary-pale to-accent-light">
                {p.icon}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Program</span>
            </div>
            <h1
              className="font-display font-semibold text-4xl md:text-6xl leading-[1.05] tracking-tight"
              style={{ color: p.color }}
            >
              {p.title}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-text/75 max-w-2xl leading-relaxed">{p.desc}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/80 border border-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                +250 beneficiaries
              </span>
              <span className="rounded-full bg-white/80 border border-primary/10 px-4 py-2 text-xs font-semibold text-accent">
                12 partner sites
              </span>
              <span className="rounded-full bg-white/80 border border-primary/10 px-4 py-2 text-xs font-semibold text-green">
                Year-round
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-5 relative h-[280px] md:h-[380px]"
          >
            <div className="photo-frame absolute inset-0">
              <img src={image} alt={p.title} className="ken-burns" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 mx-auto max-w-6xl px-6 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="font-display text-3xl font-semibold heading-rule mb-6">About this program</h2>
            <p className="text-text/80 leading-relaxed">
              Our {p.title.toLowerCase()} program partners with local schools, community centres, and clinics across
              Kathmandu Valley to deliver year-round inclusive programming. From weekly training sessions to seasonal
              camps, we meet beneficiaries where they are.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold heading-rule mb-6">Activities</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Weekly group sessions", icon: "🗓️" },
                { label: "Seasonal training camps", icon: "⛺" },
                { label: "Equipment distribution", icon: "🎁" },
                { label: "Family & coach workshops", icon: "🤝" },
              ].map((a) => (
                <li
                  key={a.label}
                  className="rounded-2xl bg-white border border-border p-4 flex items-center gap-3 soft-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-pale to-accent-light grid place-items-center text-lg">
                    {a.icon}
                  </div>
                  <span className="text-text/85 text-sm leading-tight">{a.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold heading-rule mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="photo-frame aspect-square">
                  <img src={image} alt="" loading="lazy" className="ken-burns" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-pale/60 to-accent-light/60 p-6">
            <h3 className="font-display text-xl font-semibold">Support this work</h3>
            <p className="text-text/75 text-sm mt-2 mb-5">
              Fund equipment, coaches, and travel for participants.
            </p>
            <Link
              to="/donate"
              className="block w-full text-center bg-accent text-white rounded-full px-6 py-3 font-semibold shadow-md shadow-orange-200 hover:-translate-y-0.5 transition-transform"
            >
              Donate to {p.title}
            </Link>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 soft-shadow">
            <h3 className="font-display text-xl font-semibold mb-4">Impact</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-3xl font-mono-stat font-bold text-primary">250+</div>
                <div className="text-text/60">beneficiaries this year</div>
              </div>
              <div>
                <div className="text-3xl font-mono-stat font-bold text-accent">12</div>
                <div className="text-text/60">partner sites</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6">
            <h3 className="font-display text-base font-semibold mb-3">What we stand for</h3>
            <ul className="space-y-3">
              {sharedValues.map((v) => (
                <li key={v.label} className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-xl bg-primary-pale grid place-items-center">{v.icon}</span>
                  <span>
                    <span className="font-semibold text-ink">{v.label}</span>
                    <span className="text-text/60"> — {v.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section
        className="py-24 grain text-center text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${p.color} 0%, #6B2FA0 60%, #F97316 130%)`,
        }}
      >
        <div className="mx-auto max-w-3xl px-6 relative">
          <h2 className="font-display text-4xl md:text-5xl font-semibold" style={{ color: "#fff" }}>
            Get involved.
          </h2>
          <p className="mt-3 text-white/85">Volunteer, partner, or donate to help expand this program.</p>
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
