import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { resources } from "@/lib/constants";

const tabs = ["All", "Annual Reports", "Research", "Policy Briefs", "Guides"] as const;

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [
    { title: "Resource Centre — Nirmala Foundation" },
    { name: "description", content: "Reports, research, policy briefs, and guides on disability inclusion in Nepal." },
  ]}),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const [q, setQ] = useState("");
  const filtered = resources.filter((r) =>
    (tab === "All" || r.category === tab) &&
    (r.title.toLowerCase().includes(q.toLowerCase()) || r.desc.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <>
      <PageHero title="Resource Centre" subtitle="Open-access research, reports, and policy briefs." breadcrumb="Resources" />
      <section className="py-16 mx-auto max-w-6xl px-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search publications, reports, policy briefs..."
          className="w-full rounded-full border border-border bg-white px-6 py-4 outline-none focus:border-primary mb-6" />
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${tab === t ? "bg-primary text-white" : "bg-primary-pale text-primary"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((r) => (
            <div key={r.title} className="rounded-2xl border border-border bg-white p-6 flex gap-5 hover:shadow-lg transition-shadow">
              <div className="w-16 h-20 rounded-lg bg-accent-light grid place-items-center text-2xl shrink-0">📄</div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">{r.category} · {r.year}</span>
                <h3 className="font-display text-lg font-semibold mt-1">{r.title}</h3>
                <p className="text-text/75 text-sm mt-2">{r.desc}</p>
                <button className="mt-4 inline-flex items-center gap-2 bg-primary text-white rounded-full px-5 py-2 text-sm font-semibold">Download PDF ↓</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
