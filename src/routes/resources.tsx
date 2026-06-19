import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { resources } from "@/lib/constants";
import { imgs } from "@/lib/images";

const tabs = ["All", "Annual Reports", "Research", "Policy Briefs", "Guides"] as const;

const categoryColors: Record<string, string> = {
  "Annual Reports": "#5B2C86",
  Research: "#D9732B",
  "Policy Briefs": "#2D7A4F",
  Guides: "#0891B2",
};

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resource Centre — Nirmala Foundation" },
      {
        name: "description",
        content: "Reports, research, policy briefs, and guides on disability inclusion in Nepal.",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");
  const filtered = resources.filter(
    (r) =>
      (tab === "All" || r.category === tab) &&
      (r.title.toLowerCase().includes(q.toLowerCase()) || r.desc.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHero
        eyebrow="Resource Centre"
        title="Open-access research & reports."
        subtitle="Annual reports, field research, policy briefs, and practical guides — all freely available to download and share."
        breadcrumb="Resources"
        image={imgs.pageResources}
        imageAlt="Publications and reports"
        stats={[
          { value: "20+", label: "Publications" },
          { value: "100%", label: "Open access" },
        ]}
      />

      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="relative mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search publications, reports, policy briefs…"
            className="w-full rounded-full border border-border bg-white px-6 py-4 pl-12 outline-none focus:border-primary soft-shadow"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
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
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((r) => {
            const color = categoryColors[r.category] ?? "#5B2C86";
            return (
              <article
                key={r.title}
                className="group rounded-3xl border border-border bg-white p-6 flex gap-5 soft-shadow hover:soft-shadow-lg transition-shadow"
              >
                <div
                  className="w-16 h-20 rounded-xl shrink-0 grid place-items-center text-white text-2xl"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}AA)` }}
                >
                  📄
                </div>
                <div className="flex-1">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color }}
                  >
                    {r.category} · {r.year}
                  </span>
                  <h3 className="font-display text-lg font-semibold mt-1 group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-text/75 text-sm mt-2">{r.desc}</p>
                  <button className="mt-4 inline-flex items-center gap-2 bg-primary text-white rounded-full px-5 py-2 text-sm font-semibold hover:-translate-y-0.5 transition-transform">
                    Download PDF ↓
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-text/55">
            No publications match your search.
          </div>
        )}
      </section>
    </>
  );
}
