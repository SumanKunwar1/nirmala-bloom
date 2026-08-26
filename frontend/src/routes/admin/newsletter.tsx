import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mails, UserCheck, UserMinus, Copy, Download, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty } from "@/components/admin/AdminCard";
import { ConfirmDialog } from "@/components/admin/AdminModal";
import {
  useSubscribers,
  deleteSubscriber,
  getNewsletterStats,
  copySubscriberEmails,
  type Subscriber,
} from "@/lib/admin/inbox";

export const Route = createFileRoute("/admin/newsletter")({
  component: NewsletterAdminPage,
});

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

type Filter = "all" | "active" | "unsubscribed";

function NewsletterAdminPage() {
  const subscribers = useSubscribers();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState<Subscriber | null>(null);
  const [stats, setStats] = useState<{ total: number; active: number; unsubscribed: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getNewsletterStats().then(setStats).catch(() => {});
  }, [subscribers.length]);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };

  const filtered = useMemo(() => {
    let list = subscribers;
    if (filter === "active") list = list.filter((s) => s.active);
    if (filter === "unsubscribed") list = list.filter((s) => !s.active);

    const q = query.trim().toLowerCase();
    if (q) list = list.filter((s) => s.email.toLowerCase().includes(q));
    return list;
  }, [subscribers, filter, query]);

  /** Group by where people signed up, so you can see what converts. */
  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    subscribers.forEach((s) => map.set(s.source || "unknown", (map.get(s.source || "unknown") ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [subscribers]);

  const downloadCsv = () => {
    const rows = [
      "email,source,active,subscribed",
      ...filtered.map((s) => `${s.email},${s.source},${s.active},${s.createdAt}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([rows], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Total subscribers", value: stats?.total ?? subscribers.length, icon: Mails, color: "#5B2C86" },
    { label: "Active", value: stats?.active ?? 0, icon: UserCheck, color: "#2E7D5B" },
    { label: "Unsubscribed", value: stats?.unsubscribed ?? 0, icon: UserMinus, color: "#D9732B" },
  ];

  return (
    <AdminShell
      title="Newsletter"
      subtitle="Everyone who signed up from the footer, the home strip, or the donate flow."
    >
      {toast && (
        <div className="mb-4 rounded-xl border border-primary/25 bg-primary-pale/50 px-4 py-3 text-sm text-ink">
          {toast}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5 soft-shadow">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ backgroundColor: `${c.color}14`, color: c.color }}
              >
                <Icon style={{ width: 20, height: 20 }} />
              </div>
              <div className="mt-4 font-mono-stat text-2xl font-bold text-ink">{c.value}</div>
              <div className="mt-0.5 text-sm text-text/60">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search an email…"
              className="min-w-[200px] flex-1 rounded-lg border border-input bg-card px-3.5 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => copySubscriberEmails().then((n) => flash(`Copied ${n} active address(es).`))}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-text/80 hover:bg-muted"
            >
              <Copy style={{ width: 15, height: 15 }} /> Copy active
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-text/80 hover:bg-muted"
            >
              <Download style={{ width: 15, height: 15 }} /> CSV
            </button>
          </div>

          <div className="mb-3 flex items-center gap-1.5">
            {(["all", "active", "unsubscribed"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ${
                  filter === f
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-text/65 hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Empty text="No subscribers match this filter." />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card soft-shadow">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-text/55">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Source</th>
                    <th className="px-5 py-3 font-semibold">Subscribed</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((s) => (
                    <tr key={s.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3.5 font-medium text-ink">{s.email}</td>
                      <td className="px-5 py-3.5 text-text/60">{s.source || "—"}</td>
                      <td className="px-5 py-3.5 text-text/60">{fmtDate(s.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            s.active ? "bg-green-light text-green" : "bg-muted text-text/60"
                          }`}
                        >
                          {s.active ? "Active" : "Unsubscribed"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setDel(s)}
                          aria-label="Delete"
                          className="grid h-8 w-8 place-items-center rounded-lg text-text/50 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 style={{ width: 15, height: 15 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 soft-shadow self-start">
          <h2 className="font-display text-base font-semibold text-ink">Where they signed up</h2>
          <p className="mt-0.5 text-sm text-text/55">Useful for knowing which prompt converts.</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {bySource.length === 0 ? (
              <Empty text="No sign-ups yet." />
            ) : (
              bySource.map(([source, count]) => (
                <li key={source} className="flex items-center justify-between">
                  <span className="capitalize text-text/70">{source.replace(/-/g, " ")}</span>
                  <span className="font-mono-stat font-semibold text-ink">{count}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        onConfirm={() => del && deleteSubscriber(del.id)}
        title="Remove subscriber?"
        message={`${del?.email ?? "This address"} will be permanently deleted from the list.`}
      />
    </AdminShell>
  );
}
