import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Heart, ArrowRight, Landmark } from "lucide-react";
import { imgs } from "@/lib/images";

const amounts = [500, 1000, 5000, 10000];

const impactFor: Record<number, string> = {
  500: "stationery for a child",
  1000: "a day of physiotherapy",
  5000: "a basketball squad's training session",
  10000: "medicines for a rural camp",
};

export function DonateCtaSection() {
  const [amount, setAmount] = useState<number | "custom">(1000);

  return (
    <section className="relative py-24 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={imgs.heroJoy} alt="" aria-hidden className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(39,27,51,0.94) 0%, rgba(91,44,134,0.88) 52%, rgba(217,115,43,0.55) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/12 border border-white/20 px-4 py-1.5 text-xs uppercase tracking-[0.18em] mb-6"
        >
          <Heart className="h-3.5 w-3.5" /> Every rupee becomes belonging
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl md:text-5xl font-semibold"
          style={{ color: "#fff" }}
        >
          Give today. Change a life.
        </motion.h2>
        <p className="mt-4 text-lg text-white/85 max-w-xl mx-auto">
          Choose an amount and donate in under a minute. Your gift funds wheelchairs, sports gear,
          art supplies and education for Nepali youth with disabilities.
        </p>

        {/* Simple amount picker */}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              aria-pressed={amount === a}
              className={`rounded-full px-6 py-3 font-mono-stat font-semibold border-2 transition-colors ${
                amount === a ? "bg-white text-primary border-white" : "border-white/45 text-white hover:bg-white/10"
              }`}
            >
              Rs. {a.toLocaleString()}
            </button>
          ))}
          <button
            onClick={() => setAmount("custom")}
            aria-pressed={amount === "custom"}
            className={`rounded-full px-6 py-3 font-semibold border-2 transition-colors ${
              amount === "custom" ? "bg-white text-primary border-white" : "border-white/45 text-white hover:bg-white/10"
            }`}
          >
            Other
          </button>
        </div>

        {typeof amount === "number" && (
          <p className="mt-4 text-sm text-white/75">
            Rs. {amount.toLocaleString()} can fund <span className="text-white font-semibold">{impactFor[amount]}</span>.
          </p>
        )}

        <div className="mt-9 flex flex-col items-center gap-4">
          <Link
            to="/donate"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-10 py-5 text-lg font-semibold text-white shadow-[0_22px_50px_-14px_rgba(217,115,43,0.7)] transition-transform hover:-translate-y-0.5"
          >
            <Heart className="h-5 w-5" />
            Donate via eSewa / Khalti
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 text-sm text-white/85 underline-offset-4 hover:underline"
          >
            <Landmark className="h-4 w-4" /> Bank transfer details
          </Link>
        </div>
      </div>
    </section>
  );
}
