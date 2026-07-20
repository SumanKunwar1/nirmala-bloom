import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { DonationCampaign } from "@/lib/constants";
import { campaignImages } from "@/lib/images";
import { DonateButton } from "@/components/shared/DonateButton";

export function DonationCampaignCard({ campaign }: { campaign: DonationCampaign }) {
  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
  const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;
  const image = campaignImages[campaign.slug];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl bg-white border border-border overflow-hidden soft-shadow hover:soft-shadow-lg flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {image && (
          <img
            src={image}
            alt={campaign.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 35%, ${campaign.color}E6 100%)`,
          }}
        />
        {campaign.urgent && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-accent text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 shadow-lg">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Urgent
          </span>
        )}
        <div
          className="absolute top-4 left-4 w-12 h-12 rounded-2xl grid place-items-center text-2xl bg-white/95 backdrop-blur soft-shadow"
          style={{ color: campaign.color }}
        >
          {campaign.icon}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-display text-xl font-semibold leading-tight">{campaign.title}</h3>
          <div className="text-xs text-white/80 mt-1">{campaign.donors} donors so far</div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <p className="text-text/75 text-sm leading-relaxed mb-5">{campaign.desc}</p>

        <div className="mt-auto">
          <div className="flex items-baseline justify-between text-sm mb-2">
            <span className="font-mono-stat font-bold text-ink text-base">{fmt(campaign.raised)}</span>
            <span className="text-text/60 text-xs">of {fmt(campaign.goal)}</span>
          </div>
          <div className="h-2 bg-primary-pale rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${campaign.color}, #D9732B)` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-text/55 mt-2">
            <span>
              <strong className="text-ink">{pct}%</strong> funded
            </span>
            <span>Goal: {fmt(campaign.goal)}</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link
              to="/donate/$slug"
              params={{ slug: campaign.slug }}
              className="rounded-full border-2 border-primary/20 text-primary text-sm font-semibold py-2.5 text-center hover:bg-primary-pale transition-colors"
            >
              Learn more
            </Link>
            <DonateButton
              campaign={campaign}
              variant="primary"
              className="text-sm py-2.5 shadow-md shadow-orange-200"
            >
              Donate now
            </DonateButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
