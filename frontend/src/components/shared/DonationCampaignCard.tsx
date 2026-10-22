import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Campaign } from "@/lib/admin/context";
import { campaignImages } from "@/lib/images";
import { DonateButton } from "@/components/shared/DonateButton";

export function DonationCampaignCard({ campaign }: { campaign: Campaign }) {
  // `percent` is computed server-side from the ledger; fall back for safety.
  const pct = Math.min(
    100,
    campaign.percent ?? Math.round((campaign.raised / campaign.goal) * 100),
  );
  const fmt = (n: number) => `Rs ${n.toLocaleString()}`;
  // An admin-uploaded image wins; otherwise use the bundled stock shot.
  const image = campaign.image || campaignImages[campaign.slug];

  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] bg-white border border-border overflow-hidden soft-shadow transition-shadow hover:soft-shadow-lg">
      <Link
        to="/donate/$slug"
        params={{ slug: campaign.slug }}
        className="block"
        tabIndex={-1}
        aria-hidden
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-sand">
          {image && (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="zoom-img absolute inset-0 w-full h-full object-cover"
            />
          )}
          {campaign.urgent && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-accent-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Urgent
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl leading-tight">
          <Link to="/donate/$slug" params={{ slug: campaign.slug }} className="link-draw">
            {campaign.title}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] text-text/70 leading-relaxed">{campaign.desc}</p>

        <div className="mt-auto pt-6">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold text-ink">{fmt(campaign.raised)}</span>
            <span className="text-xs text-text/55">
              {pct}% of {fmt(campaign.goal)}
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-sand overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="h-full rounded-full bg-accent"
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Link
              to="/donate/$slug"
              params={{ slug: campaign.slug }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
            >
              Details{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {campaign.acceptsDonations === false ? (
              <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-text/50">
                Closed
              </span>
            ) : (
              <DonateButton campaign={campaign} variant="dark" className="px-5 py-2.5 text-sm">
                Donate
              </DonateButton>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
