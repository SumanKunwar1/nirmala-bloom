import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Heart, Users, Handshake } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { imgs, programImages } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Our Work — Nirmala Foundation Nepal" },
      {
        name: "description",
        content:
          "Adaptive sports, inclusive arts, education, mobility, health, and adaptive travel programs across Nepal — designed with, not for, people with disabilities.",
      },
    ],
  }),
  component: ProgramsPage,
});

const approach = [
  {
    title: "Listen first",
    text: "Every programme starts in the community — with people with disabilities, their families and local leaders naming the barrier that matters most.",
  },
  {
    title: "Co-design",
    text: "Participants shape the format, the schedule and the tools. Staff with lived experience lead delivery, so the work fits real lives.",
  },
  {
    title: "Build to last",
    text: "We train local coaches, teachers and partners so each programme keeps running long after the first season ends.",
  },
];

/** Fixed site navbar height — matches the header in Navbar.tsx. */
const HEADER_H = 74;

function ProgramsPage() {
  const { programs: all } = useContent();
  const programs = all.filter((p) => p.published !== false);
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = useState<string | null>(null);

  const scrollToProgram = (slug: string) => {
    const el = document.getElementById(`program-${slug}`);
    if (!el) return;
    // Fixed site navbar + the sticky sub-nav's own height, plus a small gap,
    // so the program heading lands cleanly below the bars instead of under them.
    const stickyH = navRef.current?.offsetHeight ?? 60;
    const y = el.getBoundingClientRect().top + window.scrollY - (HEADER_H + stickyH + 24);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  const slugsKey = programs.map((p) => p.slug).join("|");

  /** Scroll-spy: highlight the chip for the programme currently in view. */
  useEffect(() => {
    const els = slugsKey
      .split("|")
      .map((slug) => document.getElementById(`program-${slug}`))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id.replace("program-", ""));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slugsKey]);

  /** Keep the active chip visible inside the horizontally scrolling bar. */
  useEffect(() => {
    if (!active) return;
    const bar = barRef.current;
    const chip = chipRefs.current[active];
    if (!bar || !chip) return;
    // Scroll only the bar sideways — scrollIntoView would also nudge the page.
    bar.scrollTo({
      left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <>
      <PageHero
        eyebrow="Our work"
        breadcrumb="Our work"
        title={
          <>
            {programs.length || "Six"} pathways to <span className="serif-em">inclusion.</span>
          </>
        }
        subtitle="From the basketball court to the Everest trail — programmes designed with, not for, Nepalis with disabilities."
        image={imgs.pagePrograms}
        imageAlt="Inclusive programme activity in Nepal"
        stats={[
          { value: String(programs.length || 6), label: "Active programmes" },
          { value: "1,200+", label: "People reached" },
          { value: "15+", label: "Partner sites" },
        ]}
      />

      {/* Sticky programme index */}
      <nav
        ref={navRef}
        aria-label="Programme index"
        className="sticky top-[74px] z-30 mt-14 md:mt-20 border-y border-border bg-background/90 backdrop-blur-xl"
      >
        <div className="shell">
          <div ref={barRef} className="relative flex gap-1 overflow-x-auto py-2.5 no-scrollbar">
            {programs.map((p, i) => {
              const on = active === p.slug;
              return (
                <button
                  key={p.slug}
                  ref={(el) => {
                    chipRefs.current[p.slug] = el;
                  }}
                  type="button"
                  onClick={() => scrollToProgram(p.slug)}
                  aria-current={on ? "true" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    on ? "bg-ink text-white" : "text-ink/65 hover:text-ink hover:bg-ink/[0.05]"
                  }`}
                >
                  <span
                    className={`font-mono-stat text-xs ${on ? "text-white/60" : "text-text/40"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.title}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* How we work */}
      <section className="py-24 md:py-32">
        <div className="shell grid lg:grid-cols-12 gap-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-5">How we work</div>
            <h2 className="display-3">Ability into opportunity — one community at a time.</h2>
          </div>
          <ol className="lg:col-span-8 grid sm:grid-cols-3 gap-8 sm:gap-6">
            {approach.map((a, i) => (
              <li key={a.title} className="border-t border-ink/20 pt-6">
                <ScrollReveal delay={i * 0.08}>
                  <span className="font-mono-stat text-sm text-accent-ink">Step 0{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl">{a.title}</h3>
                  <p className="mt-3 text-text/70 leading-relaxed">{a.text}</p>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Programme chapters */}
      <div className="border-t border-border">
        {programs.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <section
              key={p.slug}
              id={`program-${p.slug}`}
              aria-labelledby={`program-title-${p.slug}`}
              className={`py-20 md:py-28 ${flip ? "bg-sand" : ""}`}
            >
              <div className="shell grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <ScrollReveal className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <Link
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    className="group block relative overflow-hidden rounded-[2rem] aspect-[5/4] bg-plum"
                    aria-label={`Explore ${p.title}`}
                  >
                    <img
                      src={p.image || programImages[p.slug]}
                      alt=""
                      loading="lazy"
                      className="zoom-img absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute top-5 left-5 rounded-full bg-white/90 backdrop-blur px-4 py-1.5 font-mono-stat text-sm text-ink">
                      {String(i + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}
                    </span>
                  </Link>
                </ScrollReveal>

                <ScrollReveal delay={0.1} className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <div className="eyebrow mb-5">Programme {String(i + 1).padStart(2, "0")}</div>
                  <h2 id={`program-title-${p.slug}`} className="display-2">
                    {p.title}
                  </h2>
                  {p.tagline && (
                    <p className="mt-4 font-display text-xl italic text-primary">{p.tagline}</p>
                  )}
                  <p className="mt-5 text-lg text-text/75 leading-relaxed">{p.desc}</p>

                  {p.goals?.length > 0 && (
                    <ul className="mt-7 space-y-3">
                      {p.goals.slice(0, 3).map((g) => (
                        <li key={g} className="flex gap-3 text-text/80">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span className="leading-relaxed">{g}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {p.highlights?.length > 0 && (
                    <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/15 pt-6">
                      {p.highlights.slice(0, 3).map((h) => (
                        <div key={h.label}>
                          <dt className="sr-only">{h.label}</dt>
                          <dd className="font-display text-2xl md:text-3xl text-ink leading-none">
                            {h.value}
                          </dd>
                          <dd className="mt-2 text-xs text-text/55 leading-snug">{h.label}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Link
                      to="/programs/$slug"
                      params={{ slug: p.slug }}
                      className="btn-pill btn-dark"
                    >
                      Explore programme <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/donate/$slug"
                      params={{ slug: p.donateSlug || "general-fund" }}
                      className="group inline-flex items-center gap-2 font-semibold text-ink"
                    >
                      <Heart className="h-4 w-4 text-accent" />
                      <span className="link-draw">Fund this work</span>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          );
        })}
      </div>

      {/* Closing — ways to help */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="shell">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Get involved</div>
            <h2 className="display-2">
              Every programme <span className="serif-em">needs a partner.</span>
            </h2>
            <p className="mt-5 text-lg text-text/70 leading-relaxed">
              Fund a programme, give your time, or bring your organisation alongside — inclusion is
              built together.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Heart,
                title: "Donate",
                text: "Fund equipment, coaching and travel for participants.",
                to: "/donate",
                cta: "Give now",
                dark: true,
              },
              {
                icon: Users,
                title: "Volunteer",
                text: "Coach, tutor, translate or help run a rural camp.",
                to: "/contact",
                cta: "Get in touch",
              },
              {
                icon: Handshake,
                title: "Partner",
                text: "Schools, clinics, companies and NGOs — let's build together.",
                to: "/partners",
                cta: "See partnerships",
              },
            ].map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className={`group flex flex-col rounded-[1.5rem] p-8 min-h-[260px] transition-all hover:-translate-y-1 ${
                  c.dark ? "bg-plum text-white" : "bg-sand hover:bg-white hover:soft-shadow-lg"
                }`}
              >
                <c.icon className={`h-7 w-7 ${c.dark ? "text-accent" : "text-primary"}`} />
                <h3
                  className={`mt-auto pt-10 font-display text-3xl ${c.dark ? "!text-white" : ""}`}
                >
                  {c.title}
                </h3>
                <p className={`mt-2 leading-relaxed ${c.dark ? "text-white/70" : "text-text/70"}`}>
                  {c.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {c.cta}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  );
}
