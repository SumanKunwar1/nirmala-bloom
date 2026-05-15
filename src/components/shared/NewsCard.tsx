import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export function NewsCard({ slug, title, category, date, excerpt, readTime, color = "#6B2FA0" }: {
  slug: string; title: string; category: string; date: string; excerpt: string; readTime?: string; color?: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className="aspect-[16/10] relative" style={{ background: `linear-gradient(135deg, ${color} 0%, #F97316 100%)` }}>
        <div className="absolute inset-0 grain" />
        <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider bg-white/95 text-primary px-3 py-1 rounded-full">{category}</span>
      </div>
      <div className="p-6">
        <div className="text-xs text-text/60 mb-2">{date}{readTime && ` · ${readTime} read`}</div>
        <h3 className="font-display font-semibold text-xl mb-2 leading-snug">{title}</h3>
        <p className="text-text/75 text-sm leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
        <Link to="/news/$slug" params={{ slug }} className="text-primary font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
          Read More <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}
