import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  HandCoins,
  Users,
  TrendingUp,
  Wallet,
  Trash2,
  Download,
  RefreshCw,
  Plus,
  Mail,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { useHomeContent } from "@/lib/admin/context";
import {
  useDonations,
  updateDonationStatus,
  updateDonation,
  clearDonationReview,
  deleteDonation,
  addDonation,
  resendDonationReceipt,
  exportDonationsCsv,
  reconcilePayments,
  reloadDonations,
  getDonationStats,
  type Donation,
  type DonationStats,
  type DonationStatus,
} from "@/lib/admin/inbox";

export const Route = createFileRoute("/admin/donations")({
  component: DonationsAdminPage,
});

const rs = (n: number) => `Rs ${Math.round(n).toLocaleString()}`;

/** The donor paid in their own currency; show it, with the NPR value beneath. */
function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
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

const STATUS_STYLE: Record<DonationStatus, string> = {
  completed: "bg-green-light text-green",
  pending: "bg-accent-light text-accent",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-text/60",
  refunded: "bg-muted text-text/60",
};

type Filter = "all" | DonationStatus | "review";

function DonationsAdminPage() {
  const donations = useDonations();
  const { content } = useHomeContent();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState<string | null>(null);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [review, setReview] = useState<Donation | null>(null);

  const loadStats = () => getDonationStats().then(setStats).catch(() => {});
  useEffect(() => {
    loadStats();
  }, [donations.length]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const reviewCount = donations.filter((d) => d.needsReview).length;

  const filtered = useMemo(() => {
    let list = donations;
    if (filter === "review") list = list.filter((d) => d.needsReview);
    else if (filter !== "all") list = list.filter((d) => d.status === filter);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((d) =>
        [d.donor, d.email, d.reference, d.receiptNo, d.campaignTitle]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return list;
  }, [donations, filter, query]);

  const maxCampaign = Math.max(1, ...(stats?.byCampaign ?? []).map((c) => c.total));
  const maxMonth = Math.max(1, ...(stats?.monthly ?? []).map((m) => m.total));

  const statCards = [
    { label: "Total raised", value: rs(stats?.raised ?? 0), icon: HandCoins, color: "#2E7D5B" },
    { label: "Donors", value: String(stats?.donors ?? 0), icon: Users, color: "#5B2C86" },
    { label: "Avg. donation", value: rs(stats?.average ?? 0), icon: TrendingUp, color: "#1F7A8C" },
    {
      label: `Pending (${stats?.pendingCount ?? 0})`,
      value: rs(stats?.pending ?? 0),
      icon: Wallet,
      color: "#D9732B",
    },
  ];

  const runReconcile = async () => {
    setBusy("reconcile");
    try {
      const s = await reconcilePayments();
      await loadStats();
      flash(`Checked ${s.checked} payment(s) with the bank — ${s.settled} settled.`);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Reconcile failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminShell
      title="Donations"
      subtitle={`Every gift received — including payments the gateway reported on its own. Totals in ${stats?.currency ?? "NPR"}.`}
    >
      {toast && (
        <div className="mb-4 rounded-xl border border-primary/25 bg-primary-pale/50 px-4 py-3 text-sm text-ink">
          {toast}
        </div>
      )}

      {reviewCount > 0 && (
        <button
          type="button"
          onClick={() => setFilter("review")}
          className="mb-4 flex w-full items-center gap-3 rounded-xl border border-accent/30 bg-accent-light/40 px-4 py-3 text-left text-sm transition-colors hover:bg-accent-light/60"
        >
          <AlertTriangle style={{ width: 18, height: 18 }} className="shrink-0 text-accent" />
          <span className="text-text/80">
            <strong className="text-ink">
              {reviewCount} payment{reviewCount === 1 ? "" : "s"} need review
            </strong>{" "}
            — the gateway reported money with no matching donation. Attribute them to the right donor and
            campaign.
          </span>
        </button>
      )}

      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 soft-shadow">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ backgroundColor: `${s.color}14`, color: s.color }}
              >
                <Icon style={{ width: 20, height: 20 }} />
              </div>
              <div className="mt-4 font-mono-stat text-2xl font-bold text-ink">{s.value}</div>
              <div className="mt-0.5 text-sm text-text/60">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search donor, email, reference or receipt…"
          className="min-w-[220px] flex-1 rounded-lg border border-input bg-card px-3.5 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 transition-transform"
        >
          <Plus style={{ width: 15, height: 15 }} /> Record offline gift
        </button>
        <button
          type="button"
          onClick={runReconcile}
          disabled={busy === "reconcile"}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-text/80 hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw style={{ width: 15, height: 15 }} />
          {busy === "reconcile" ? "Checking…" : "Reconcile with bank"}
        </button>
        <button
          type="button"
          onClick={() => exportDonationsCsv().catch(() => flash("Export failed."))}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-text/80 hover:bg-muted"
        >
          <Download style={{ width: 15, height: 15 }} /> CSV
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Records */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-1.5 overflow-x-auto">
            {(["all", "completed", "pending", "failed", "refunded", "review"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ${
                  filter === f
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-text/65 hover:bg-muted"
                }`}
              >
                {f === "review" ? `Needs review${reviewCount ? ` (${reviewCount})` : ""}` : f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Empty text="No donations match this filter." />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card soft-shadow">
              <table className="w-full min-w-[760px] text-left text-sm">
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
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink">
                            {d.anonymous ? "Anonymous" : d.donor}
                          </span>
                          {d.needsReview && (
                            <span className="rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                              Review
                            </span>
                          )}
                          {d.recurring && (
                            <span className="rounded-full bg-primary-pale px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                              Monthly
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-text/50">
                          {d.method}
                          {d.source === "gateway" && " · gateway-reported"}
                          {d.source === "manual" && " · offline"}
                        </div>
                        {d.receiptNo && (
                          <div className="font-mono-stat text-[11px] text-text/40">{d.receiptNo}</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-text/75">{d.campaignTitle}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-mono-stat font-bold text-ink">
                          {money(d.amount, d.currency)}
                        </div>
                        {d.currency !== d.baseCurrency && (
                          <div className="font-mono-stat text-[11px] text-text/45">
                            ≈ {rs(d.baseAmount)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-text/60">
                        {fmtDate(d.completedAt ?? d.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={d.status}
                          onChange={(e) =>
                            updateDonationStatus(d.id, e.target.value as DonationStatus)
                              .then(() => loadStats())
                              .catch((err) => flash(err.message))
                          }
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${STATUS_STYLE[d.status]}`}
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {d.needsReview && (
                            <button
                              type="button"
                              onClick={() => setReview(d)}
                              aria-label="Review"
                              title="Attribute this payment"
                              className="grid h-8 w-8 place-items-center rounded-lg text-accent hover:bg-accent-light"
                            >
                              <ShieldCheck style={{ width: 15, height: 15 }} />
                            </button>
                          )}
                          {d.status === "completed" && d.email && (
                            <button
                              type="button"
                              onClick={() =>
                                resendDonationReceipt(d.id)
                                  .then((r) =>
                                    flash(r.skipped ? "SMTP is off — receipt logged only." : "Receipt sent."),
                                  )
                                  .catch((err) => flash(err.message))
                              }
                              aria-label="Resend receipt"
                              title="Resend receipt"
                              className="grid h-8 w-8 place-items-center rounded-lg text-text/50 hover:bg-muted hover:text-ink"
                            >
                              <Mail style={{ width: 15, height: 15 }} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setDel(d.id)}
                            aria-label="Delete"
                            className="grid h-8 w-8 place-items-center rounded-lg text-text/50 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 style={{ width: 15, height: 15 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side panels */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 soft-shadow">
            <h2 className="font-display text-base font-semibold text-ink">Raised by campaign</h2>
            <p className="mt-0.5 text-sm text-text/55">Completed donations only.</p>
            <div className="mt-4 space-y-4">
              {!stats?.byCampaign.length ? (
                <Empty text="No completed donations yet." />
              ) : (
                stats.byCampaign.map((c) => (
                  <div key={c.slug}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">{c.title}</span>
                      <span className="font-mono-stat text-text/70">{rs(c.total)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(c.total / maxCampaign) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-text/45">
                      {c.count} donation{c.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {!!stats?.monthly.length && (
            <div className="rounded-2xl border border-border bg-card p-5 soft-shadow">
              <h2 className="font-display text-base font-semibold text-ink">Last 12 months</h2>
              <div className="mt-4 flex h-28 items-end gap-1.5">
                {stats.monthly.map((m) => (
                  <div key={m.month} className="group relative flex-1">
                    <div
                      className="w-full rounded-t bg-primary/70 transition-colors group-hover:bg-primary"
                      style={{ height: `${Math.max(4, (m.total / maxMonth) * 100)}px` }}
                    />
                    <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] text-white group-hover:block">
                      {m.month}: {rs(m.total)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-text/45">
                <span>{stats.monthly[0]?.month}</span>
                <span>{stats.monthly[stats.monthly.length - 1]?.month}</span>
              </div>
            </div>
          )}

          {!!stats?.byGateway.length && (
            <div className="rounded-2xl border border-border bg-card p-5 soft-shadow">
              <h2 className="font-display text-base font-semibold text-ink">By payment method</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {stats.byGateway.map((g) => (
                  <li key={g.gateway} className="flex justify-between">
                    <span className="capitalize text-text/70">{g.gateway}</span>
                    <span className="font-mono-stat text-ink">
                      {rs(g.total)} <span className="text-text/40">· {g.count}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!!stats?.byCurrency.length && stats.byCurrency.length > 1 && (
            <div className="rounded-2xl border border-border bg-card p-5 soft-shadow">
              <h2 className="font-display text-base font-semibold text-ink">By currency</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {stats.byCurrency.map((c) => (
                  <li key={c.currency} className="flex justify-between">
                    <span className="text-text/70">{c.currency}</span>
                    <span className="font-mono-stat text-ink">
                      {money(c.total, c.currency)} <span className="text-text/40">· {c.count}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <AddDonationModal
        open={adding}
        onClose={() => setAdding(false)}
        campaigns={content.campaigns.map((c) => ({ slug: c.slug, title: c.title }))}
        onSaved={() => {
          loadStats();
          flash("Donation recorded.");
        }}
      />

      <ReviewModal
        donation={review}
        onClose={() => setReview(null)}
        campaigns={content.campaigns.map((c) => ({ slug: c.slug, title: c.title }))}
        onSaved={() => {
          loadStats();
          flash("Payment attributed.");
        }}
      />

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        onConfirm={() => del && deleteDonation(del).then(loadStats)}
        title="Delete donation record?"
        message="This permanently removes the record and adjusts campaign totals. Prefer marking it refunded if money actually moved."
      />
    </AdminShell>
  );
}

/* ------------------- Record an offline donation ------------------- */

function AddDonationModal({
  open,
  onClose,
  campaigns,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  campaigns: { slug: string; title: string }[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    donor: "",
    email: "",
    amount: 0,
    currency: "NPR",
    campaignSlug: campaigns[0]?.slug ?? "general-fund",
    method: "Bank transfer",
    status: "completed" as DonationStatus,
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!form.donor.trim()) return setError("A donor name is required.");
    if (!form.amount || form.amount <= 0) return setError("Enter an amount above zero.");
    setBusy(true);
    setError(null);
    try {
      await addDonation(form);
      onSaved();
      onClose();
      setForm((f) => ({ ...f, donor: "", email: "", amount: 0, message: "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record the donation.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Record an offline gift"
      description="Cash, cheque or a transfer that already landed. A receipt is issued automatically when marked completed."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          >
            {busy ? "Saving…" : "Record donation"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Donor name">
            <TextInput value={form.donor} onChange={(e) => setForm({ ...form, donor: e.target.value })} />
          </Field>
          <Field label="Email" hint="Needed to send a receipt">
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Amount">
            <TextInput
              type="number"
              min={1}
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </Field>
          <Field label="Currency">
            <TextInput
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as DonationStatus })}
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Campaign">
            <select
              value={form.campaignSlug}
              onChange={(e) => setForm({ ...form, campaignSlug: e.target.value })}
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            >
              {campaigns.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Method">
            <TextInput value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} />
          </Field>
        </div>
        <Field label="Note (optional)">
          <TextArea
            rows={2}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </Field>
      </div>
    </AdminModal>
  );
}

/* ------------- Attribute an unmatched gateway payment ------------- */

function ReviewModal({
  donation,
  onClose,
  campaigns,
  onSaved,
}: {
  donation: Donation | null;
  onClose: () => void;
  campaigns: { slug: string; title: string }[];
  onSaved: () => void;
}) {
  const [donor, setDonor] = useState("");
  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState("general-fund");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!donation) return;
    setDonor(donation.donor);
    setEmail(donation.email);
    setSlug(donation.campaignSlug);
    setError(null);
  }, [donation]);

  const save = async () => {
    if (!donation) return;
    setBusy(true);
    setError(null);
    try {
      const campaign = campaigns.find((c) => c.slug === slug);
      await updateDonation(donation.id, {
        donor: donor.trim() || donation.donor,
        email: email.trim(),
        campaignSlug: slug,
        campaignTitle: campaign?.title ?? donation.campaignTitle,
      });
      await clearDonationReview(donation.id, `Attributed by an admin on ${new Date().toDateString()}`);
      await reloadDonations();
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminModal
      open={donation !== null}
      onClose={onClose}
      title="Attribute this payment"
      description="The gateway reported this money without a matching donation. Assign it to the right donor and campaign."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save & clear flag"}
          </button>
        </>
      }
    >
      {donation && (
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-4 text-sm">
            <div>
              <dt className="text-xs text-text/50">Amount</dt>
              <dd className="font-mono-stat font-semibold text-ink">
                {money(donation.amount, donation.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text/50">Reference</dt>
              <dd className="truncate font-mono-stat text-ink">{donation.reference}</dd>
            </div>
            <div>
              <dt className="text-xs text-text/50">Gateway</dt>
              <dd className="capitalize text-ink">{donation.gateway || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-text/50">Receipt</dt>
              <dd className="font-mono-stat text-ink">{donation.receiptNo || "—"}</dd>
            </div>
          </dl>

          {donation.reviewNote && (
            <p className="rounded-lg border border-accent/25 bg-accent-light/30 px-3.5 py-2.5 text-sm text-text/75">
              {donation.reviewNote}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Donor name">
              <TextInput value={donor} onChange={(e) => setDonor(e.target.value)} />
            </Field>
            <Field label="Email" hint="Adding one lets you send a receipt">
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          </div>
          <Field label="Campaign" hint="Moving it re-syncs both campaigns' totals.">
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            >
              {campaigns.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
    </AdminModal>
  );
}
