import { motion } from "framer-motion";

export function DonationCampaignCard({ title, icon, goal, raised, desc }: {
  title: string; icon: string; goal: number; raised: number; desc: string;
}) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <p className="text-text/75 text-sm mt-1">{desc}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-mono-stat font-semibold text-primary">{fmt(raised)}</span>
          <span className="text-text/60">of {fmt(goal)}</span>
        </div>
        <div className="h-2 bg-primary-pale rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #6B2FA0, #F97316)" }} />
        </div>
        <div className="text-xs text-text/60 mt-2">{pct}% funded</div>
      </div>
      <button className="mt-5 w-full py-3 rounded-full bg-accent text-white font-semibold hover:scale-[1.02] transition-transform shadow-md shadow-orange-200">
        Donate to This
      </button>
    </motion.div>
  );
}
