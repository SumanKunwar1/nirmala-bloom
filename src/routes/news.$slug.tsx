import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { newsPosts } from "@/lib/constants";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const post = newsPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.post.title} — Nirmala Foundation` : "Post" },
    { name: "description", content: loaderData?.post.excerpt ?? "" },
  ]}),
  component: NewsDetail,
  notFoundComponent: () => <div className="min-h-screen grid place-items-center"><Link to="/news" className="text-primary">← Back to news</Link></div>,
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
});

function NewsDetail() {
  const { post } = Route.useLoaderData();
  return (
    <article className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/news" className="text-primary text-sm font-medium">← All news</Link>
        <span className="inline-block ml-3 text-xs font-semibold uppercase tracking-wider bg-accent-light text-accent px-3 py-1 rounded-full">{post.category}</span>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mt-6 leading-tight">{post.title}</h1>
        <div className="text-text/60 text-sm mt-4">{post.date} · {post.readTime} read</div>
      </div>
      <div className="mx-auto max-w-5xl px-6 mt-10">
        <div className="aspect-[16/8] rounded-3xl grain" style={{ background: "linear-gradient(135deg, #6B2FA0, #F97316)" }} />
      </div>
      <div className="mx-auto max-w-3xl px-6 mt-12 prose prose-lg text-text/85 space-y-6 leading-loose">
        <p className="text-xl text-ink">{post.excerpt}</p>
        <p>Across Kathmandu Valley and beyond, our work continues to expand — bringing inclusive sports, arts, and education to communities who have long been left at the margins. This story is one chapter in a much longer arc of belonging.</p>
        <p>We are grateful to every volunteer, partner, and donor who makes this work possible. Read on for the full story, photos, and how you can get involved.</p>
        <p>Donec eget ipsum vel turpis vehicula tincidunt. Curabitur nec eros at nibh tincidunt vehicula. Etiam fermentum, augue ut tristique pulvinar, lacus orci faucibus felis, vel fermentum tortor leo nec urna.</p>
      </div>
      <div className="mx-auto max-w-3xl px-6 mt-10 flex gap-3">
        {["Facebook", "X", "WhatsApp", "LinkedIn"].map((s) => (
          <button key={s} className="border border-border rounded-full px-5 py-2 text-sm hover:bg-primary-pale">{s}</button>
        ))}
      </div>
      <div className="mx-auto max-w-3xl px-6 mt-12 rounded-2xl bg-primary-pale/50 p-6 flex gap-4 items-center">
        <div className="w-16 h-16 rounded-full" style={{ background: "linear-gradient(135deg, #6B2FA0, #F97316)" }} />
        <div>
          <div className="font-display font-semibold text-lg">Maya Shrestha</div>
          <div className="text-sm text-text/70">Communications · Nirmala Foundation</div>
        </div>
      </div>
    </article>
  );
}
