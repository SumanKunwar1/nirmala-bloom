import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { programImages } from "@/lib/images";

export function ProgramCard({
  slug,
  title,
  desc,
  tagline,
  index,
  image: imageProp,
}: {
  slug: string;
  title: string;
  desc: string;
  tagline?: string;
  /** Zero-based position, shown as a "01" style label. */
  index?: number;
  image?: string;
  icon?: string;
  color?: string;
}) {
  const image = imageProp || programImages[slug];
  return (
    <Link
      to="/programs/$slug"
      params={{ slug }}
      className="group flex flex-col h-full rounded-[1.5rem] bg-white overflow-hidden border border-border soft-shadow transition-shadow hover:soft-shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="zoom-img absolute inset-0 w-full h-full object-cover"
          />
        )}
        {index !== undefined && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 font-mono-stat text-xs text-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl leading-tight">{title}</h3>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all group-hover:bg-ink group-hover:text-white group-hover:border-ink">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        {tagline && <p className="mt-2 font-display italic text-primary">{tagline}</p>}
        <p className="mt-3 text-text/70 text-[15px] leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}
