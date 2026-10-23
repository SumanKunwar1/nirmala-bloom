import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight, Heart, MapPin, Check, X, Expand } from "lucide-react";
import { donationCampaigns, programs as seedPrograms } from "@/lib/constants";
import { programGallery, programImages } from "@/lib/images";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { useContent, useAuth } from "@/lib/admin/context";

export const Route = createFileRoute("/programs/$slug")({
  head: () => ({ meta: [{ title: "Program | Nirmala Foundation Nepal" }] }),
  component: ProgramDetail,
});

/** Fixed site navbar height — matches the header in Navbar.tsx. */
const HEADER_H = 74;
const ease = [0.22, 1, 0.36, 1] as const;

function ProgramDetail() {
  const { slug } = useParams({ from: "/programs/$slug" });
  const { programs: all, campaigns } = useContent();
  const { ready } = useAuth();
  const programs = all.filter((x) => x.published !== false);

  const index = programs.findIndex((x) => x.slug === slug);
  const p = index >= 0 ? programs[index] : undefined;

  // Set the document title client-side (SEO overrides supported).
  useEffect(() => {
    if (p) document.title = p.seoTitle || `${p.title} | Nirmala Foundation Nepal`;
  }, [p]);

  // Always open at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  const navRef = useRef<HTMLElement>(null);
  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const stickyH = navRef.current?.offsetHeight ?? 56;
    const y = el.getBoundingClientRect().top + window.scrollY - (HEADER_H + stickyH + 24);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  // Long-form extras (activities, outcomes, locations) are not admin-editable
  // yet, so they come from the seed copy for the matching slug.
  const seed = seedPrograms.find((s) => s.slug === slug);
  const gallery = p ? (p.gallery?.length ? p.gallery : (programGallery[p.slug] ?? [])) : [];
  const activities = seed?.activities ?? [];
  const outcomes = seed?.outcomes ?? [];
  const locations = seed?.locations ?? [];

  const sections = [
    { id: "overview", label: "Overview", show: true },
    { id: "what-we-do", label: "What we do", show: activities.length > 0 },
    {
      id: "goals",
      label: "Goals & outcomes",
      show: (p?.goals?.length ?? 0) > 0 || outcomes.length > 0,
    },
    { id: "gallery", label: "Gallery", show: gallery.length > 0 },
    { id: "support", label: "Support", show: true },
  ].filter((s) => s.show);
  const sectionKey = sections.map((s) => s.id).join("|");

  /** Scroll-spy for the in-page nav. */
  const [activeSection, setActiveSection] = useState("overview");
  useEffect(() => {
    if (!p) return;
    const els = sectionKey
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActiveSection(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [p, sectionKey]);

  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!p) {
    return (
      <div className="grid min-h-screen place-items-center px-5 pt-[74px]">
        <div className="text-center">
          {ready ? (
            <>
              <div className="eyebrow no-rule">Not found</div>
              <h1 className="display-2 mt-4">We couldn't find that programme.</h1>
              <Link to="/programs" className="btn-pill btn-dark mt-8">
                See all our work <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3 text-text/60">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              Loading…
            </div>
          )}
        </div>
      </div>
    );
  }

  const image = p.image || programImages[p.slug] || "";
  const donateSlug = p.donateSlug || "general-fund";
  const live =
    campaigns.find((c) => c.slug === donateSlug) ?? campaigns.find((c) => c.programSlug === p.slug);
  const fallback = donationCampaigns.find((c) => c.slug === donateSlug);
  const campaign = live ?? fallback;
  const pct = campaign
    ? Math.min(100, Math.round((campaign.raised / Math.max(1, campaign.goal)) * 100))
    : 0;
  const story = campaign?.stories?.[0];
  const next = programs[(index + 1) % programs.length];
  const prev = programs[(index - 1 + programs.length) % programs.length];
  const number = String(index + 1).padStart(2, "0");

  return (
    <>
      {/* Hero */}
      <section className="pt-[74px]">
        <div className="shell pt-10 md:pt-14 pb-10 md:pb-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 md:mb-12 flex flex-wrap items-center gap-1.5 text-sm text-text/55"
          >
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link to="/programs" className="hover:text-ink transition-colors">
              Our work
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-ink/80">{p.title}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="lg:col-span-7"
            >
              <div className="eyebrow mb-5">
                Programme {number} of {String(programs.length).padStart(2, "0")}
              </div>
              <h1 className="display-1">{p.title}</h1>
              {p.tagline && (
                <p className="mt-5 font-display text-2xl md:text-3xl italic text-primary">
                  {p.tagline}
                </p>
              )}
              <p className="mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-text/75">
                {p.desc}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/donate/$slug"
                  params={{ slug: donateSlug }}
                  className="btn-pill btn-accent btn-lg"
                >
                  <Heart className="h-4 w-4" fill="currentColor" /> Support this programme
                </Link>
                <button
                  type="button"
                  onClick={() => jump("overview")}
                  className="btn-pill btn-outline btn-lg"
                >
                  Learn more
                </button>
              </div>
            </motion.div>

            {p.highlights?.length > 0 && (
              <motion.dl
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
                className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 border-t border-ink/15"
              >
                {p.highlights.slice(0, 3).map((h) => (
                  <div
                    key={h.label}
                    className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between py-5 lg:py-6 gap-x-6 border-b border-ink/15"
                  >
                    <dt className="order-2 text-xs lg:text-sm text-text/60 mt-2 lg:mt-0">
                      {h.label}
                    </dt>
                    <dd className="order-1 font-display text-3xl lg:text-5xl text-ink leading-none tracking-tight">
                      {h.value}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </div>
        </div>

        {image && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="shell"
          >
            <div className="photo-frame aspect-[4/3] sm:aspect-[16/8] lg:aspect-[21/9] rounded-[1.75rem] md:rounded-[2.25rem]">
              <img
                src={image}
                alt={`${p.title} — Nirmala Foundation Nepal`}
                className="ken-burns"
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* Sticky in-page nav */}
      <nav
        ref={navRef}
        aria-label="On this page"
        className="sticky top-[74px] z-30 mt-14 md:mt-20 border-y border-border bg-background/90 backdrop-blur-xl"
      >
        <div className="shell flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jump(s.id)}
                aria-current={activeSection === s.id ? "true" : undefined}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === s.id
                    ? "bg-ink text-white"
                    : "text-ink/65 hover:text-ink hover:bg-ink/[0.05]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="hidden md:block shrink-0">
            <Link
              to="/donate/$slug"
              params={{ slug: donateSlug }}
              className="btn-pill btn-dark btn-sm"
            >
              <Heart className="h-3.5 w-3.5" fill="currentColor" /> Donate
            </Link>
          </div>
        </div>
      </nav>

      {/* Overview */}
      <section id="overview" className="py-20 md:py-28">
        <div className="shell grid lg:grid-cols-12 gap-10 lg:gap-16">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-40 space-y-6">
              <div className="eyebrow">Overview</div>
              <h2 className="display-3">{p.title}, in a nutshell.</h2>
              {locations.length > 0 && (
                <div className="rounded-2xl bg-sand p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text/50">
                    Where we work
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {locations.map((l) => (
                      <li key={l} className="flex items-center gap-2.5 text-ink">
                        <MapPin className="h-4 w-4 text-accent shrink-0" /> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          <div className="lg:col-span-8">
            {p.body ? (
              <div
                className="rte-render rte-lead text-lg leading-[1.8] text-text/80 max-w-[68ch]"
                dangerouslySetInnerHTML={{ __html: p.body }}
              />
            ) : (
              <p className="text-xl leading-relaxed text-ink max-w-[68ch]">{p.desc}</p>
            )}
            {gallery[1] && (
              <figure className="mt-12">
                <div className="photo-frame aspect-[16/9]">
                  <img src={gallery[1]} alt={`${p.title} in action`} loading="lazy" />
                </div>
                <figcaption className="mt-3 text-sm text-text/55">
                  {p.title} · Nirmala Foundation Nepal
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* What we do */}
      {activities.length > 0 && (
        <section id="what-we-do" className="py-20 md:py-28 bg-sand">
          <div className="shell">
            <div className="max-w-2xl mb-12 md:mb-16">
              <div className="eyebrow mb-5">What we do</div>
              <h2 className="display-2">
                The work, <span className="serif-em">week to week.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {activities.map((a, i) => (
                <ScrollReveal key={a.title} delay={i * 0.06}>
                  <div className="h-full rounded-[1.5rem] bg-background p-7 md:p-9 border border-border">
                    <div className="flex items-start justify-between">
                      <span
                        className="grid h-14 w-14 place-items-center rounded-2xl bg-white border border-border text-2xl"
                        aria-hidden
                      >
                        {a.icon}
                      </span>
                      <span className="font-mono-stat text-sm text-text/40">0{i + 1}</span>
                    </div>
                    <h3 className="mt-8 font-display text-2xl">{a.title}</h3>
                    <p className="mt-3 text-text/70 leading-relaxed">{a.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Goals & outcomes */}
      {((p.goals?.length ?? 0) > 0 || outcomes.length > 0) && (
        <section id="goals" className="py-20 md:py-28">
          <div className="shell grid lg:grid-cols-2 gap-14 lg:gap-20">
            {p.goals?.length > 0 && (
              <div>
                <div className="eyebrow mb-5">Our goals</div>
                <h2 className="display-3">What we set out to change.</h2>
                <ol className="mt-10 border-t border-ink/15">
                  {p.goals.map((g, i) => (
                    <li
                      key={g}
                      className="grid grid-cols-[3rem_1fr] gap-4 py-6 border-b border-border"
                    >
                      <span className="font-mono-stat text-sm text-accent-ink pt-1">0{i + 1}</span>
                      <span className="text-lg text-ink leading-relaxed">{g}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {outcomes.length > 0 && (
              <div>
                <div className="eyebrow mb-5">Outcomes</div>
                <h2 className="display-3">What participants walk away with.</h2>
                <ul className="mt-10 space-y-3">
                  {outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-4 rounded-2xl bg-sand px-5 py-5">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-white">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <span className="text-lg text-ink leading-relaxed">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-20 md:py-28 border-t border-border">
          <div className="shell">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
              <div>
                <div className="eyebrow mb-5">Gallery</div>
                <h2 className="display-2">In pictures.</h2>
              </div>
              <p className="text-text/60">{gallery.length} photos · tap to enlarge</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[220px] gap-3 md:gap-4">
              {gallery.slice(0, GALLERY_TILES).map((src, j, shown) => {
                // The last tile stands in for every photo that didn't fit.
                const hidden = j === GALLERY_TILES - 1 ? gallery.length - GALLERY_TILES : 0;
                return (
                  <button
                    key={src + j}
                    type="button"
                    onClick={() => setLightbox(j)}
                    aria-label={
                      hidden > 0
                        ? `View all ${gallery.length} photos`
                        : `Open photo ${j + 1} of ${gallery.length}`
                    }
                    className={`group relative overflow-hidden rounded-2xl bg-sand ${gallerySpan(j, shown.length)}`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="zoom-img absolute inset-0 h-full w-full object-cover"
                    />
                    {hidden > 0 ? (
                      <span className="absolute inset-0 grid place-items-center bg-plum/60 text-white transition-colors group-hover:bg-plum/70">
                        <span className="text-center">
                          <span className="block font-display text-4xl md:text-5xl leading-none">
                            +{hidden}
                          </span>
                          <span className="mt-2 block text-sm text-white/80">more photos</span>
                        </span>
                      </span>
                    ) : (
                      <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                        <Expand className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Support */}
      <section id="support" className="py-16 md:py-24">
        <div className="px-3 md:px-5">
          <div className="aurora-deep grain rounded-[1.75rem] md:rounded-[2.5rem] text-white">
            <div className="shell relative py-16 md:py-24 grid lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-6">
                <div className="eyebrow !text-accent-light mb-6">Support this programme</div>
                <h2 className="display-2 !text-white">
                  Help grow <span className="serif-em on-dark">{p.title}.</span>
                </h2>
                <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg">
                  {campaign?.desc ??
                    "Fund equipment, staff and travel so more people can take part."}
                </p>

                {campaign && (
                  <div className="mt-10 max-w-lg">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="font-display text-4xl leading-none">
                          Rs {campaign.raised.toLocaleString()}
                        </div>
                        <div className="mt-2 text-sm text-white/60">
                          raised of Rs {campaign.goal.toLocaleString()} goal
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl leading-none">{pct}%</div>
                        <div className="mt-2 text-sm text-white/60">{campaign.donors} donors</div>
                      </div>
                    </div>
                    <div
                      className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Funding progress"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </div>
                )}

                {story && (
                  <figure className="mt-12 border-l-2 border-accent pl-6 max-w-lg">
                    <blockquote className="font-display text-xl md:text-2xl italic leading-snug text-white">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-sm text-white/60">
                      {story.name} · {story.role}
                    </figcaption>
                  </figure>
                )}
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-[1.5rem] bg-white text-ink p-6 md:p-8">
                  <div className="font-display text-2xl">What your gift does</div>
                  {campaign?.tiers?.length ? (
                    <ul className="mt-6 divide-y divide-border">
                      {campaign.tiers.map((t) => (
                        <li key={t.amount}>
                          <Link
                            to="/donate/$slug"
                            params={{ slug: donateSlug }}
                            className="group flex items-center justify-between gap-4 py-4"
                          >
                            <span className="min-w-0">
                              <span className="block font-display text-xl">
                                Rs {t.amount.toLocaleString()}
                              </span>
                              <span className="block text-sm text-text/65">{t.impact}</span>
                            </span>
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-colors group-hover:bg-accent group-hover:border-accent group-hover:text-white">
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-text/70">
                      Every rupee goes to participants, equipment and coaching.
                    </p>
                  )}
                  <Link
                    to="/donate/$slug"
                    params={{ slug: donateSlug }}
                    className="btn-pill btn-accent btn-lg w-full mt-6"
                  >
                    <Heart className="h-4 w-4" fill="currentColor" /> Donate to {p.title}
                  </Link>
                  <Link
                    to="/contact"
                    className="mt-4 block text-center text-sm text-text/60 hover:text-ink"
                  >
                    Or volunteer your time →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next programme */}
      {programs.length > 1 && (
        <section className="pb-24 md:pb-32">
          <div className="shell">
            <Link
              to="/programs/$slug"
              params={{ slug: next.slug }}
              className="group relative block overflow-hidden rounded-[2rem] bg-plum min-h-[320px] md:min-h-[380px]"
            >
              <img
                src={next.image || programImages[next.slug]}
                alt=""
                loading="lazy"
                className="zoom-img absolute inset-0 h-full w-full object-cover opacity-60"
              />
              <span className="absolute inset-0 bg-gradient-to-r from-plum via-plum/70 to-transparent" />
              <span className="relative flex h-full min-h-[320px] md:min-h-[380px] flex-col justify-end p-8 md:p-14 text-white">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                  Next programme
                </span>
                <span className="mt-4 flex items-center gap-5">
                  <span className="display-2 !text-white">{next.title}</span>
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-2">
                    <ArrowRight className="h-6 w-6" />
                  </span>
                </span>
                {next.tagline && (
                  <span className="mt-3 font-display text-xl italic text-white/75">
                    {next.tagline}
                  </span>
                )}
              </span>
            </Link>
            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                to="/programs/$slug"
                params={{ slug: prev.slug }}
                className="group inline-flex items-center gap-2 font-semibold text-ink"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="link-draw">{prev.title}</span>
              </Link>
              <Link
                to="/programs"
                className="group inline-flex items-center gap-2 font-semibold text-ink"
              >
                <span className="link-draw">All programmes</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Lightbox images={gallery} index={lightbox} onChange={setLightbox} title={p.title} />
      <ScrollToTop />
    </>
  );
}

/** Photos shown in the gallery grid; the rest sit behind a "+N" tile. */
const GALLERY_TILES = 5;

/**
 * Tile sizes for the gallery mosaic (at most GALLERY_TILES photos) so every
 * row fills: the first photo is a 2×2 feature and the others share the two
 * rows beside it (4 columns on desktop, 2 on mobile).
 */
function gallerySpan(j: number, n: number) {
  if (j === 0) return "col-span-2 row-span-2";
  const classes: string[] = [];
  // Mobile: photos 1..n-1 sit in pairs; an odd one out goes full width.
  if ((n - 1) % 2 === 1 && j === n - 1) classes.push("col-span-2");
  // Desktop: widen tiles so the 2×2 block beside the feature is always full.
  if (n === 2) classes.push("md:col-span-2 md:row-span-2");
  if (n === 3) classes.push("md:col-span-2");
  if (n === 4 && j === 3) classes.push("md:col-span-2");
  return classes.join(" ");
}

/** Full-screen photo viewer with keyboard (←/→/Esc) support. */
function Lightbox({
  images,
  index,
  onChange,
  title,
}: {
  images: string[];
  index: number | null;
  onChange: (i: number | null) => void;
  title: string;
}) {
  const count = images.length;
  const step = useCallback(
    (d: number) => onChange(index === null ? null : (index + d + count) % count),
    [index, count, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onChange, step]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo ${index + 1} of ${count}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-plum/95 backdrop-blur-sm flex flex-col"
          onClick={() => onChange(null)}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white/70 text-sm">
            <span className="font-mono-stat tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => onChange(null)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white hover:bg-white hover:text-ink transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div
            className="relative flex-1 flex items-center justify-center px-4 pb-8 md:px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${title} — photo ${index + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-h-[80vh] max-w-full rounded-2xl object-contain"
              />
            </AnimatePresence>
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => step(-1)}
                  className="absolute left-3 md:left-6 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white hover:text-ink transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => step(1)}
                  className="absolute right-3 md:right-6 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white hover:text-ink transition-colors"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
