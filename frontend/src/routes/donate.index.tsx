import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DonationCampaignCard } from "@/components/shared/DonationCampaignCard";
import { DonateButton } from "@/components/shared/DonateButton";
import { ScrollReveal, containerVariants, itemVariants } from "@/components/shared/ScrollReveal";
import { useContent } from "@/lib/admin/context";
import { http } from "@/lib/api";
import { campaignImages, imgs } from "@/lib/images";

export const Route = createFileRoute("/donate/")({
  head: () => ({
    meta: [
      { title: "Donate — Nirmala Foundation Nepal" },
      {
        name: "description",
        content: "Fund wheelchairs, sports equipment, education and health for Nepalis with disabilities.",
      },
    ],
  }),
  component: DonatePage,
});

const impactPoints = [
  { amount: "Rs. 500", icon: "🩹", text: "Medicines for one rural patient" },
  { amount: "Rs. 2,500", icon: "🎒", text: "Stationery & braille kit for a child" },
  { amount: "Rs. 10,000", icon: "🏀", text: "Training day for a sports squad" },
  { amount: "Rs. 25,000", icon: "🦽", text: "One fitted manual wheelchair" },
];

const otherWays = [
  {
    icon: "🔁",
    title: "Recurring donor",
    text: "Become a monthly supporter. Predictable funding is the most powerful gift we receive.",
    cta: "Set up monthly",
  },
  {
    icon: "🎁",
    title: "In-kind giving",
    text: "Donate equipment, art supplies, computers, or transport. Get in touch to coordinate.",
    cta: "See needs list",
  },
  {
    icon: "🤝",
    title: "Corporate sponsorship",
    text: "Sponsor a tournament, a camp, or a school year. Co-branded reporting included.",
    cta: "Partner with us",
  },
];

type DonorWall = { donors: { name: string; date: string }[]; anonymousCount: number };

