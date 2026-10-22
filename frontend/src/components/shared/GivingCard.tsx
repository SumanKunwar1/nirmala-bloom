import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Heart, Lock, Mail } from "lucide-react";
import { DonateButton } from "@/components/shared/DonateButton";
import type { Campaign } from "@/lib/admin/context";

type Tier = { amount: number; impact: string };

const DEFAULT_TIERS: Tier[] = [
  { amount: 1000, impact: "Fitting and physiotherapy for one participant" },
  { amount: 2500, impact: "A braille slate and tactile learning kit" },
  { amount: 5000, impact: "A training session for a 10-athlete squad" },
  { amount: 10000, impact: "Medicines for a rural health camp" },
];

/**
 * The one place on a page where a gift is chosen: frequency, amount (with
 * what it buys), then a single button into the donation modal.
 */
export function GivingCard({
  campaign,
  title,
  subtitle,
  showProgress = false,
  footer,
}: {
  campaign?: Campaign;
  title: string;
  subtitle?: string;
  /** Show raised / goal / donors for the campaign. */
  showProgress?: boolean;
  footer?: ReactNode;
}) {
  const tiers = (campaign?.tiers?.length ? campaign.tiers : DEFAULT_TIERS).slice(0, 4);
  const [amount, setAmount] = useState<number | null>(tiers[1]?.amount ?? tiers[0]?.amount ?? null);
  const [monthly, setMonthly] = useState(false);
  const picked = tiers.find((t) => t.amount === amount);
  const closed = campaign?.acceptsDonations === false;

  const fmt = (n: number) => `Rs ${n.toLocaleString()}`;
  const pct = campaign
    ? Math.min(100, campaign.percent ?? Math.round((campaign.raised / campaign.goal) * 100))
    : 0;

  return (
    <div className="rounded-[1.75rem] bg-white border border-border soft-shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="font-display text-2xl leading-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-text/65 leading-relaxed">{subtitle}</p>}

        {showProgress && campaign && (
          <div className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="font-display text-3xl leading-none text-ink">
                  {fmt(campaign.raised)}
                </div>
                <div className="mt-1.5 text-xs text-text/55">raised of {fmt(campaign.goal)}</div>
              </div>
              <div className="text-right text-xs text-text/55">
                <span className="font-semibold text-ink">{pct}%</span> funded
                <br />
                <span className="font-semibold text-ink">{campaign.donors}</span> donors
              </div>
            </div>
            <div
              className="mt-4 h-2 rounded-full bg-sand overflow-hidden"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Funding progress"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </div>
        )}

        {closed ? (
          <p className="mt-6 rounded-xl bg-sand px-4 py-3 text-sm text-text/75">
            This campaign isn&apos;t taking donations right now. You can still give to the General
            Fund.
          </p>
        ) : (
          <>
            <div
              className="mt-6 grid grid-cols-2 rounded-full bg-sand p-1 text-sm font-semibold"
              role="radiogroup"
              aria-label="Donation frequency"
            >
              {[
                { label: "One-time", value: false },
                { label: "Monthly", value: true },
              ].map((f) => (
                <button
                  key={f.label}
                  type="button"
                  role="radio"
                  aria-checked={monthly === f.value}
                  onClick={() => setMonthly(f.value)}
                  className={`rounded-full py-2.5 transition-colors ${
                    monthly === f.value
                      ? "bg-white text-ink soft-shadow"
                      : "text-text/60 hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div
              className="mt-4 grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Donation amount"
            >
              {tiers.map((t) => (
                <button
                  key={t.amount}
                  type="button"
                  role="radio"
                  aria-checked={amount === t.amount}
                  onClick={() => setAmount(t.amount)}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    amount === t.amount
                      ? "border-primary bg-primary-pale text-primary"
                      : "border-border text-ink hover:border-ink/30"
                  }`}
                >
                  <span className="block text-[11px] text-text/55">NPR</span>
                  <span className="block font-display text-xl leading-tight">
                    {t.amount.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-3 min-h-[2.75rem] text-sm text-text/70 leading-snug">
              {picked ? (
                <>
                  <span className="font-semibold text-ink">{fmt(picked.amount)}</span>
                  {monthly ? " a month" : ""} —{" "}
                  {picked.impact.charAt(0).toLowerCase() + picked.impact.slice(1)}.
                </>
              ) : (
                "Choose an amount, or enter your own on the next step."
              )}
            </p>

            <DonateButton
              campaign={campaign}
              amount={amount ?? undefined}
              recurring={monthly}
              className="w-full mt-4 px-6 py-4 text-base"
            >
              <Heart className="h-4 w-4" fill="currentColor" />
              {amount ? `Donate ${fmt(amount)}${monthly ? " monthly" : ""}` : "Donate"}
            </DonateButton>
            <p className="mt-3 text-center text-xs text-text/50">
              You can change the amount on the next step.
            </p>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-5 border-t border-border bg-sand/50 px-6 py-3.5 text-xs text-text/60">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" /> Secure checkout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" /> Receipt by email
        </span>
      </div>
      {footer}
    </div>
  );
}
