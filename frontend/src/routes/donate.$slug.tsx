import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Heart, Share2 } from "lucide-react";
import { useContent, useAuth } from "@/lib/admin/context";
import { campaignImages } from "@/lib/images";
import { DonateButton } from "@/components/shared/DonateButton";
import { GivingCard } from "@/components/shared/GivingCard";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const Route = createFileRoute("/donate/$slug")({
  head: () => ({ meta: [{ title: "Donate | Nirmala Foundation Nepal" }] }),
  component: CampaignDetail,
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
});

const ease = [0.22, 1, 0.36, 1] as const;

function CampaignDetail() {
  const { slug } = useParams({ from: "/donate/$slug" });
  const { campaigns } = useContent();
  const { ready } = useAuth();

  const c = campaigns.find((x) => x.slug === slug);

  // SEO overrides are campaign content, so apply them client-side.
  useEffect(() => {
    if (!c) return;
    document.title = c.seoTitle || `${c.title} | Donate | Nirmala Foundation`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && c.seoDescription) meta.setAttribute("content", c.seoDescription);
  }, [c]);

  /** Mobile: show the slim donate bar only once the giving card is off-screen. */
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(true);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCardVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [c?.slug]);

  const [shared, setShared] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: c?.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }
    } catch {
      /* dismissed */
    }
  };

  // The store seeds instantly then refetches; only 404 once the load settled.
  if (!c) {
    return (
      <div className="min-h-screen grid place-items-center px-5 pt-[74px]">
        {!ready ? (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-pale border-t-primary" />
        ) : (
          <div className="text-center">
            <div className="eyebrow no-rule">Not found</div>
            <h1 className="display-2 mt-4">We couldn&apos;t find that campaign.</h1>
            <Link to="/donate" className="btn-pill btn-dark mt-8">
              All campaigns <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  const image = c.image || campaignImages[c.slug];
  const related = campaigns.filter((x) => x.slug !== c.slug && x.published).slice(0, 3);
  const open = c.acceptsDonations !== false;

  return (
    <>
      <div className="pt-[74px]">
        <div className="shell pt-10 md:pt-14 pb-24 md:pb-32">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 md:mb-12 flex flex-wrap items-center gap-1.5 text-sm text-text/55"
          >
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link to="/donate" className="hover:text-ink transition-colors">
              Donate
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-ink/80">{c.title}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-x-16 gap-y-12">
            {/* Intro */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="lg:col-span-7"
            >
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="eyebrow">Campaign</span>
                {c.urgent && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Urgent appeal
                  </span>
                )}
              </div>
              <h1 className="display-1">{c.title}</h1>
              <p className="mt-6 text-lg md:text-xl leading-relaxed text-text/75 max-w-2xl">
                {c.desc}
              </p>
              <div className="mt-10 photo-frame aspect-[16/10] rounded-[1.75rem]">
                <img src={image} alt={c.title} />
              </div>
            </motion.header>

            {/* Giving card — beside the story on desktop, right after the intro on mobile */}
            <aside className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2">
              <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
                className="lg:sticky lg:top-[98px]"
              >
                <GivingCard
                  campaign={c}
                  showProgress
                  title={open ? `Support ${c.title}` : c.title}
                  footer={
                    <button
                      type="button"
                      onClick={share}
                      className="flex w-full items-center justify-center gap-2 border-t border-border py-3.5 text-sm font-medium text-text/70 hover:text-ink transition-colors"
                    >
                      {shared ? (
                        <Check className="h-4 w-4 text-green" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                      {shared ? "Link copied" : "Share this campaign"}
                    </button>
                  }
                />
              </motion.div>
            </aside>

            {/* Story */}
            <div className="lg:col-span-7 space-y-16 md:space-y-20">
              <ScrollReveal>
                <div className="eyebrow mb-5">About this campaign</div>
                <p className="text-xl leading-relaxed text-ink">{c.longDesc}</p>
              </ScrollReveal>

              {c.why && (
                <ScrollReveal>
                  <div className="rounded-[1.5rem] bg-sand p-8 md:p-10">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text/50">
                      Why it matters
                    </div>
                    <p className="mt-4 font-display text-2xl leading-snug text-ink">{c.why}</p>
                  </div>
                </ScrollReveal>
              )}

              {c.tiers.length > 0 && (
                <ScrollReveal>
                  <div className="eyebrow mb-5">What your gift does</div>
                  <h2 className="display-3">Every amount has a job.</h2>
                  <ul className="mt-8 border-t border-ink/15">
                    {c.tiers.map((t) => (
                      <li
                        key={t.amount}
                        className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[10rem_1fr] items-baseline gap-4 py-5 border-b border-border"
                      >
                        <span className="font-display text-2xl text-ink">
                          Rs {t.amount.toLocaleString()}
                        </span>
                        <span className="text-text/75 leading-relaxed">{t.impact}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              )}

              {c.stories.length > 0 && (
                <ScrollReveal>
                  <div className="eyebrow mb-8">From the field</div>
                  <div className="space-y-10">
                    {c.stories.map((s) => (
                      <figure key={s.name} className="border-l-2 border-accent pl-6 md:pl-8">
                        <blockquote className="font-display text-2xl md:text-3xl italic leading-snug text-ink">
                          &ldquo;{s.quote}&rdquo;
                        </blockquote>
                        <figcaption className="mt-4 text-sm">
                          <span className="font-semibold text-ink">{s.name}</span>
                          <span className="text-text/60"> · {s.role}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* More campaigns */}
      {related.length > 0 && (
        <section className="py-24 md:py-28 bg-sand">
          <div className="shell">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
              <div>
                <div className="eyebrow mb-5">More campaigns</div>
                <h2 className="display-2">Other ways your gift helps.</h2>
              </div>
              <Link to="/donate" className="btn-pill btn-outline">
                All campaigns <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/donate/$slug"
                  params={{ slug: r.slug }}
                  className="group rounded-[1.5rem] bg-background overflow-hidden border border-border transition-shadow hover:soft-shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={r.image || campaignImages[r.slug]}
                      alt=""
                      loading="lazy"
                      className="zoom-img absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="font-display text-xl text-ink">{r.title}</div>
                    <div className="mt-3 h-1.5 rounded-full bg-sand overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.min(100, r.percent)}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-text/55">
                      {r.percent}% funded · {r.donors} donors
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile donate bar — appears once the giving card has scrolled away */}
      <AnimatePresence>
        {open && !cardVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease }}
            className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl pl-5 pr-24 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink">{c.title}</div>
                <div className="text-xs text-text/55">{c.percent}% funded</div>
              </div>
              <DonateButton campaign={c} className="px-5 py-2.5 text-sm shrink-0">
                <Heart className="h-3.5 w-3.5" fill="currentColor" /> Donate
              </DonateButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
