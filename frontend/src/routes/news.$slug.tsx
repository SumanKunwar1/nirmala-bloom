import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { newsImages } from "@/lib/images";
import { useContent, type Story } from "@/lib/admin/context";
import { http, ApiError } from "@/lib/api";
import { NewsCard } from "@/components/shared/NewsCard";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({ meta: [{ title: "Story — Nirmala Foundation" }] }),
  component: NewsDetail,
});

const COLORS = ["#6B2FA0", "#F97316", "#2D7A4F"];

function NewsDetail() {
  const { slug } = useParams({ from: "/news/$slug" });
  const { stories } = useContent();

  // The store holds whatever was prefetched; render from it instantly if the
  // story is there, then confirm against the API. Fetching by slug means an
  // article works no matter which page of the listing it lives on.
  const cached = useMemo(() => stories.find((p) => p.slug === slug), [stories, slug]);
  const [post, setPost] = useState<Story | undefined>(cached);
  const [state, setState] = useState<"loading" | "ready" | "missing">(cached ? "ready" : "loading");

  useEffect(() => {
    let alive = true;
    setPost(cached);
    setState(cached ? "ready" : "loading");

    http
      .get<Story>(`/stories/slug/${encodeURIComponent(slug)}`, { auth: false })
      .then((doc) => {
        if (!alive) return;
        setPost(doc);
        setState("ready");
      })
      .catch((e) => {
        if (!alive) return;
        // A 404 is authoritative — an unpublished or deleted story.
        if (e instanceof ApiError && e.status === 404) {
          setPost(undefined);
          setState("missing");
        } else if (!cached) {
          setState("missing");
        }
      });

    return () => {
      alive = false;
    };
  }, [slug, cached]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Nirmala Foundation`;
  }, [post]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  /** Same category first, then anything else — never the article itself. */
  const related = useMemo(() => {
    if (!post) return [];
    const others = stories.filter((p) => p.slug !== post.slug && p.published !== false);
    const sameCategory = others.filter((p) => p.category === post.category);
    return [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(0, 3);
  }, [stories, post]);

  if (state === "loading") {
    return (
      <div className="min-h-screen grid place-items-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink">Story not found</h1>
          <p className="mt-2 text-sm text-text/65">It may have been unpublished or moved.</p>
          <Link
            to="/news"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            ← Back to all news
          </Link>
        </div>
      </div>
    );
  }

  const image = post.image || newsImages[post.slug];
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          to="/news"
          className="text-primary text-sm font-medium hover:underline underline-offset-4"
        >
          ← All news
        </Link>
        <Link
          to="/news"
          search={{ category: post.category }}
          className="inline-block ml-3 text-[11px] font-semibold uppercase tracking-wider bg-accent-light text-accent px-3 py-1 rounded-full hover:bg-accent hover:text-white transition-colors"
        >
          {post.category}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mt-6 leading-tight">
          {post.title}
        </h1>
        <div className="text-text/60 text-sm mt-4">
          {post.date}
          {post.readTime && ` · ${post.readTime} read`}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 mt-10">
        <div className="photo-frame aspect-[16/8] soft-shadow-lg">
          {image ? (
            <img src={image} alt={post.title} className="ken-burns" />
          ) : (
            <div
              className="absolute inset-0 grain"
              style={{ background: "linear-gradient(135deg, #5B2C86, #D9732B)" }}
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 mt-12 text-text/85 leading-loose">
        <p className="text-xl text-ink mb-6">{post.excerpt}</p>
        {post.body && (
          <div
            className="rte-render space-y-4 text-lg"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        )}
      </div>

      {/* Share links that actually share. */}
      <div className="mx-auto max-w-3xl px-6 mt-10 flex gap-3 flex-wrap">
        {shareTargets(shareUrl, post.title).map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border rounded-full px-5 py-2 text-sm hover:bg-primary-pale transition-colors"
          >
            Share on {s.label}
          </a>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 mt-20">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">More stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r, i) => (
              <NewsCard key={r.slug} {...r} color={COLORS[i % COLORS.length]} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function shareTargets(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
}
