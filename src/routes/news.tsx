import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { NewsCard } from "@/components/shared/NewsCard";
import { newsPosts, programs } from "@/lib/constants";

const tabs = ["All", "News", "Events", "Stories", "Press"] as const;

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [
    { title: "News & Stories — Nirmala Foundation" },
    { name: "description", content: "Stories, press, and updates from Nirmala Foundation Nepal." },
  ]}),
  component: NewsPage,
});

function NewsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const filtered = tab === "All" ? newsPosts : newsPosts.filter((p) => p.category === tab);
  return (
    <>
      <PageHero title="News & Stories" subtitle="From the courts, classrooms, and communities of Nepal." breadcrumb="News" />
      <section className="py-16 mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${tab === t ? "bg-primary text-white" : "bg-primary-pale text-primary hover:bg-primary/10"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => <NewsCard key={p.slug} {...p} color={programs[i % programs.length].color} />)}
        </div>
        <div className="mt-12 flex justify-center gap-2">
          {["←", "1", "2", "3", "→"].map((n, i) => (
            <button key={i} className={`w-10 h-10 rounded-full text-sm font-semibold ${n === "1" ? "bg-primary text-white" : "border border-border hover:bg-primary-pale"}`}>{n}</button>
          ))}
        </div>
      </section>
    </>
  );
}
