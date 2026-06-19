import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { newsImages } from "@/lib/images";

export function NewsCard({
  slug,
  title,
  category,
  date,
  excerpt,
  readTime,
  color = "#5B2C86",
}: {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  readTime?: string;
  color?: string;
}) {
  const image = newsImages[slug];
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-3xl bg-white border border-border overflow-hidden soft-shadow hover:soft-shadow-lg"
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className="absolute inset-0 grain"
            style={{ background: `linear-gradient(135deg, ${color} 0%, #D9732B 100%)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-primary px-3 py-1 rounded-full">
          {category}
        </span>
      </div>
      <div className="p-6">
        <div className="text-xs text-text/60 mb-2">
          {date}
          {readTime && ` · ${readTime} read`}
        </div>
        <h3 className="font-display font-semibold text-xl mb-2 leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-text/75 text-sm leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
        <Link
          to="/news/$slug"
          params={{ slug }}
          className="text-primary font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
        >
          Read more <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}
