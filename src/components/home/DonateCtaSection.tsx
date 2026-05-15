import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { LotusDecor } from "@/components/shared/PageHero";

const amounts = [500, 1000, 5000, 10000];

export function DonateCtaSection() {
  const [amount, setAmount] = useState<number | "custom">(1000);
  return (
    <section className="relative py-28 overflow-hidden grain" style={{
      background: "linear-gradient(135deg, #F97316 0%, #9B5DD5 50%, #6B2FA0 100%)",
    }}>
      <LotusDecor />
      <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display text-5xl md:text-6xl font-semibold" style={{ color: "#fff" }}>
          Change a Life Today
        </motion.h2>
        <p className="mt-5 text-lg text-white/90 max-w-2xl mx-auto">
          Your donation funds wheelchairs, sports equipment, art supplies, and education for Nepali youth with disabilities.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {amounts.map((a) => (
            <button key={a} onClick={() => setAmount(a)}
              className={`rounded-full px-6 py-3 font-mono-stat font-semibold border-2 transition-all ${
                amount === a ? "bg-white text-primary border-white" : "border-white/60 text-white hover:bg-white/10"
              }`}>
              Rs. {a.toLocaleString()}
            </button>
          ))}
          <button onClick={() => setAmount("custom")}
            className={`rounded-full px-6 py-3 font-semibold border-2 transition-all ${
              amount === "custom" ? "bg-white text-primary border-white" : "border-white/60 text-white hover:bg-white/10"
            }`}>
            Custom Amount
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link to="/donate" className="bg-accent text-white rounded-full px-10 py-5 text-lg font-semibold shadow-2xl shadow-orange-900/40 hover:scale-105 transition-transform">
            Donate via eSewa / Khalti
          </Link>
          <Link to="/donate" className="text-white/80 text-sm underline underline-offset-4 hover:text-white">
            Bank Transfer Details
          </Link>
        </div>
      </div>
    </section>
  );
}
