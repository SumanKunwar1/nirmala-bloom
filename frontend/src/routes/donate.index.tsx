import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Plus, Repeat, Gift, Building2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DonationCampaignCard } from "@/components/shared/DonationCampaignCard";
import { DonateButton } from "@/components/shared/DonateButton";
import { GivingCard } from "@/components/shared/GivingCard";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { useContent } from "@/lib/admin/context";
import { http } from "@/lib/api";
import { campaignImages } from "@/lib/images";

export const Route = createFileRoute("/donate/")({
  head: () => ({
    meta: [
      { title: "Donate | Nirmala Foundation Nepal" },
      {
        name: "description",
        content:
          "Fund wheelchairs, sports equipment, education and health for Nepalis with disabilities.",
      },
    ],
  }),
  component: DonatePage,
});

const faqs = [
  {
    q: "Is my donation secure?",
    a: "Yes. Card and wallet details are entered on the payment provider's own secure page — they never pass through or get stored on our site.",
  },
  {
    q: "Will I get a receipt?",
    a: "A receipt is emailed to you as soon as your payment is confirmed. Keep it for your records.",
  },
  {
    q: "Can I give monthly?",
    a: "Yes — choose “Monthly” before you donate. Regular gifts let us plan programmes a season ahead. Get in touch any time to change or stop it.",
  },
  {
    q: "Where does my money go?",
    a: "Campaign gifts go to that campaign's programme. General Fund gifts go where the need is sharpest that month — from a wheelchair to a travel grant to keeping a camp running.",
  },
  {
    q: "Can I donate from outside Nepal?",
    a: "Yes. Choose your currency on the next step and we'll show the payment options that work internationally.",
  },
];

type DonorWall = { donors: { name: string; date: string }[]; anonymousCount: number };

const ease = [0.22, 1, 0.36, 1] as const;

