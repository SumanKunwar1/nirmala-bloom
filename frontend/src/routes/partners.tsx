import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal, containerVariants, itemVariants } from "@/components/shared/ScrollReveal";
import { PartnerLogo } from "@/components/shared/PartnerLogo";
import { imgs, partnerImages } from "@/lib/images";
import { useContent, type PartnerItem } from "@/lib/admin/context";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Nirmala Foundation" },
      {
        name: "description",
        content: "International and national partners advancing disability inclusion in Nepal.",
      },
    ],
  }),
  component: PartnersPage,
});

const filters = ["All", "International", "National", "Strategic", "Programme", "Corporate", "Community", "Media"] as const;
type Filter = (typeof filters)[number];

const benefits = [
  {
    icon: "📣",
    title: "Co-branded storytelling",
    text: "Joint case studies, social posts, and field videos that put your contribution where it counts.",
  },
  {
    icon: "📊",
    title: "Quarterly impact reports",
    text: "Plain-English programme reports with beneficiary counts, photos, and financials. Audit-ready.",
  },
  {
    icon: "🤝",
    title: "On-the-ground access",
    text: "Site visits, volunteer days, founder briefings, and direct introductions to beneficiaries.",
  },
];

const partnershipTypes = [
  { icon: "🧭", title: "Strategic", color: "#5B2C86", text: "Multi-year MOUs co-designing programmes and policy advocacy." },
  { icon: "🎯", title: "Programme", color: "#D9732B", text: "Funding or in-kind support for a specific programme line." },
  { icon: "🏢", title: "Corporate", color: "#0891B2", text: "CSR partnerships, employee giving, matched donations." },
  { icon: "📣", title: "Media", color: "#2D7A4F", text: "Press features, co-produced stories, platform amplification." },
];

