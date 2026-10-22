import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Landmark, ShieldCheck } from "lucide-react";
import { imgs } from "@/lib/images";
import { DonateButton } from "@/components/shared/DonateButton";

const amounts = [500, 1000, 5000, 10000];

const impactFor: Record<number, string> = {
  500: "stationery for a child for a term",
  1000: "a day of fitting and physiotherapy",
  5000: "a training session for a 10-athlete squad",
  10000: "medicines for a rural health camp",
};

export function DonateCtaSection() {
  const [amount, setAmount] = useState<number>(1000);

  return (
    <section className="py-16 md:py-24">
      <div className="px-3 md:px-5">
        <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-plum">
          <img
            src={imgs.heroJoy}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-plum via-plum/85 to-plum/30" />

          <div className="shell relative py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-white">
              <div className="eyebrow !text-accent-light mb-6">Make a gift</div>
              <h2 className="display-2 !text-white">
                Give today. <span className="serif-em on-dark">Change a life.</span>
              </h2>
              <p className="mt-6 text-lg text-white/75 max-w-lg leading-relaxed">
                Your gift funds wheelchairs, sports gear, art supplies and education for Nepali
                youth with disabilities. It takes under a minute.
              </p>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" /> Secure, encrypted checkout
                </li>
                <li className="inline-flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-accent" /> Bank transfer available
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="rounded-[1.75rem] bg-white p-6 md:p-8 soft-shadow-lg">
                <div className="text-sm font-semibold text-ink">Choose an amount</div>
                <div
                  className="mt-4 grid grid-cols-2 gap-2.5"
                  role="radiogroup"
                  aria-label="Donation amount"
                >
                  {amounts.map((a) => (
                    <button
                      key={a}
                      type="button"
                      role="radio"
                      aria-checked={amount === a}
                      onClick={() => setAmount(a)}
                      className={`rounded-xl border px-4 py-3.5 text-left transition-colors ${
                        amount === a
                          ? "border-primary bg-primary-pale text-primary"
                          : "border-border text-ink hover:border-ink/30"
                      }`}
                    >
                      <span className="block text-xs text-text/55">NPR</span>
                      <span className="block font-display text-2xl leading-tight">
                        {a.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-5 rounded-xl bg-sand px-4 py-3 text-sm text-text/75">
                  <span className="font-semibold text-ink">Rs. {amount.toLocaleString()}</span> can
                  fund {impactFor[amount]}.
                </p>
                <DonateButton amount={amount} className="w-full mt-5 px-6 py-4 text-base">
                  <Heart className="h-4 w-4" fill="currentColor" /> Donate Rs.{" "}
                  {amount.toLocaleString()}
                </DonateButton>
                <Link
                  to="/donate"
                  className="mt-4 block text-center text-sm text-text/60 hover:text-ink"
                >
                  Prefer another amount or a specific programme?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
