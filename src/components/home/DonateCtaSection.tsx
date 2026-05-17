import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { imgs } from "@/lib/images";

const amounts = [500, 1000, 5000, 10000];

export function DonateCtaSection() {
  const [amount, setAmount] = useState<number | "custom">(1000);
  return (
    <section className="relative py-28 overflow-hidden grain">
      <div className="absolute inset-0">
        <img
          src={imgs.heroJoy}
          alt=""
          aria-hidden
          className="w-full h-full object-cover ken-burns"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,16,53,0.92) 0%, rgba(107,47,160,0.85) 55%, rgba(249,115,22,0.55) 100%)",
          }}
        />
      </div>

      <svg
        className="absolute -top-16 -left-16 w-[440px] h-[440px] opacity-10 pointer-events-none float-slower"
        viewBox="0 0 200 200"
        aria-hidden
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse key={deg} cx="100" cy="58" rx="22" ry="48" fill="white" transform={`rotate(${deg} 100 100)`} />
        ))}
      </svg>

      <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] mb-6"
        >
          <span>💜</span> Every Rupee Becomes Belonging
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl font-semibold"
          style={{ color: "#fff" }}
        >
          Change a life today.
        </motion.h2>
        <p className="mt-5 text-lg text-white/85 max-w-2xl mx-auto">
          Your donation funds wheelchairs, sports equipment, art supplies, and education for Nepali youth with
          disabilities.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-full px-6 py-3 font-mono-stat font-semibold border-2 transition-colors ${
                amount === a ? "bg-white text-primary border-white" : "border-white/50 text-white hover:bg-white/10"
              }`}
            >
              Rs. {a.toLocaleString()}
            </button>
          ))}
          <button
            onClick={() => setAmount("custom")}
            className={`rounded-full px-6 py-3 font-semibold border-2 transition-colors ${
              amount === "custom" ? "bg-white text-primary border-white" : "border-white/50 text-white hover:bg-white/10"
            }`}
          >
            Custom amount
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            to="/donate"
            className="bg-accent text-white rounded-full px-10 py-5 text-lg font-semibold shadow-[0_24px_55px_-12px_rgba(249,115,22,0.7)] hover:-translate-y-0.5 transition-transform"
          >
            Donate via eSewa / Khalti →
          </Link>
          <Link
            to="/donate"
            className="text-white/80 text-sm underline underline-offset-4 hover:text-white"
          >
            Bank Transfer Details
          </Link>
        </div>
      </div>
    </section>
  );
}