function PartnersPage() {
  const { partners } = useContent();
  const [filter, setFilter] = useState<Filter>("All");
  const featured = partners.find((p) => p.featured) ?? partners[0];
  const visible = partners.filter((p) => {
    if (filter === "All") return true;
    return p.region === filter || p.type === filter;
  });

  if (!featured) return null;

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Together, we expand what's possible."
        subtitle="A growing circle of national and international collaborators. Inclusion is faster when we build it side by side."
        image={imgs.pagePartners}
        imageAlt="Partnership and collaboration"
        stats={[
          { value: `${partners.length}+`, label: "Collaborators" },
          { value: "4", label: "Continents" },
          { value: "2024", label: "Founding year" },
        ]}
      />

      {/* ---------------- LOGO WALL ---------------- */}
      <section className="mt-16 md:mt-20 py-16 bg-white border-y border-border">
        <div className="shell text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-text/55">
            Trusted by partners across Nepal & beyond
          </div>
        </div>
        <div className="shell">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {partners.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                title={p.name}
                className="group flex items-center justify-center rounded-2xl bg-white border border-border p-4 aspect-[5/3] soft-shadow hover:soft-shadow-lg transition-all hover:-translate-y-0.5"
              >
                <PartnerLogo partner={p} size="md" variant="plate" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY PARTNER ---------------- */}
      <section className="py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Why Partner With Us"
            title="What partnership looks like."
            subtitle="We work with a small set of partners deeply rather than many partners thinly — and we make the relationship feel that way."
            align="center"
          />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {benefits.map((b, i) => (
              <ScrollReveal key={b.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-white border border-border p-7 soft-shadow hover:soft-shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl bg-gradient-to-br from-primary-pale to-accent-light mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">{b.title}</h3>
                  <p className="text-text/75 text-sm mt-2 leading-relaxed">{b.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED SPOTLIGHT ---------------- */}
      <section className="pb-16">
        <div className="shell">
          <ScrollReveal>
            <div className="relative rounded-[2rem] overflow-hidden soft-shadow-lg border border-border bg-white">
              <div className="grid lg:grid-cols-12">
                {/* Image side */}
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[440px] overflow-hidden">
                  <img
                    src={featured.logo || partnerImages[featured.name]}
                    alt={featured.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover ken-burns"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(120deg, ${featured.color}55 0%, transparent 50%, ${featured.color}88 100%)`,
                    }}
                  />
                  <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: featured.color }} />
                    Featured partner
                  </span>
                </div>

                {/* Content side */}
                <div className="lg:col-span-7 p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-5 mb-5">
                    <PartnerLogo partner={featured} size="lg" variant="plate" />
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
                        {featured.name}
                      </h3>
                      <div className="text-sm text-text/65 mt-1">{featured.tagline}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <PartnerPill color={featured.color}>{featured.region}</PartnerPill>
                    <PartnerPill color={featured.color}>{featured.type}</PartnerPill>
                    <PartnerPill color={featured.color}>Partner since {featured.since}</PartnerPill>
                  </div>
                  <p className="text-text/80 leading-relaxed">{featured.desc}</p>
                  <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-text/55 mb-2">
                      Areas we collaborate on
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {featured.areas.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-primary-pale text-primary text-xs font-semibold px-3 py-1.5"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={featured.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
                    >
                      Visit website <span aria-hidden>↗</span>
                    </a>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 border-2 border-primary/20 text-primary rounded-full px-6 py-3 font-semibold hover:bg-primary-pale transition-colors"
                    >
                      Partner with us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- DIRECTORY ---------------- */}
      <section className="py-16">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <SectionHeading
              eyebrow="Directory"
              title="All our collaborators"
              subtitle="Filter by region or partnership type."
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-primary-pale text-primary hover:bg-primary/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((p) => (
              <motion.div key={p.name} variants={itemVariants}>
                <PartnerCard partner={p} />
              </motion.div>
            ))}
          </motion.div>

          {visible.length === 0 && (
            <div className="text-center py-16 text-text/55">
              No partners match this filter — try another one.
            </div>
          )}
        </div>
      </section>

      {/* ---------------- PARTNERSHIP TYPES ---------------- */}
      <section className="py-24 bg-gradient-to-b from-white to-primary-pale/30">
        <div className="shell">
          <SectionHeading
            eyebrow="Types of Partnership"
            title="Four ways to work together."
            subtitle="Pick the partnership that matches what your organisation does best."
            align="center"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {partnershipTypes.map((t, i) => (
              <ScrollReveal key={t.title} delay={i * 0.06}>
                <div className="group relative rounded-3xl bg-white border border-border p-6 soft-shadow hover:soft-shadow-lg transition-all overflow-hidden h-full">
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ background: `linear-gradient(90deg, ${t.color}, #D9732B)` }}
                  />
                  <div
                    className="w-14 h-14 rounded-2xl grid place-items-center text-2xl mb-4 group-hover:scale-105 transition-transform"
                    style={{ background: `${t.color}15`, color: t.color }}
                  >
                    {t.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-1">{t.title}</h3>
                  <p className="text-text/70 text-sm leading-relaxed">{t.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-12 gap-12 items-start">
          <ScrollReveal className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-3">How It Works</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
              A simple, four-step path.
            </h2>
            <p className="mt-4 text-text/75 leading-relaxed">
              We keep onboarding light. Most partnerships go from first email to signed MOU in under three weeks.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 bg-primary text-white rounded-full px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Start the conversation →
            </Link>
          </ScrollReveal>
          <ol className="lg:col-span-7 space-y-4">
            {[
              {
                t: "Send us a note",
                d: "Use the contact form or email partnerships@nirmalafoundation.org.np with a paragraph about your organisation.",
              },
              {
                t: "30-minute discovery call",
                d: "We map your goals against our programmes and identify where the strongest overlap is.",
              },
              {
                t: "Draft MOU & scope",
                d: "We send a one-page MOU with the partnership type, deliverables, timeline, and reporting cadence.",
              },
              {
                t: "Launch & co-announce",
                d: "Once signed, we co-announce on social and schedule the first programme touchpoint.",
              },
            ].map((s, i) => (
              <ScrollReveal key={s.t} delay={i * 0.05}>
                <div className="flex gap-4 rounded-3xl bg-white border border-border p-5 soft-shadow">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-accent text-white grid place-items-center font-mono-stat font-bold">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink leading-tight">{s.t}</h3>
                    <p className="text-text/70 text-sm mt-1 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative py-24 overflow-hidden grain">
        <div className="absolute inset-0">
          <img src={imgs.heroCommunity} alt="" aria-hidden className="w-full h-full object-cover ken-burns" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(26,16,53,0.92), rgba(107,47,160,0.85) 55%, rgba(249,115,22,0.6))",
            }}
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
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="bg-white text-primary rounded-full px-8 py-4 font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Contact us →
            </Link>
            <a
              href="mailto:partnerships@nirmalafoundation.org.np"
              className="border-2 border-white/40 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
            >
              Email partnerships
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ----------- Partner card ----------- */

function PartnerCard({ partner }: { partner: PartnerItem }) {
  const photo = partner.logo || partnerImages[partner.name];
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl bg-white border border-border overflow-hidden soft-shadow hover:soft-shadow-lg h-full flex flex-col"
    >
      {/* Photo banner */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {photo && (
          <img
            src={photo}
            alt={partner.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${partner.color}33 0%, transparent 35%, ${partner.color}AA 100%)`,
          }}
        />
        <span
          className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1 bg-white/95 backdrop-blur"
          style={{ color: partner.color }}
        >
          {partner.region}
        </span>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="text-[11px] uppercase tracking-[0.2em] font-semibold opacity-90">
            {partner.tagline}
          </div>
        </div>
      </div>

      {/* Logo bar — overlapping the photo */}
      <div className="relative px-6">
        <div className="-mt-9">
          <PartnerLogo partner={partner} size="md" variant="plate" />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pt-3 pb-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl font-semibold text-ink group-hover:text-primary transition-colors">
          {partner.name}
        </h3>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text/55 mt-1">
          {partner.type} · Partner since {partner.since}
        </div>

        <p className="text-text/75 text-sm mt-3 leading-relaxed flex-1">{partner.desc}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {partner.areas.map((a) => (
            <span key={a} className="text-[11px] bg-primary-pale text-primary rounded-full px-2.5 py-1 font-medium">
              {a}
            </span>
          ))}
        </div>

        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all w-fit"
          style={{ color: partner.color }}
        >
          Visit website <span aria-hidden>↗</span>
        </a>
      </div>

      {/* Accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ background: `linear-gradient(90deg, ${partner.color}, #D9732B)` }}
      />
    </motion.article>
  );
}

function PartnerPill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="text-[11px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1"
      style={{ background: `${color}18`, color }}
    >
      {children}
    </span>
  );
}
