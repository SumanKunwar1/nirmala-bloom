import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { programImages } from "@/lib/images";

export function ProgramCard({
  slug,
  title,
  icon,
  color,
  desc,
}: {
  slug: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
}) {
  const image = programImages[slug];
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl border border-border bg-white overflow-hidden soft-shadow hover:soft-shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {image && (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 40%, ${color}AA 100%)`,
          }}
        />
        <div
          className="absolute top-4 left-4 w-12 h-12 rounded-2xl grid place-items-center text-2xl bg-white/95 backdrop-blur"
          style={{ color }}
        >
          {icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold mb-2" style={{ color }}>
          {title}
        </h3>
        <p className="text-text/75 text-sm leading-relaxed mb-4">{desc}</p>
        <Link
          to="/programs/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
        >
          Learn more <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.div>
  );
}
