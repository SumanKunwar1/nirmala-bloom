import { useEffect, useRef } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, HeartHandshake, MapPin, Sparkles, Target } from "lucide-react";
import { donationCampaigns, programs } from "@/lib/constants";
import { programGallery, programImages, sharedValues } from "@/lib/images";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const index = programs.findIndex((p) => p.slug === params.slug);
    if (index === -1) throw notFound();
    return { program: programs[index], index };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.program.title} — Nirmala Foundation` : "Program" },
      { name: "description", content: loaderData?.program.desc ?? "" },
    ],
  }),
  component: ProgramDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <h1 className="font-display text-3xl">Program not found</h1>
        <Link to="/programs" className="mt-4 inline-block text-primary">
          All programs →
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
});

function ProgramDetail() {
  const { program: p, index } = Route.useLoaderData();
  const image = programImages[p.slug];
  const gallery = programGallery[p.slug] ?? [];
  const campaign = donationCampaigns.find((c) => c.slug === p.donateSlug);
  const prev = programs[(index - 1 + programs.length) % programs.length];
  const next = programs[(index + 1) % programs.length];
  const pct = campaign ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) : 0;

  const sections = [
    { id: "about", label: "About" },
    { id: "goals", label: "Goals" },
    { id: "activities", label: "What we do" },
    { id: "gallery", label: "Gallery" },
    { id: "support", label: "Support" },
  ];

  const navRef = useRef<HTMLElement>(null);

  // Always open a program details page at the very top (hero first),
  // even when navigating here from far down the programs list.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [p.slug]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const stickyH = navRef.current?.offsetHeight ?? 56;
    const offset = 74 + stickyH + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  return (
    <>
      {/* Immersive full-bleed hero */}
      <section className="relative min-h-[78vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={image} alt={p.title} className="h-full w-full object-cover ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
          <div
            className="absolute inset-0 opacity-70"
            style={{ background: `linear-gradient(120deg, ${p.color}66 0%, transparent 55%)` }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 pt-32 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <Link
              to="/programs"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All programs
            </Link>

            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2 pr-4 backdrop-blur">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg" style={{ color: p.color }}>
                {p.icon}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                Program {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-white md:text-7xl">
              {p.title}
            </h1>
            <p className="mt-5 text-xl font-medium italic text-white/85 md:text-2xl">"{p.tagline}"</p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{p.desc}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/donate/$slug"
                params={{ slug: p.donateSlug }}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white shadow-xl transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: p.color }}
              >
                <HeartHandshake className="h-5 w-5" /> Donate now
              </Link>
              <button
                type="button"
                onClick={() => jump("about")}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Read more
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky in-page section nav */}
      <nav
        ref={navRef}
        aria-label="Section navigation"
        className="sticky top-[74px] z-30 border-b border-border bg-white/85 backdrop-blur-md"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-thin">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jump(s.id)}
                className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold text-text/60 transition-colors hover:bg-primary-pale hover:text-primary"
              >
                {s.label}
              </button>
            ))}
            <Link
              to="/donate/$slug"
              params={{ slug: p.donateSlug }}
              className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-white sm:inline-flex"
              style={{ backgroundColor: p.color }}
            >
              <HeartHandshake className="h-3.5 w-3.5" /> Donate
            </Link>
          </div>
        </div>
      </nav>

      {/* Program stat band */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-6">
          {p.highlights.map((h) => (
            <div key={h.label} className="px-2 py-8 text-center md:py-10">
              <div
                className="font-mono-stat text-3xl font-bold leading-none md:text-4xl"
                style={{ color: p.color }}
              >
                {h.value}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-text/55 md:text-xs">
                {h.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-3 md:py-24">
        <div className="space-y-16 lg:col-span-2">
          {/* About */}
          <div id="about" className="scroll-mt-32">
            <div className="eyebrow mb-3 text-accent">About this program</div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              {p.title}, in a nutshell.
            </h2>
            <div className="mt-6 space-y-4">
              {p.philosophy.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-lg leading-relaxed text-text/85"
                      : "leading-relaxed text-text/75"
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Editorial image break */}
            {gallery[0] && (
              <figure className="mt-8 overflow-hidden rounded-[1.75rem] soft-shadow-lg">
                <div className="relative aspect-[16/9]">
                  <img
                    src={gallery[0]}
                    alt={`${p.title} in action`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover ken-burns"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  <figcaption className="absolute bottom-4 left-5 flex items-center gap-2 text-sm font-medium text-white/90">
                    <Sparkles className="h-4 w-4" /> {p.title} · Nirmala Foundation Nepal
                  </figcaption>
                </div>
              </figure>
            )}
          </div>

          {/* Goals */}
          <div id="goals" className="scroll-mt-32">
            <h2 className="heading-rule mb-6 font-display text-3xl font-semibold">Our goals</h2>
            <ul className="space-y-3">
              {p.goals.map((g) => (
                <li
                  key={g}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4 soft-shadow"
                >
                  <span
                    className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${p.color}18`, color: p.color }}
                  >
                    <Target className="h-4 w-4" />
                  </span>
                  <span className="text-text/85">{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div id="activities" className="scroll-mt-32">
            <h2 className="heading-rule mb-6 font-display text-3xl font-semibold">What we do</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {p.activities.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-border bg-white p-5 soft-shadow transition-shadow hover:soft-shadow-lg"
                >
                  <div
                    className="mb-3 grid h-11 w-11 place-items-center rounded-xl text-xl"
                    style={{ backgroundColor: `${p.color}14` }}
                  >
                    {a.icon}
                  </div>
                  <h3 className="mb-1.5 font-display text-lg font-semibold text-ink">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-text/70">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div>
            <h2 className="heading-rule mb-6 font-display text-3xl font-semibold">
              What participants gain
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-3 text-text/85">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* Gallery */}
          <div id="gallery" className="scroll-mt-32">
            <h2 className="heading-rule mb-6 font-display text-3xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((src, j) => (
                <div
                  key={j}
                  className={`photo-frame ${j === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
                >
                  <img src={src} alt={`${p.title} activity`} loading="lazy" className="ken-burns" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          {/* Donate */}
          <div
            id="support"
            className="scroll-mt-32 rounded-3xl border p-6"
            style={{
              borderColor: `${p.color}30`,
              background: `linear-gradient(135deg, ${p.color}12, ${p.color}05)`,
            }}
          >
            <h3 className="font-display text-xl font-semibold">Support {p.title}</h3>
            <p className="mt-2 mb-5 text-sm text-text/75">
              {campaign?.desc ?? "Fund equipment, staff, and travel for participants."}
            </p>
            {campaign && (
              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-text/60">
                  <span>Rs {campaign.raised.toLocaleString()} raised</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: p.color }}
                  />
                </div>
                <div className="mt-1.5 text-xs text-text/55">
                  Goal Rs {campaign.goal.toLocaleString()} · {campaign.donors} donors
                </div>
              </div>
            )}
            <Link
              to="/donate/$slug"
              params={{ slug: p.donateSlug }}
              className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: p.color }}
            >
              <HeartHandshake className="h-4 w-4" /> Donate now
            </Link>
          </div>

          {/* Where we work */}
          <div className="rounded-3xl border border-border bg-white p-6 soft-shadow">
            <h3 className="mb-4 font-display text-lg font-semibold">Where we work</h3>
            <ul className="space-y-3 text-sm">
              {p.locations.map((loc) => (
                <li key={loc} className="flex items-center gap-3 text-text/80">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-pale text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          {/* Values */}
          <div className="rounded-3xl border border-border bg-white p-6">
            <h3 className="mb-3 font-display text-base font-semibold">What we stand for</h3>
            <ul className="space-y-3">
              {sharedValues.map((v) => (
                <li key={v.label} className="flex items-center gap-3 text-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-pale">
                    {v.icon}
                  </span>
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

      {/* Program-specific donate CTA band */}
      <section
        className="grain relative overflow-hidden py-20 text-center text-white md:py-24"
        style={{ background: `linear-gradient(135deg, ${p.color} 0%, #5B2C86 65%, #D9732B 135%)` }}
      >
        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl font-semibold md:text-5xl" style={{ color: "#fff" }}>
            Help grow {p.title}.
          </h2>
          <p className="mt-4 text-white/85">
            Volunteer, partner, or donate — every contribution expands what this program can do.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/donate/$slug"
              params={{ slug: p.donateSlug }}
              className="rounded-full bg-white px-8 py-4 font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              Donate now
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/40 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Get involved →
            </Link>
          </div>
        </div>
      </section>

      {/* Explore other programs (subtle) */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text/45">
          Explore more programs
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/programs/$slug"
            params={{ slug: prev.slug }}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 soft-shadow transition-shadow hover:soft-shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-text/40 transition-colors group-hover:text-primary" />
            <span>
              <span className="block text-[11px] uppercase tracking-[0.16em] text-text/50">
                Previous
              </span>
              <span className="font-display font-semibold" style={{ color: prev.color }}>
                {prev.icon} {prev.title}
              </span>
            </span>
          </Link>
          <Link
            to="/programs/$slug"
            params={{ slug: next.slug }}
            className="group flex items-center justify-end gap-4 rounded-2xl border border-border bg-white p-5 text-right soft-shadow transition-shadow hover:soft-shadow-lg"
          >
            <span>
              <span className="block text-[11px] uppercase tracking-[0.16em] text-text/50">Next</span>
              <span className="font-display font-semibold" style={{ color: next.color }}>
                {next.title} {next.icon}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-text/40 transition-colors group-hover:text-primary" />
          </Link>
        </div>
      </section>

      <ScrollToTop />
    </>
  );
}
