import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, MapPin } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { programs } from "@/lib/constants";
import { imgs, programImages } from "@/lib/images";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Our Programs — Nirmala Foundation Nepal" },
      {
        name: "description",
        content:
          "Adaptive sports, inclusive arts, education, mobility, health, and adaptive travel programs across Nepal — designed with, not for, people with disabilities.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const navRef = useRef<HTMLElement>(null);

  const scrollToProgram = (slug: string) => {
    const el = document.getElementById(`program-${slug}`);
    if (!el) return;
    // Fixed site navbar (74px) + the sticky sub-nav's own height, plus a small gap,
    // so the program heading lands cleanly below the bars instead of under them.
    const stickyH = navRef.current?.offsetHeight ?? 60;
    const offset = 74 + stickyH + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Six pathways to inclusion."
        subtitle="From the basketball court to the Everest trail — programs designed with, not for, Nepalis with disabilities."
        image={imgs.pagePrograms}
        imageAlt="Inclusive program activity in Nepal"
        stats={[
          { value: "6", label: "Active programs" },
          { value: "1,200+", label: "Beneficiaries" },
          { value: "15+", label: "Partner sites" },
        ]}
      />

      {/* Sticky quick-nav — jump straight to any program */}
      <nav
        ref={navRef}
        aria-label="Program quick navigation"
        className="sticky top-[74px] z-30 border-b border-border bg-white/85 backdrop-blur-md"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-thin">
            {programs.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => scrollToProgram(p.slug)}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text/70 transition-colors hover:border-primary/30 hover:text-primary"
              >
                <span className="text-base" aria-hidden>
                  {p.icon}
                </span>
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-4 text-center">
        <ScrollReveal>
          <div className="eyebrow text-accent mb-3">Our Programs</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Ability into opportunity.
          </h2>
          <p className="mt-4 text-text/75 leading-relaxed">
            Each program is a doorway into public life — sport, art, learning, movement, health, and
            adventure. Explore any of them below, then open its page for the full story and ways to
            get involved.
          </p>
        </ScrollReveal>
      </section>

      {/* Spacious program sections */}
      <div className="py-14 md:py-20 space-y-20 md:space-y-28">
        {programs.map((p, i) => (
          <section
            key={p.slug}
            id={`program-${p.slug}`}
            className="scroll-mt-36 mx-auto max-w-6xl px-6"
          >
            <ScrollReveal>
              <div
                className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-14 ${
                  i % 2 === 0 ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                {/* Image */}
                <div className="lg:col-span-6">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] soft-shadow-lg">
                    <img
                      src={programImages[p.slug]}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover ken-burns"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(${
                          i % 2 === 0 ? "90deg" : "-90deg"
                        }, transparent 45%, ${p.color}26 100%)`,
                      }}
                    />
                    <div
                      className="absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/95 text-2xl backdrop-blur soft-shadow"
                      style={{ color: p.color }}
                    >
                      {p.icon}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                      {p.locations.slice(0, 2).map((loc) => (
                        <span
                          key={loc}
                          className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-text/70 backdrop-blur"
                        >
                          <MapPin className="h-3 w-3" /> {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div className="lg:col-span-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                    Program {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="font-display text-3xl md:text-4xl font-semibold leading-tight"
                    style={{ color: p.color }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-3 text-lg font-medium text-text/70 italic">"{p.tagline}"</p>
                  <p className="mt-4 leading-relaxed text-text/80">{p.philosophy[0]}</p>

                  {/* Activity chips */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.activities.map((a) => (
                      <span
                        key={a.title}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text/70"
                      >
                        <span aria-hidden>{a.icon}</span>
                        {a.title}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
                    {p.highlights.map((h) => (
                      <div key={h.label}>
                        <div
                          className="font-mono-stat text-2xl font-bold leading-none"
                          style={{ color: p.color }}
                        >
                          {h.value}
                        </div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-text/55">
                          {h.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to="/programs/$slug"
                      params={{ slug: p.slug }}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: p.color }}
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/donate/$slug"
                      params={{ slug: p.donateSlug }}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 font-semibold text-text/80 transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <HeartHandshake className="h-4 w-4" /> Donate
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </section>
        ))}
      </div>

      {/* Closing CTA */}
      <section className="grain relative overflow-hidden bg-gradient-to-br from-primary via-[#5B2C86] to-accent py-24 text-center text-white">
        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl md:text-5xl font-semibold" style={{ color: "#fff" }}>
            Every program needs a partner.
          </h2>
          <p className="mt-4 text-white/85">
            Volunteer your time, partner your organisation, or fund a program directly — inclusion
            is built together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/donate"
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

      <ScrollToTop />
    </>
  );
}