function DonatePage() {
  const { campaigns } = useContent();

  const live = campaigns.filter((c) => c.published);
  const generalFund = live.find((c) => c.slug === "general-fund");
  const featured =
    live.find((c) => c.featured && c.urgent) ??
    live.find((c) => c.urgent) ??
    live.find((c) => c.featured) ??
    live[0];
  const others = live.filter((c) => c.slug !== featured?.slug);

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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Hero — the quickest way to give sits right here */}
      <section className="pt-[74px]">
        <div className="shell pt-10 md:pt-14 pb-20 md:pb-28">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 md:mb-12 flex items-center gap-1.5 text-sm text-text/55"
          >
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-ink/80">Donate</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="lg:col-span-7 lg:pt-6"
            >
              <div className="eyebrow mb-5">Donate</div>
              <h1 className="display-1">
                Every gift becomes <span className="serif-em">belonging.</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl leading-relaxed text-text/75 max-w-xl">
                Whether Rs 500 or Rs 50,000 — your donation funds dignity, mobility and joy for
                Nepalis with disabilities.
              </p>

              <dl className="mt-10 grid grid-cols-3 gap-4 max-w-lg border-t border-ink/15 pt-6">
                {[
                  { value: String(live.length), label: "Live campaigns" },
                  { value: "1,200+", label: "Lives touched" },
                  { value: "100%", label: "Goes to programmes" },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-3xl md:text-4xl text-ink leading-none">
                      {s.value}
                    </dd>
                    <dd className="mt-2 text-xs text-text/55">{s.label}</dd>
                  </div>
                ))}
              </dl>

              <a
                href="#campaigns"
                className="group mt-10 inline-flex items-center gap-2 font-semibold text-ink"
              >
                <span className="link-draw">Or choose a specific campaign</span>
                <ArrowRight className="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-0.5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="lg:col-span-5"
            >
              <GivingCard
                campaign={generalFund}
                title="Give where it's needed most"
                subtitle="Your gift goes to the General Fund — we put it to work wherever the need is sharpest this month."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured campaign */}
      {featured && (
        <section className="pb-20 md:pb-28">
          <div className="shell">
            <ScrollReveal>
              <div className="grid lg:grid-cols-12 rounded-[2rem] overflow-hidden bg-plum text-white">
                <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
                  <img
                    src={featured.image || campaignImages[featured.slug]}
                    alt={featured.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-6 p-8 md:p-14 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="eyebrow !text-accent-light">
                      {featured.urgent ? "Urgent appeal" : "Featured campaign"}
                    </span>
                  </div>
                  <h2 className="display-2 !text-white">{featured.title}</h2>
                  <p className="mt-5 text-white/70 leading-relaxed text-lg">{featured.desc}</p>

                  <div className="mt-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="font-display text-3xl leading-none">
                          Rs {featured.raised.toLocaleString()}
                        </div>
                        <div className="mt-1.5 text-sm text-white/55">
                          raised of Rs {featured.goal.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right text-sm text-white/55">
                        <span className="font-semibold text-white">{featured.percent}%</span> ·{" "}
                        {featured.donors} donors
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, featured.percent)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <DonateButton campaign={featured} className="px-7 py-3.5">
                      Donate to this campaign
                    </DonateButton>
                    <Link
                      to="/donate/$slug"
                      params={{ slug: featured.slug }}
                      className="group inline-flex items-center gap-2 font-semibold text-white"
                    >
                      <span className="link-draw">Read the story</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* All campaigns */}
      {others.length > 0 && (
        <section id="campaigns" className="scroll-mt-28 py-24 md:py-28 bg-sand">
          <div className="shell">
            <SectionHeading
              align="left"
              eyebrow="Active campaigns"
              title={
                <>
                  Choose where <span className="serif-em">your gift goes.</span>
                </>
              }
              subtitle="Each campaign funds one part of our work. Open any of them to read the full story."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {others.map((c, i) => (
                <ScrollReveal key={c.id} delay={(i % 3) * 0.06} className="h-full">
                  <DonationCampaignCard campaign={c} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other ways to give */}
      <section className="py-24 md:py-28">
        <div className="shell">
          <SectionHeading
            align="left"
            eyebrow="Other ways to give"
            title={
              <>
                Beyond a <span className="serif-em">one-off gift.</span>
              </>
            }
          />
          <div className="grid md:grid-cols-3 border-t border-ink/15">
            <ScrollReveal className="py-10 md:pr-10">
              <Repeat className="h-6 w-6 text-primary" />
              <h3 className="mt-6 font-display text-2xl">Give monthly</h3>
              <p className="mt-3 text-text/70 leading-relaxed">
                Predictable funding is the most powerful gift we receive — it lets us plan a season
                ahead.
              </p>
              <DonateButton
                campaign={generalFund}
                recurring
                variant="outline"
                className="mt-6 px-5 py-2.5 text-sm"
              >
                Start monthly giving
              </DonateButton>
            </ScrollReveal>
            <ScrollReveal
              delay={0.06}
              className="py-10 md:px-10 border-t md:border-t-0 md:border-l border-ink/15"
            >
              <Gift className="h-6 w-6 text-primary" />
              <h3 className="mt-6 font-display text-2xl">Give in kind</h3>
              <p className="mt-3 text-text/70 leading-relaxed">
                Equipment, art supplies, computers or transport. Get in touch and we&apos;ll share
                our needs list.
              </p>
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink"
              >
                <span className="link-draw">Contact us</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>
            <ScrollReveal
              delay={0.12}
              className="py-10 md:pl-10 border-t md:border-t-0 md:border-l border-ink/15"
            >
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="mt-6 font-display text-2xl">Corporate sponsorship</h3>
              <p className="mt-3 text-text/70 leading-relaxed">
                Sponsor a tournament, a camp or a school year — with co-branded reporting.
              </p>
              <Link
                to="/partners"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink"
              >
                <span className="link-draw">Partner with us</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-28 border-t border-border">
        <div className="shell grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-5">Questions</div>
            <h2 className="display-3">Before you give.</h2>
            <p className="mt-4 text-text/70 leading-relaxed">
              Something else on your mind?{" "}
              <Link to="/contact" className="font-semibold text-ink underline underline-offset-4">
                Ask us directly
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-8 border-t border-ink/15">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-xl md:text-2xl text-ink">{f.q}</span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-ink/50 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 max-w-2xl text-text/70 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donor wall */}
      <section className="py-24 md:py-28 bg-sand">
        <div className="shell max-w-4xl text-center">
          <div className="eyebrow no-rule mb-5">Thank you</div>
          <h2 className="display-2">Our generous donors.</h2>
          <div className="flex flex-wrap justify-center gap-2.5 mt-10">
            {wall.anonymousCount > 0 && (
              <span className="rounded-full bg-background border border-border px-5 py-2 text-sm text-ink">
                Anonymous · {wall.anonymousCount} donor{wall.anonymousCount === 1 ? "" : "s"}
              </span>
            )}
            {wall.donors.map((d) => (
              <span
                key={d.name}
                className="rounded-full bg-background border border-border px-5 py-2 text-sm text-ink"
              >
                {d.name}
              </span>
            ))}
            {wall.donors.length === 0 && wall.anonymousCount === 0 && (
              <p className="text-text/60">
                Be the first name on this wall — every gift is acknowledged here unless you ask us
                not to.
              </p>
            )}
          </div>
          <p className="text-text/60 text-sm mt-8">
            Want your name added — or kept anonymous?{" "}
            <Link to="/contact" className="text-ink underline underline-offset-4">
              Let us know
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
