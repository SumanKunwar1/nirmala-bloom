import { useEffect, useRef } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, HeartHandshake, Sparkles, Target } from "lucide-react";
import { donationCampaigns } from "@/lib/constants";
import { programGallery, programImages, sharedValues } from "@/lib/images";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { useContent } from "@/lib/admin/context";
import { useAuth } from "@/lib/admin/context";

export const Route = createFileRoute("/programs/$slug")({
  head: () => ({ meta: [{ title: "Program — Nirmala Foundation Nepal" }] }),
  component: ProgramDetail,
});

function ProgramDetail() {
  const { slug } = useParams({ from: "/programs/$slug" });
  const { programs } = useContent();
  const { ready } = useAuth();

  const index = programs.findIndex((x) => x.slug === slug);
  const p = index >= 0 ? programs[index] : undefined;

  // Set the document title client-side (SEO overrides supported).
  useEffect(() => {
    if (p) document.title = p.seoTitle || `${p.title} — Nirmala Foundation Nepal`;
  }, [p]);

  const navRef = useRef<HTMLElement>(null);
  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const stickyH = navRef.current?.offsetHeight ?? 56;
    const y = el.getBoundingClientRect().top + window.scrollY - (74 + stickyH + 16);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  // Always open at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  if (!p) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          {ready ? (
            <>
              <h1 className="font-display text-3xl">Program not found</h1>
              <Link to="/programs" className="mt-4 inline-block text-primary">
                All programs →
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
  const gallery = p.gallery?.length ? p.gallery : programGallery[p.slug] ?? [];
  const campaign = donationCampaigns.find((c) => c.slug === p.donateSlug);
  const prev = programs[(index - 1 + programs.length) % programs.length];
  const next = programs[(index + 1) % programs.length];
  const pct = campaign ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) : 0;

  const sections = [
    { id: "about", label: "About" },
    { id: "goals", label: "Goals" },
    { id: "gallery", label: "Gallery" },
    { id: "support", label: "Support" },
  ];

  return (
    <>
      {/* Immersive hero */}
      <section className="relative flex min-h-[78vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          {image && <img src={image} alt={p.title} className="h-full w-full object-cover ken-burns" />}
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
            <Link to="/programs" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All programs
            </Link>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2 pr-4 backdrop-blur">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg" style={{ color: p.color }}>
                {p.icon}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">Program</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-white md:text-7xl">
              {p.title}
            </h1>
            {p.tagline && <p className="mt-5 text-xl font-medium italic text-white/85 md:text-2xl">"{p.tagline}"</p>}
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{p.desc}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/donate/$slug"
                params={{ slug: p.donateSlug || "general-fund" }}
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

      {/* Sticky in-page nav */}
      <nav ref={navRef} className="sticky top-[74px] z-30 border-b border-border bg-white/85 backdrop-blur-md">
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
          </div>
        </div>
      </nav>

      {/* Stat band */}
      {p.highlights?.length > 0 && (
        <section className="border-b border-border bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-6">
            {p.highlights.slice(0, 3).map((h) => (
              <div key={h.label} className="px-2 py-8 text-center md:py-10">
                <div className="font-mono-stat text-3xl font-bold leading-none md:text-4xl" style={{ color: p.color }}>
                  {h.value}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-text/55 md:text-xs">{h.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Body */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-3 md:py-24">
        <div className="space-y-16 lg:col-span-2">
          <div id="about" className="scroll-mt-32">
            <div className="eyebrow mb-3 text-accent">About this program</div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{p.title}, in a nutshell.</h2>
            {p.body ? (
              <div className="rte-render mt-6 text-lg leading-relaxed text-text/85" dangerouslySetInnerHTML={{ __html: p.body }} />
            ) : (
              <p className="mt-6 text-lg leading-relaxed text-text/85">{p.desc}</p>
            )}
            {gallery[0] && (
              <figure className="mt-8 overflow-hidden rounded-[1.75rem] soft-shadow-lg">
                <div className="relative aspect-[16/9]">
                  <img src={gallery[0]} alt={`${p.title} in action`} loading="lazy" className="absolute inset-0 h-full w-full object-cover ken-burns" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  <figcaption className="absolute bottom-4 left-5 flex items-center gap-2 text-sm font-medium text-white/90">
                    <Sparkles className="h-4 w-4" /> {p.title} · Nirmala Foundation Nepal
                  </figcaption>
                </div>
              </figure>
            )}
          </div>

          {p.goals?.length > 0 && (
            <div id="goals" className="scroll-mt-32">
              <h2 className="heading-rule mb-6 font-display text-3xl font-semibold">Our goals</h2>
              <ul className="space-y-3">
                {p.goals.map((g) => (
                  <li key={g} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4 soft-shadow">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${p.color}18`, color: p.color }}>
                      <Target className="h-4 w-4" />
                    </span>
                    <span className="text-text/85">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gallery.length > 0 && (
            <div id="gallery" className="scroll-mt-32">
              <h2 className="heading-rule mb-6 font-display text-3xl font-semibold">Gallery</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {gallery.map((src, j) => (
                  <div key={j} className={`photo-frame ${j === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
                    <img src={src} alt={`${p.title} activity`} loading="lazy" className="ken-burns" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <div id="support" className="scroll-mt-32 rounded-3xl border p-6" style={{ borderColor: `${p.color}30`, background: `linear-gradient(135deg, ${p.color}12, ${p.color}05)` }}>
            <h3 className="font-display text-xl font-semibold">Support {p.title}</h3>
            <p className="mt-2 mb-5 text-sm text-text/75">{campaign?.desc ?? "Fund equipment, staff, and travel for participants."}</p>
            {campaign && (
              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-text/60">
                  <span>Rs {campaign.raised.toLocaleString()} raised</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                </div>
              </div>
            )}
            <Link
              to="/donate/$slug"
              params={{ slug: p.donateSlug || "general-fund" }}
              className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: p.color }}
            >
              <HeartHandshake className="h-4 w-4" /> Donate now
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6">
            <h3 className="mb-3 font-display text-base font-semibold">What we stand for</h3>
            <ul className="space-y-3">
              {sharedValues.map((v) => (
                <li key={v.label} className="flex items-center gap-3 text-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-pale">{v.icon}</span>
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

      {/* Program CTA */}
      <section className="grain relative overflow-hidden py-20 text-center text-white md:py-24" style={{ background: `linear-gradient(135deg, ${p.color} 0%, #5B2C86 65%, #D9732B 135%)` }}>
        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl font-semibold md:text-5xl" style={{ color: "#fff" }}>
            Help grow {p.title}.
          </h2>
          <p className="mt-4 text-white/85">Volunteer, partner, or donate — every contribution expands what this program can do.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/donate/$slug" params={{ slug: p.donateSlug || "general-fund" }} className="rounded-full bg-white px-8 py-4 font-semibold text-primary transition-transform hover:-translate-y-0.5">
              Donate now
            </Link>
            <Link to="/contact" className="rounded-full border border-white/40 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10">
              Get involved →
            </Link>
          </div>
        </div>
      </section>

      {/* Prev / next */}
      {programs.length > 1 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text/45">Explore more programs</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/programs/$slug" params={{ slug: prev.slug }} className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 soft-shadow transition-shadow hover:soft-shadow-lg">
              <ArrowLeft className="h-5 w-5 shrink-0 text-text/40 transition-colors group-hover:text-primary" />
              <span>
                <span className="block text-[11px] uppercase tracking-[0.16em] text-text/50">Previous</span>
                <span className="font-display font-semibold" style={{ color: prev.color }}>{prev.icon} {prev.title}</span>
              </span>
            </Link>
            <Link to="/programs/$slug" params={{ slug: next.slug }} className="group flex items-center justify-end gap-4 rounded-2xl border border-border bg-white p-5 text-right soft-shadow transition-shadow hover:soft-shadow-lg">
              <span>
                <span className="block text-[11px] uppercase tracking-[0.16em] text-text/50">Next</span>
                <span className="font-display font-semibold" style={{ color: next.color }}>{next.title} {next.icon}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-text/40 transition-colors group-hover:text-primary" />
            </Link>
          </div>
        </section>
      )}

      <ScrollToTop />
    </>
  );
}
