import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HandCoins, Users, TrendingUp, Wallet, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty } from "@/components/admin/AdminCard";
import { ConfirmDialog } from "@/components/admin/AdminModal";
import {
  useDonations,
  updateDonationStatus,
  deleteDonation,
  type Donation,
} from "@/lib/admin/inbox";

export const Route = createFileRoute("/admin/donations")({
  component: DonationsAdminPage,
});

const rs = (n: number) => `Rs ${n.toLocaleString()}`;

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

const STATUS_STYLE: Record<Donation["status"], string> = {
  completed: "bg-green-light text-green",
  pending: "bg-accent-light text-accent",
  refunded: "bg-muted text-text/60",
};

function DonationsAdminPage() {
  const donations = useDonations();
  const [filter, setFilter] = useState<"all" | Donation["status"]>("all");
  const [del, setDel] = useState<string | null>(null);

  const totals = useMemo(() => {
    const completed = donations.filter((d) => d.status === "completed");
    const raised = completed.reduce((sum, d) => sum + d.amount, 0);
    const donors = new Set(completed.map((d) => d.email)).size;
    const pending = donations.filter((d) => d.status === "pending").reduce((s, d) => s + d.amount, 0);
    const avg = completed.length ? Math.round(raised / completed.length) : 0;
    return { raised, donors, pending, avg, count: donations.length };
  }, [donations]);

  const byCampaign = useMemo(() => {
    const map = new Map<string, { title: string; total: number; count: number }>();
    donations
      .filter((d) => d.status === "completed")
      .forEach((d) => {
        const cur = map.get(d.campaignSlug) ?? { title: d.campaignTitle, total: 0, count: 0 };
        cur.total += d.amount;
        cur.count += 1;
        map.set(d.campaignSlug, cur);
      });
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [donations]);

  const filtered = filter === "all" ? donations : donations.filter((d) => d.status === filter);
  const maxCampaign = Math.max(1, ...byCampaign.map((c) => c.total));

  const stats = [
    { label: "Total raised", value: rs(totals.raised), icon: HandCoins, color: "#2E7D5B" },
    { label: "Donors", value: String(totals.donors), icon: Users, color: "#5B2C86" },
    { label: "Avg. donation", value: rs(totals.avg), icon: TrendingUp, color: "#1F7A8C" },
    { label: "Pending", value: rs(totals.pending), icon: Wallet, color: "#D9732B" },
  ];

  return (
    <AdminShell title="Donations" subtitle="Everything received so far — totals, campaigns, and records.">
      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 soft-shadow">
              <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: `${s.color}14`, color: s.color }}>
                <Icon style={{ width: 20, height: 20 }} />
              </div>
              <div className="mt-4 font-mono-stat text-2xl font-bold text-ink">{s.value}</div>
              <div className="mt-0.5 text-sm text-text/60">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Records */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-1.5 overflow-x-auto">
            {(["all", "completed", "pending", "refunded"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ${filter === f ? "bg-primary text-white" : "border border-border bg-card text-text/65 hover:bg-muted"}`}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Empty text="No donations match this filter." />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card soft-shadow">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-text/55">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Donor</th>
                    <th className="px-5 py-3 font-semibold">Campaign</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((d) => (
                    <tr key={d.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-ink">{d.anonymous ? "Anonymous" : d.donor}</div>
                        <div className="text-xs text-text/50">{d.method}</div>
                      </td>
                      <td className="px-5 py-3.5 text-text/75">{d.campaignTitle}</td>
                      <td className="px-5 py-3.5 font-mono-stat font-bold text-ink">{rs(d.amount)}</td>
                      <td className="px-5 py-3.5 text-text/60">{fmtDate(d.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={d.status}
                          onChange={(e) => updateDonationStatus(d.id, e.target.value as Donation["status"])}
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${STATUS_STYLE[d.status]}`}
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button type="button" onClick={() => setDel(d.id)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-lg text-text/50 hover:bg-destructive/10 hover:text-destructive">
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

        {/* By campaign */}
        <div>
          <div className="rounded-2xl border border-border bg-card p-5 soft-shadow">
            <h2 className="font-display text-base font-semibold text-ink">Raised by campaign</h2>
            <p className="mt-0.5 text-sm text-text/55">Completed donations only.</p>
            <div className="mt-4 space-y-4">
              {byCampaign.length === 0 ? (
                <Empty text="No completed donations yet." />
              ) : (
                byCampaign.map((c) => (
                  <div key={c.title}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">{c.title}</span>
                      <span className="font-mono-stat text-text/70">{rs(c.total)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(c.total / maxCampaign) * 100}%` }} />
                    </div>
                    <div className="mt-1 text-xs text-text/45">{c.count} donation{c.count !== 1 ? "s" : ""}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} onConfirm={() => del && deleteDonation(del)} title="Delete donation record?" message="This record will be permanently removed from the list." />
    </AdminShell>
  );
}
