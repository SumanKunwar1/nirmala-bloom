import { useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { newsImages } from "@/lib/images";
import { useContent, useAuth } from "@/lib/admin/context";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({ meta: [{ title: "Story — Nirmala Foundation" }] }),
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = useParams({ from: "/news/$slug" });
  const { stories } = useContent();
  const { ready } = useAuth();
  const post = stories.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) document.title = `${post.title} — Nirmala Foundation`;
  }, [post]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen grid place-items-center">
        {ready ? (
          <Link to="/news" className="text-primary">
            ← Back to news
          </Link>
        ) : (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        )}
      </div>
    );
  }

  const image = post.image || newsImages[post.slug];

  return (
    <article className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/news" className="text-primary text-sm font-medium hover:underline underline-offset-4">
          ← All news
        </Link>
        <span className="inline-block ml-3 text-[11px] font-semibold uppercase tracking-wider bg-accent-light text-accent px-3 py-1 rounded-full">
          {post.category}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mt-6 leading-tight">{post.title}</h1>
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
            <div className="absolute inset-0 grain" style={{ background: "linear-gradient(135deg, #5B2C86, #D9732B)" }} />
          )}
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 mt-12 text-text/85 leading-loose">
        <p className="text-xl text-ink mb-6">{post.excerpt}</p>
        {post.body && (
          <div className="rte-render space-y-4 text-lg" dangerouslySetInnerHTML={{ __html: post.body }} />
        )}
      </div>
      <div className="mx-auto max-w-3xl px-6 mt-10 flex gap-3 flex-wrap">
        {["Facebook", "X", "WhatsApp", "LinkedIn"].map((s) => (
          <button
            key={s}
            className="border border-border rounded-full px-5 py-2 text-sm hover:bg-primary-pale transition-colors"
          >
            Share on {s}
          </button>
        ))}
      </div>
    </article>
  );
}
