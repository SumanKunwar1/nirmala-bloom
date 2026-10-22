import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/admin/context";
import { useAuth } from "@/lib/admin/context";
import { campaignImages } from "@/lib/images";
import { DonateButton } from "@/components/shared/DonateButton";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const Route = createFileRoute("/donate/$slug")({
  head: () => ({ meta: [{ title: "Donate — Nirmala Foundation Nepal" }] }),
  component: CampaignDetail,
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
});

function CampaignDetail() {
  const { slug } = useParams({ from: "/donate/$slug" });
  const { campaigns } = useContent();
  const { ready } = useAuth();

  const c = campaigns.find((x) => x.slug === slug);

  // SEO overrides are campaign content, so apply them client-side.
  useEffect(() => {
    if (!c) return;
    document.title = c.seoTitle || `${c.title} — Donate · Nirmala Foundation`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && c.seoDescription) meta.setAttribute("content", c.seoDescription);
  }, [c]);

  // The store seeds instantly then refetches; only 404 once the load settled.
  if (!c) {
    if (!ready) {
      return (
        <div className="min-h-screen grid place-items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-pale border-t-primary" />
        </div>
      );
    }
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <h1 className="text-3xl font-display">Campaign not found</h1>
          <Link to="/donate" className="text-primary mt-4 inline-block">
            All campaigns →
          </Link>
        </div>
      </div>
    );
  }

  const image = c.image || campaignImages[c.slug];
  const pct = c.percent;
  const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;
  const related = campaigns.filter((x) => x.slug !== c.slug && x.published).slice(0, 3);

  return (
    <div
      className="relative"
      style={{
        // Subtle campaign-color wash across the whole page so it feels "inside" this campaign
        background: `linear-gradient(180deg, ${c.color}0A 0%, transparent 25%, ${c.color}06 100%)`,
      }}
    >
      {/* ---------------- FULL-BLEED IMMERSIVE HERO ---------------- */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={image}
            alt={c.title}
            className="w-full h-full object-cover ken-burns"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(26,16,53,0.55) 0%, rgba(26,16,53,0.35) 35%, rgba(26,16,53,0.92) 100%), linear-gradient(135deg, ${c.color}55 0%, transparent 60%)`,
            }}
          />
        </div>

        {/* Top floating back-link */}
        <div className="absolute top-24 inset-x-0 z-10">
          <div className="shell">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 transition-colors"
            >
              <span aria-hidden>←</span> All campaigns
            </Link>
          </div>
        </div>

        {/* Bottom-anchored content */}
        <div className="relative shell pb-16 pt-32 w-full grid lg:grid-cols-12 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 text-white"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur border border-white/20 pl-2 pr-4 py-1.5 mb-5">
              <span
                className="w-8 h-8 rounded-full grid place-items-center text-lg bg-white"
                style={{ color: c.color }}
              >
                {c.icon}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Campaign · {c.donors} donors
              </span>
              {c.urgent && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent text-white rounded-full px-2.5 py-0.5">
                  Urgent
                </span>
              )}
            </div>

            <h1
              className="font-display font-semibold text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight"
              style={{ color: "#fff" }}
            >
              {c.title}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">{c.desc}</p>
          </motion.div>

          {/* Stat / progress card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-white/95 backdrop-blur p-6 sm:p-7 soft-shadow-lg">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-mono-stat font-bold text-ink text-2xl">{fmt(c.raised)}</span>
                <span className="text-text/60 text-xs">raised of {fmt(c.goal)}</span>
              </div>
              <div className="h-3 bg-primary-pale rounded-full overflow-hidden mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c.color}, #D9732B)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-text/60 mt-2">
                <span>
                  <strong className="text-ink">{pct}%</strong> funded
                </span>
                <span>
                  <strong className="text-ink">{c.donors}</strong> donors
                </span>
                <span>
                  <strong className="text-ink">{fmt(c.goal - c.raised)}</strong> to go
                </span>
              </div>

              <DonateButton campaign={c} variant="primary" className="w-full mt-6 px-7 py-4 text-base">
                Donate to this campaign →
              </DonateButton>
              <button className="w-full mt-2 text-xs text-text/55 hover:text-primary transition-colors py-2">
                Share this campaign ↗
              </button>
            </div>
          </motion.div>
        </div>

        {/* Curved bottom transition */}
        <svg
          aria-hidden
          className="absolute bottom-0 inset-x-0 w-full h-12 text-background"
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,50 C480,0 960,0 1440,50 Z" />
        </svg>
      </section>

      {/* ---------------- INSIDE-THE-CAMPAIGN BODY ---------------- */}
      <section className="relative">
        {/* Sticky campaign ribbon */}
        <div
          className="sticky top-20 z-30 backdrop-blur bg-white/85 border-y border-border"
        >
          <div className="shell py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-8 h-8 rounded-full grid place-items-center text-base shrink-0"
                style={{ background: `${c.color}15`, color: c.color }}
              >
                {c.icon}
              </span>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[0.18em] text-text/55 font-semibold">
                  Inside campaign
                </div>
                <div className="font-display text-base font-semibold text-ink truncate" style={{ color: c.color }}>
                  {c.title}
                </div>
              </div>
            </div>
            <DonateButton campaign={c} variant="primary" className="px-5 py-2 text-sm">
              Donate now
            </DonateButton>
          </div>
        </div>

        <div className="shell grid lg:grid-cols-12 gap-12 py-16 lg:py-20">
          <div className="lg:col-span-7 space-y-14">
            <ScrollReveal>
              <SectionMark label="About this campaign" color={c.color} />
              <p className="text-text/85 text-lg leading-relaxed">{c.longDesc}</p>
            </ScrollReveal>

            <ScrollReveal>
              <SectionMark label="Why it matters" color={c.color} />
              <p className="text-text/85 leading-relaxed">{c.why}</p>
            </ScrollReveal>

            <ScrollReveal>
              <SectionMark label="What your gift unlocks" color={c.color} />
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                {c.tiers.map((t) => (
                  <div
                    key={t.amount}
                    className="rounded-2xl border border-border bg-white p-5 soft-shadow flex gap-4"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl grid place-items-center text-white font-mono-stat font-bold shrink-0 text-center leading-tight"
                      style={{
                        background: `linear-gradient(135deg, ${c.color}, #D9732B)`,
                        fontSize: t.amount >= 100000 ? 12 : 13,
                      }}
                    >
                      Rs.
                      <br />
                      {t.amount >= 1000
                        ? `${(t.amount / 1000).toFixed(t.amount % 1000 === 0 ? 0 : 1).replace(".0", "")}k`
                        : t.amount}
                    </div>
                    <div className="text-sm text-text/80 leading-relaxed self-center">{t.impact}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {c.stories.length > 0 && (
              <ScrollReveal>
                <SectionMark label="Stories from the field" color={c.color} />
                <div className="space-y-4 mt-2">
                  {c.stories.map((s) => (
                    <blockquote
                      key={s.name}
                      className="rounded-3xl p-7 border-l-4 relative"
                      style={{
                        borderColor: c.color,
                        background: `linear-gradient(135deg, ${c.color}10, #FEF3E2)`,
                      }}
                    >
                      <span
                        className="absolute -top-3 -left-1 text-6xl font-display leading-none opacity-30"
                        style={{ color: c.color }}
                        aria-hidden
                      >
                        “
                      </span>
                      <p className="font-display italic text-xl text-ink leading-relaxed relative">
                        {s.quote}
                      </p>
                      <footer className="mt-4 text-sm">
                        <div className="font-semibold text-ink">{s.name}</div>
                        <div className="text-text/60">{s.role}</div>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <SectionMark label="From the field" color={c.color} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="photo-frame aspect-square">
                    <img src={image} alt="" loading="lazy" className="ken-burns" />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right column — sticky stats + donate */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-36 space-y-4">
              <div className="rounded-3xl bg-white border border-border p-7 soft-shadow-lg">
                <div className="flex items-baseline justify-between text-sm mb-3">
                  <span className="font-mono-stat font-bold text-ink text-xl">{fmt(c.raised)}</span>
                  <span className="text-text/60 text-xs">of {fmt(c.goal)}</span>
                </div>
                <div className="h-2 bg-primary-pale rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${c.color}, #D9732B)` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-text/60 mt-2">
                  <span>
                    <strong className="text-ink">{pct}%</strong> funded
                  </span>
                  <span>
                    <strong className="text-ink">{c.donors}</strong> donors
                  </span>
                </div>
                <DonateButton campaign={c} variant="primary" className="w-full mt-5 px-7 py-4 text-base">
                  Donate to {c.title} →
                </DonateButton>
                <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-text/55">
                  <span>🔒 Secure</span>
                  <span>·</span>
                  <span>📧 Receipt by email</span>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-border p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text/55 mb-3">
                  Recent supporters
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Ram S.", "Sarah M.", "Anonymous", "Aditi P.", "Bodhi Trust", "Hari B.", "Anonymous", "Maya R."].map(
                    (n) => (
                      <span
                        key={n}
                        className="bg-primary-pale text-primary rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {n}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------------- RELATED ---------------- */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-pale/30">
        <div className="shell">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">More campaigns</div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mt-2">
                Other ways your gift helps.
              </h2>
            </div>
            <Link to="/donate" className="text-primary font-medium hover:underline underline-offset-4">
              All campaigns →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r) => {
              const rPct = r.percent;
              return (
                <Link
                  key={r.slug}
                  to="/donate/$slug"
                  params={{ slug: r.slug }}
                  className="group rounded-3xl bg-white border border-border overflow-hidden soft-shadow hover:soft-shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={r.image || campaignImages[r.slug]}
                      alt={r.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06]"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(180deg, transparent 35%, ${r.color}DD 100%)` }}
                    />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="font-display text-lg font-semibold leading-tight">{r.title}</div>
                      <div className="text-xs text-white/80">{rPct}% funded · {r.donors} donors</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionMark({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="block h-px flex-1 max-w-[60px]" style={{ background: color }} aria-hidden />
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">{label}</h2>
    </div>
  );
}
