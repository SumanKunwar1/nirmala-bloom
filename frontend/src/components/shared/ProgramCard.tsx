import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { programImages } from "@/lib/images";

export function ProgramCard({
  slug,
  title,
  icon,
  color,
  desc,
  image: imageProp,
}: {
  slug: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
  image?: string;
}) {
  const image = imageProp || programImages[slug];
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-2xl bg-white overflow-hidden border border-border soft-shadow hover:soft-shadow-lg h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {image && (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        <div
          className="absolute top-4 left-4 w-11 h-11 rounded-xl grid place-items-center text-xl bg-white/95 backdrop-blur shadow-sm"
          style={{ color }}
        >
          {icon}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-display font-bold text-ink mb-2">{title}</h3>
        <p className="text-text/70 text-sm leading-relaxed mb-5 flex-1">{desc}</p>
        <Link
          to="/programs/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-[0.14em] text-primary transition-all group-hover:gap-2.5"
          style={{ color }}
        >
          Learn More <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
