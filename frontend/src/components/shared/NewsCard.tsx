import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { newsImages } from "@/lib/images";

/**
 * Story card. `featured` is the large lead card, `compact` a horizontal row
 * for side lists; the default is a standard grid card.
 */
export function NewsCard({
  slug,
  title,
  category,
  date,
  excerpt,
  readTime,
  image: imageProp,
  featured = false,
  compact = false,
}: {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  readTime?: string;
  color?: string;
  image?: string;
  featured?: boolean;
  compact?: boolean;
}) {
  const image = imageProp || newsImages[slug];
  const meta = (
    <div className="flex items-center gap-2 text-xs text-text/55">
      <span className="font-semibold uppercase tracking-[0.14em] text-accent-ink">{category}</span>
      <span aria-hidden>·</span>
      <span>{date}</span>
      {readTime && (
        <>
          <span aria-hidden>·</span>
          <span>{readTime} read</span>
        </>
      )}
    </div>
  );

  const media = (cls: string) => (
    <div className={`relative overflow-hidden bg-sand ${cls}`}>
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="zoom-img absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );

  if (compact) {
    return (
      <Link
        to="/news/$slug"
        params={{ slug }}
        className="group grid grid-cols-[8rem_1fr] sm:grid-cols-[11rem_1fr] gap-5 items-center"
      >
        {media("aspect-square rounded-2xl")}
        <article>
          {meta}
          <h3 className="mt-2 font-display text-xl leading-snug">
            <span className="link-draw">{title}</span>
          </h3>
          <p className="mt-2 text-sm text-text/65 line-clamp-2 hidden sm:block">{excerpt}</p>
        </article>
      </Link>
    );
  }

  return (
    <Link to="/news/$slug" params={{ slug }} className="group block h-full">
      <article className="h-full flex flex-col">
        {media(featured ? "aspect-[16/11] rounded-[1.75rem]" : "aspect-[16/10] rounded-[1.5rem]")}
        <div className="pt-6 flex flex-col flex-1">
          {meta}
          <h3
            className={`mt-3 font-display leading-tight ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}
          >
            <span className="link-draw">{title}</span>
          </h3>
          <p
            className={`mt-3 text-text/70 leading-relaxed ${featured ? "text-lg" : "text-[15px] line-clamp-2"}`}
          >
            {excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            Read story{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
