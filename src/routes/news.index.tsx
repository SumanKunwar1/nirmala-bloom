import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { NewsCard } from "@/components/shared/NewsCard";
import { newsPosts, programs } from "@/lib/constants";
import { imgs } from "@/lib/images";

const tabs = ["All", "News", "Events", "Stories", "Press"] as const;

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News & Stories — Nirmala Foundation" },
      { name: "description", content: "Stories, press, and updates from Nirmala Foundation Nepal." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const filtered = tab === "All" ? newsPosts : newsPosts.filter((p) => p.category === tab);
  return (
    <>
      <PageHero
        eyebrow="News & Stories"
        title="From the courts, classrooms & communities."
        subtitle="Press features, programme updates, and quiet stories of belonging from across Nepal."
        breadcrumb="News"
        image={imgs.pageNews}
        imageAlt="Field stories from Nirmala Foundation"
      />

      <section className="py-20 mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === t ? "bg-primary text-white" : "bg-primary-pale text-primary hover:bg-primary/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <NewsCard key={p.slug} {...p} color={programs[i % programs.length].color} />
          ))}
        </div>
        <div className="mt-14 flex justify-center gap-2">
          {["←", "1", "2", "3", "→"].map((n, i) => (
            <button
              key={i}
              className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                n === "1" ? "bg-primary text-white" : "border border-border hover:bg-primary-pale"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