function DonatePage() {
  const { campaigns } = useContent();

  const live = campaigns.filter((c) => c.published);
  const featured =
    live.find((c) => c.featured && c.urgent) ?? live.find((c) => c.urgent) ?? live.find((c) => c.featured) ?? live[0];
  const generalFund = live.find((c) => c.slug === "general-fund");

  // Real supporters, newest first. Falls back to an empty wall if unreachable.
  const [wall, setWall] = useState<DonorWall>({ donors: [], anonymousCount: 0 });
  useEffect(() => {
    let alive = true;
    http
      .get<DonorWall>("/donations/donors?limit=24", { auth: false })
      .then((d) => alive && setWall(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Giving tiers are campaign content, so an admin can edit what each buys.
  const tiers = (featured?.tiers ?? []).slice(0, 4);
  const points = tiers.length
    ? tiers.map((t, i) => ({
        amount: `Rs. ${t.amount.toLocaleString()}`,
        icon: impactPoints[i % impactPoints.length].icon,
        text: t.impact,
      }))
    : impactPoints;

  if (!featured) return null;

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Every gift becomes belonging."
        subtitle="Whether Rs. 500 or Rs. 50,000 — your donation funds dignity, mobility and joy for Nepalis with disabilities."
        breadcrumb="Donate"
        image={imgs.pageDonate}
        imageAlt="Funding inclusion in Nepal"
        stats={[
          { value: String(live.length), label: "Live campaigns" },
          { value: "1,200+", label: "Lives touched" },
          { value: "100%", label: "Goes to programs" },
        ]}
      />

      {/* Featured campaign */}
      <section className="py-20 mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="relative rounded-[2rem] overflow-hidden soft-shadow-lg border border-border bg-white">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px] overflow-hidden">
                <img
                  src={featured.image || campaignImages[featured.slug]}
                  alt={featured.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover ken-burns"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(120deg, ${featured.color}22 0%, transparent 60%, ${featured.color}55 110%)`,
                  }}
                />
                {featured.urgent && (
                  <span className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 shadow-lg">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    Urgent appeal
                  </span>
                )}
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-3">
                  Featured Campaign
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 text-text/75 leading-relaxed">{featured.longDesc}</p>

                <div className="mt-7">
                  <div className="flex items-baseline justify-between text-sm mb-2">
                    <span className="font-mono-stat font-bold text-ink text-lg">
                      Rs. {featured.raised.toLocaleString()}
                    </span>
                    <span className="text-text/60 text-xs">
                      raised of Rs. {featured.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2.5 bg-primary-pale rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${featured.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${featured.color}, #D9732B)` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text/55 mt-2">
                    <span>
                      <strong className="text-ink">{featured.donors}</strong> donors
                    </span>
                    <span>
                      <strong className="text-ink">{featured.percent}%</strong> funded
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <DonateButton campaign={featured} variant="primary" className="px-7 py-3.5">
                    Donate now <span aria-hidden>→</span>
                  </DonateButton>
                  <Link
                    to="/donate/$slug"
                    params={{ slug: featured.slug }}
                    className="inline-flex items-center gap-2 border-2 border-primary/20 text-primary rounded-full px-7 py-3.5 font-semibold hover:bg-primary-pale transition-colors"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* All campaigns */}
      <section className="pt-4 pb-20 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Active Campaigns"
          title="Where your donation goes"
          subtitle="Pick a campaign that resonates — or contribute to the general fund and we'll route where the need is greatest."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {live.map((c) => (
            <motion.div key={c.id} variants={itemVariants}>
              <DonationCampaignCard campaign={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Impact strip */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 aurora-soft" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Your Impact"
            title="What every rupee unlocks"
            subtitle="Roughly what each tier of giving funds, across our programmes."
            align="center"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {points.map((p, i) => (
              <ScrollReveal key={`${p.amount}-${i}`} delay={i * 0.08}>
                <div className="rounded-3xl bg-white border border-border p-6 soft-shadow hover:soft-shadow-lg transition-shadow h-full">
                  <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl bg-gradient-to-br from-primary-pale to-accent-light mb-4">
                    {p.icon}
                  </div>
                  <div className="font-mono-stat font-bold text-2xl text-primary">{p.amount}</div>
                  <div className="text-text/75 text-sm leading-relaxed mt-1">{p.text}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* General Fund highlight */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="relative rounded-[2rem] overflow-hidden soft-shadow-lg p-10 sm:p-14 text-center aurora-soft">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Quick Donation</div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight mt-2">
                Don&apos;t want to pick? Give to the General Fund.
              </h2>
              <p className="mt-4 text-text/75 leading-relaxed max-w-2xl mx-auto">
                Unrestricted gifts are the most powerful donation an NGO can receive. We allocate them where the
                need is sharpest each month — sometimes a wheelchair, sometimes rent, sometimes a sudden travel
                grant for a national tournament.
              </p>
              <ul className="mt-7 grid sm:grid-cols-2 gap-2 max-w-xl mx-auto text-left text-sm text-text/80">
                {[
                  "Funds rapid response and emergencies",
                  "Covers programme overhead and staff",
                  "Bridges restricted-grant gaps",
                  "Reported quarterly to all donors",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-green-light grid place-items-center text-green text-xs">
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <DonateButton
                  campaign={generalFund}
                  variant="primary"
                  className="px-8 py-4 text-base"
                >
                  Give to the General Fund →
                </DonateButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Other ways to give */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-pale/30">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Other Ways to Give" title="Beyond one-off donations" align="center" />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {otherWays.map((w, i) => (
              <ScrollReveal key={w.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-white border border-border p-7 soft-shadow hover:soft-shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl bg-gradient-to-br from-primary-pale to-accent-light mb-4">
                    {w.icon}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">{w.title}</h3>
                  <p className="text-text/75 text-sm mt-2 leading-relaxed">{w.text}</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 mt-5 text-primary font-medium text-sm hover:gap-2 transition-all"
                  >
                    {w.cta} <span aria-hidden>→</span>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Donor wall */}
      <section className="py-20 bg-primary-pale/30">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading eyebrow="Thank You" title="Our generous donors" align="center" />
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {wall.anonymousCount > 0 && (
              <span className="bg-white border border-border text-primary rounded-full px-5 py-2 text-sm font-medium">
                Anonymous · {wall.anonymousCount} donor{wall.anonymousCount === 1 ? "" : "s"}
              </span>
            )}
            {wall.donors.map((d) => (
              <span
                key={d.name}
                className="bg-white border border-border text-primary rounded-full px-5 py-2 text-sm font-medium hover:soft-shadow transition-shadow"
              >
                {d.name}
              </span>
            ))}
            {wall.donors.length === 0 && wall.anonymousCount === 0 && (
              <p className="text-text/60 text-sm">
                Be the first name on this wall — every gift is acknowledged here unless you ask us not to.
              </p>
            )}
          </div>
          <p className="text-center text-text/60 text-sm mt-8">
            Want your name added — or kept anonymous?{" "}
            <Link to="/contact" className="text-primary underline underline-offset-4">
              Let us know
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
