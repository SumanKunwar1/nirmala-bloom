import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export function ProgramCard({ slug, title, icon, color, desc }: {
  slug: string; title: string; icon: string; color: string; desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(107,47,160,0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl border border-border bg-white p-7 group cursor-pointer"
      style={{ background: "radial-gradient(circle at top left, #F3EAFD 0%, #FFFFFF 70%)" }}
    >
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/40 transition-colors pointer-events-none" />
      <div className="text-4xl mb-4 transition-transform group-hover:scale-110 origin-left" style={{ filter: `drop-shadow(0 4px 12px ${color}40)` }}>{icon}</div>
      <h3 className="text-xl font-display font-semibold mb-2" style={{ color }}>{title}</h3>
      <p className="text-text/75 text-sm leading-relaxed mb-4">{desc}</p>
      <Link to="/programs/$slug" params={{ slug }} className="text-primary font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
        Learn More <span aria-hidden>→</span>
      </Link>
    </motion.div>
  );
}
