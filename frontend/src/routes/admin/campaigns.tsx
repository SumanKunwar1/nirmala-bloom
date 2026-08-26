import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useHomeContent, type Campaign, type CampaignInput } from "@/lib/admin/context";
import { campaignImages } from "@/lib/images";

export const Route = createFileRoute("/admin/campaigns")({
  component: CampaignsAdminPage,
});

const rs = (n: number) => `Rs ${Math.round(n).toLocaleString()}`;

function blank(): CampaignInput {
  return {
    title: "",
    slug: "",
    icon: "💛",
    color: "#5B2C86",
    image: "",
    goal: 100000,
    raisedOffset: 0,
    donorsOffset: 0,
    urgent: false,
    featured: false,
    desc: "",
    longDesc: "",
    why: "",
    tiers: [],
    stories: [],
    programSlug: "",
    currency: "NPR",
    active: true,
    published: true,
    endsAt: null,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  };
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function CampaignsAdminPage() {
  const { content, addCampaign, updateCampaign, removeCampaign, refreshCampaigns, move } =
    useHomeContent();
  const campaigns = content.campaigns;

  const [editing, setEditing] = useState<Campaign | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<CampaignInput>(blank());
  const [del, setDel] = useState<Campaign | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const live = campaigns.filter((c) => c.published);
    return {
      live: live.length,
      raised: live.reduce((s, c) => s + (c.raised || 0), 0),
      goal: live.reduce((s, c) => s + (c.goal || 0), 0),
      donors: live.reduce((s, c) => s + (c.donors || 0), 0),
    };
  }, [campaigns]);

  const openNew = () => {
    setDraft(blank());
    setEditing(null);
    setCreating(true);
    setError(null);
  };

  const openEdit = (c: Campaign) => {
    // Strip the server-derived fields so only editable ones reach the form.
    const {
      id, raisedOnline, donorsOnline, donationCount, lastDonationAt,
      raised, donors, percent, remaining, acceptsDonations,
      order, createdAt, updatedAt, ...rest
    } = c;
    setDraft(rest);
    setEditing(c);
    setCreating(false);
    setError(null);
  };

  const close = () => {
    setEditing(null);
    setCreating(false);
    setError(null);
  };

  const save = async () => {
    if (!draft.title.trim()) return setError("A title is required.");
    if (!draft.goal || draft.goal <= 0) return setError("Set a fundraising goal above zero.");

    const payload: CampaignInput = {
      ...draft,
      slug: slugify(draft.slug || draft.title),
      goal: Number(draft.goal),
      raisedOffset: Number(draft.raisedOffset) || 0,
      donorsOffset: Number(draft.donorsOffset) || 0,
    };

    setBusy(true);
    setError(null);
    try {
      if (editing) await updateCampaign(editing.id, payload);
      else await addCampaign(payload);
      await refreshCampaigns();
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the campaign.");
    } finally {
      setBusy(false);
    }
  };

  const open = creating || editing !== null;

  return (
    <AdminShell
      title="Donation Campaigns"
      subtitle="What people can give to. Totals below are live from the donation ledger."
    >
      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Live campaigns" value={String(totals.live)} color="#5B2C86" />
        <Stat label="Total raised" value={rs(totals.raised)} color="#2E7D5B" />
        <Stat label="Combined goal" value={rs(totals.goal)} color="#1F7A8C" />
        <Stat label="Supporters" value={String(totals.donors)} color="#D9732B" />
      </div>

      <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text/60">
          Drag order controls how campaigns appear on the public donate page.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refreshCampaigns()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-text/80 hover:bg-muted"
          >
            <RefreshCw style={{ width: 15, height: 15 }} /> Refresh totals
          </button>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus style={{ width: 16, height: 16 }} /> New campaign
          </button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Empty text="No campaigns yet — create your first one." />
      ) : (
        <div className="space-y-3">
          {campaigns.map((c, i) => (
            <div
              key={c.id}
              className="rounded-2xl border border-border bg-card p-4 soft-shadow sm:p-5"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                  style={{ background: `${c.color}18`, color: c.color }}
                >
                  {c.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-ink">{c.title}</h3>
                    {c.urgent && <Tag tone="accent">Urgent</Tag>}
                    {c.featured && <Tag tone="primary">Featured</Tag>}
                    {!c.published && (
                      <Tag tone="muted">
                        <EyeOff style={{ width: 11, height: 11 }} /> Draft
                      </Tag>
                    )}
                    {c.published && !c.acceptsDonations && <Tag tone="muted">Closed</Tag>}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-text/60">/donate/{c.slug}</p>

                  <div className="mt-3 max-w-md">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-mono-stat font-bold text-ink">{rs(c.raised)}</span>
                      <span className="text-xs text-text/55">of {rs(c.goal)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${c.percent}%`, background: c.color }}
                      />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text/50">
                      <span>
                        <strong className="text-ink">{c.percent}%</strong> funded
                      </span>
                      <span>{c.donors} donors</span>
                      <span>
                        online {rs(c.raisedOnline)} · offline {rs(c.raisedOffset)}
                      </span>
                      <span>{c.donationCount} donation{c.donationCount === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <IconBtn label="Move up" disabled={i === 0} onClick={() => move("campaigns", c.id, -1)}>
                    <ArrowUp style={{ width: 15, height: 15 }} />
                  </IconBtn>
                  <IconBtn
                    label="Move down"
                    disabled={i === campaigns.length - 1}
                    onClick={() => move("campaigns", c.id, 1)}
                  >
                    <ArrowDown style={{ width: 15, height: 15 }} />
                  </IconBtn>
                  <IconBtn label="Edit" onClick={() => openEdit(c)}>
                    <Pencil style={{ width: 15, height: 15 }} />
                  </IconBtn>
                  <IconBtn label="Delete" destructive onClick={() => setDel(c)}>
                    <Trash2 style={{ width: 15, height: 15 }} />
                  </IconBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------------- Editor -------------------------- */}
      <AdminModal
        open={open}
        onClose={close}
        title={editing ? `Edit ${editing.title}` : "New campaign"}
        description="Raised totals are derived from the donation ledger and cannot be typed in directly."
        maxWidth="max-w-3xl"
        footer={
          <>
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {busy ? "Saving…" : editing ? "Save changes" : "Create campaign"}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle style={{ width: 15, height: 15, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    title: e.target.value,
                    slug: editing ? d.slug : slugify(e.target.value),
                  }))
                }
                placeholder="Wheelchair Fund"
              />
            </Field>
            <Field label="URL slug" hint="Appears as /donate/your-slug">
              <TextInput
                value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                placeholder="wheelchair-fund"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Icon" hint="A single emoji">
              <TextInput
                value={draft.icon}
                onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
                maxLength={4}
              />
            </Field>
            <Field label="Accent colour">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input bg-card"
                />
                <TextInput
                  value={draft.color}
                  onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))}
                />
              </div>
            </Field>
            <Field label="Goal (Rs)">
              <TextInput
                type="number"
                min={1}
                value={draft.goal}
                onChange={(e) => setDraft((d) => ({ ...d, goal: Number(e.target.value) }))}
              />
            </Field>
          </div>

          <Field
            label="Historic totals raised offline"
            hint="Money and donors from before this site, or from cash/cheque. Online donations are counted automatically on top of these."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                type="number"
                min={0}
                value={draft.raisedOffset}
                onChange={(e) => setDraft((d) => ({ ...d, raisedOffset: Number(e.target.value) }))}
                placeholder="Offline amount (Rs)"
              />
              <TextInput
                type="number"
                min={0}
                value={draft.donorsOffset}
                onChange={(e) => setDraft((d) => ({ ...d, donorsOffset: Number(e.target.value) }))}
                placeholder="Offline donor count"
              />
            </div>
          </Field>

          {editing && (
            <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm text-text/70">
              Live from the ledger — <strong className="text-ink">{rs(editing.raisedOnline)}</strong> from{" "}
              <strong className="text-ink">{editing.donationCount}</strong> online donation
              {editing.donationCount === 1 ? "" : "s"}. Displayed total:{" "}
              <strong className="text-ink">{rs(editing.raised)}</strong>.
            </div>
          )}

          <Field label="Cover image" hint="Leave empty to use the bundled stock photo for this slug.">
            <ImagePicker
              value={draft.image || campaignImages[draft.slug] || ""}
              onChange={(v) => setDraft((d) => ({ ...d, image: v }))}
              aspect="16 / 10"
            />
          </Field>

          <Field label="Short description" hint="Shown on the campaign card.">
            <TextArea
              rows={2}
              value={draft.desc}
              onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
            />
          </Field>
          <Field label="Full description" hint="The main paragraph on the campaign page.">
            <TextArea
              rows={4}
              value={draft.longDesc}
              onChange={(e) => setDraft((d) => ({ ...d, longDesc: e.target.value }))}
            />
          </Field>
          <Field label="Why this matters">
            <TextArea
              rows={3}
              value={draft.why}
              onChange={(e) => setDraft((d) => ({ ...d, why: e.target.value }))}
            />
          </Field>

          {/* Giving tiers */}
          <Field label="Giving tiers" hint="What each amount buys. Shown on the campaign page and the donate form.">
            <div className="space-y-2">
              {draft.tiers.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <TextInput
                    type="number"
                    min={1}
                    value={t.amount}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        tiers: d.tiers.map((x, j) => (j === i ? { ...x, amount: Number(e.target.value) } : x)),
                      }))
                    }
                    className="w-32 shrink-0"
                    placeholder="Rs"
                  />
                  <TextInput
                    value={t.impact}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        tiers: d.tiers.map((x, j) => (j === i ? { ...x, impact: e.target.value } : x)),
                      }))
                    }
                    placeholder="One fitted manual wheelchair"
                  />
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, tiers: d.tiers.filter((_, j) => j !== i) }))}
                    aria-label="Remove tier"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-text/50 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, tiers: [...d.tiers, { amount: 1000, impact: "" }] }))}
                className="rounded-lg border border-dashed border-border px-3.5 py-2 text-sm font-semibold text-text/70 hover:bg-muted"
              >
                + Add tier
              </button>
            </div>
          </Field>

          {/* Beneficiary quotes */}
          <Field label="Supporter & beneficiary quotes">
            <div className="space-y-3">
              {draft.stories.map((st, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className="mb-2 grid gap-2 sm:grid-cols-2">
                    <TextInput
                      value={st.name}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          stories: d.stories.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                        }))
                      }
                      placeholder="Name"
                    />
                    <TextInput
                      value={st.role}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          stories: d.stories.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)),
                        }))
                      }
                      placeholder="Role"
                    />
                  </div>
                  <TextArea
                    rows={2}
                    value={st.quote}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        stories: d.stories.map((x, j) => (j === i ? { ...x, quote: e.target.value } : x)),
                      }))
                    }
                    placeholder="Quote"
                  />
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, stories: d.stories.filter((_, j) => j !== i) }))}
                    className="mt-2 text-xs font-semibold text-destructive"
                  >
                    Remove quote
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setDraft((d) => ({ ...d, stories: [...d.stories, { name: "", role: "", quote: "" }] }))
                }
                className="rounded-lg border border-dashed border-border px-3.5 py-2 text-sm font-semibold text-text/70 hover:bg-muted"
              >
                + Add quote
              </button>
            </div>
          </Field>

          {/* Flags */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Check
              checked={draft.published}
              onChange={(v) => setDraft((d) => ({ ...d, published: v }))}
              label="Published"
              hint="Visible on the public site"
            />
            <Check
              checked={draft.active}
              onChange={(v) => setDraft((d) => ({ ...d, active: v }))}
              label="Accepting donations"
              hint="Turn off to close the campaign but keep the page"
            />
            <Check
              checked={draft.urgent}
              onChange={(v) => setDraft((d) => ({ ...d, urgent: v }))}
              label="Urgent"
              hint="Shows an urgent badge"
            />
            <Check
              checked={draft.featured}
              onChange={(v) => setDraft((d) => ({ ...d, featured: v }))}
              label="Featured"
              hint="Highlighted at the top of the donate page"
            />
          </div>

          <details className="rounded-lg border border-border p-4">
            <summary className="cursor-pointer text-sm font-semibold text-ink">SEO</summary>
            <div className="mt-4 space-y-3">
              <Field label="SEO title">
                <TextInput
                  value={draft.seoTitle}
                  onChange={(e) => setDraft((d) => ({ ...d, seoTitle: e.target.value }))}
                />
              </Field>
              <Field label="SEO description">
                <TextArea
                  rows={2}
                  value={draft.seoDescription}
                  onChange={(e) => setDraft((d) => ({ ...d, seoDescription: e.target.value }))}
                />
              </Field>
              <Field label="SEO keywords">
                <TextInput
                  value={draft.seoKeywords}
                  onChange={(e) => setDraft((d) => ({ ...d, seoKeywords: e.target.value }))}
                />
              </Field>
            </div>
          </details>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        onConfirm={async () => {
          if (!del) return;
          try {
            await removeCampaign(del.id);
            await refreshCampaigns();
          } catch {
            /* the API refuses when donations exist — surfaced in the console */
          }
        }}
        title={`Delete ${del?.title ?? "campaign"}?`}
        message={
          del && del.donationCount > 0
            ? `This campaign holds ${del.donationCount} donation record(s). The server will refuse the delete to protect the financial trail — untick "Published" to archive it instead.`
            : "The campaign will be permanently removed. Donation records are always kept."
        }
      />
    </AdminShell>
  );
}

/* ------------------------------ Bits ------------------------------ */

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 soft-shadow">
      <div className="font-mono-stat text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="mt-0.5 text-sm text-text/60">{label}</div>
    </div>
  );
}

function Tag({ tone, children }: { tone: "accent" | "primary" | "muted"; children: React.ReactNode }) {
  const cls = {
    accent: "bg-accent-light text-accent",
    primary: "bg-primary-pale text-primary",
    muted: "bg-muted text-text/60",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}
    >
      {children}
    </span>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  destructive,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-lg text-text/50 transition-colors disabled:opacity-30 ${
        destructive ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Check({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-primary"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-text/55">{hint}</span>}
      </span>
    </label>
  );
}
