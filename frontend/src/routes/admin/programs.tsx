import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Save,
  ImagePlus,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useHomeContent, type AdminProgram } from "@/lib/admin/context";
import { donationCampaigns } from "@/lib/constants";

export const Route = createFileRoute("/admin/programs")({
  component: ProgramsAdminPage,
});

type Draft = Omit<AdminProgram, "id">;

const PRESET_COLORS = ["#5B2C86", "#D9732B", "#2E7D5B", "#1F7A8C", "#9B5DD5", "#E11D48", "#0891B2"];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const emptyDraft = (): Draft => ({
  title: "",
  slug: "",
  icon: "🌟",
  color: PRESET_COLORS[0],
  tagline: "",
  desc: "",
  image: "",
  body: "",
  goals: [],
  highlights: [],
  gallery: [],
  donateSlug: donationCampaigns[0]?.slug ?? "",
  published: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
});

function ProgramsAdminPage() {
  const store = useHomeContent();
  const programs = store.content.programs ?? [];

  const [view, setView] = useState<"list" | "editor">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const openNew = () => {
    setDraft(emptyDraft());
    setEditingId(null);
    setSlugTouched(false);
    setView("editor");
  };

  const openEdit = (p: AdminProgram) => {
    const { id, ...rest } = p;
    setDraft({ ...rest, goals: [...rest.goals], highlights: rest.highlights.map((h) => ({ ...h })), gallery: [...rest.gallery] });
    setEditingId(id);
    setSlugTouched(true);
    setView("editor");
  };

  const save = () => {
    const clean: Draft = { ...draft, slug: draft.slug || slugify(draft.title) };
    if (editingId) store.updateProgram(editingId, clean);
    else store.addProgram(clean);
    setView("list");
  };

  const canSave = draft.title.trim().length > 0;

  if (view === "editor") {
    return (
      <ProgramEditor
        draft={draft}
        set={set}
        editing={!!editingId}
        canSave={canSave}
        onTitle={(v) => {
          set("title", v);
          if (!slugTouched) set("slug", slugify(v));
        }}
        onSlug={(v) => {
          setSlugTouched(true);
          set("slug", slugify(v));
        }}
        onCancel={() => setView("list")}
        onSave={save}
      />
    );
  }

  return (
    <AdminShell
      title="Programs"
      subtitle="Create and manage the program pages shown on your site."
      actions={
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <Plus style={{ width: 16, height: 16 }} /> Add program
        </button>
      }
    >
      {programs.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <ImagePlus className="h-10 w-10 text-text/25" />
          <p className="mt-3 font-semibold text-ink">No programs yet</p>
          <p className="mt-1 text-sm text-text/55">Add your first program to get started.</p>
          <button
            type="button"
            onClick={openNew}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus style={{ width: 16, height: 16 }} /> Add program
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((p, i) => (
            <div
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card soft-shadow transition-shadow hover:soft-shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div
                  className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-white/95 text-lg backdrop-blur"
                  style={{ color: p.color }}
                >
                  {p.icon}
                </div>
                <span
                  className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${
                    p.published ? "bg-green-light/90 text-green" : "bg-muted/90 text-text/60"
                  }`}
                >
                  {p.published ? <Eye style={{ width: 12, height: 12 }} /> : <EyeOff style={{ width: 12, height: 12 }} />}
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text/45">
                  /programs/{p.slug}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-text/65">{p.desc}</p>

                <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-pale"
                  >
                    <Pencil style={{ width: 15, height: 15 }} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-text/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 style={{ width: 15, height: 15 }} /> Delete
                  </button>
                  <div className="ml-auto flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => store.move("programs", p.id, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className="grid h-8 w-8 place-items-center rounded-lg text-text/50 transition-colors hover:bg-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronUp style={{ width: 16, height: 16 }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => store.move("programs", p.id, 1)}
                      disabled={i === programs.length - 1}
                      aria-label="Move down"
                      className="grid h-8 w-8 place-items-center rounded-lg text-text/50 transition-colors hover:bg-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronDown style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && store.removeProgram(confirmId)}
        title="Delete program?"
        message="This program and all its content will be permanently removed. This action can't be undone."
      />
    </AdminShell>
  );
}

/* ---------------------------- Editor ----------------------------- */

function ProgramEditor({
  draft,
  set,
  editing,
  canSave,
  onTitle,
  onSlug,
  onCancel,
  onSave,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  editing: boolean;
  canSave: boolean;
  onTitle: (v: string) => void;
  onSlug: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const campaigns = useMemo(() => donationCampaigns.map((c) => ({ slug: c.slug, title: c.title })), []);

  // Goals helpers
  const setGoal = (i: number, v: string) =>
    set("goals", draft.goals.map((g, idx) => (idx === i ? v : g)));
  const addGoal = () => set("goals", [...draft.goals, ""]);
  const removeGoal = (i: number) => set("goals", draft.goals.filter((_, idx) => idx !== i));

  // Highlights helpers
  const setHl = (i: number, key: "value" | "label", v: string) =>
    set(
      "highlights",
      draft.highlights.map((h, idx) => (idx === i ? { ...h, [key]: v } : h)),
    );
  const addHl = () => set("highlights", [...draft.highlights, { value: "", label: "" }]);
  const removeHl = (i: number) => set("highlights", draft.highlights.filter((_, idx) => idx !== i));

  // Gallery helpers — add/edit happens in a popup modal
  const removeGallery = (i: number) => set("gallery", draft.gallery.filter((_, idx) => idx !== i));
  const [galleryModal, setGalleryModal] = useState<{ open: boolean; index: number | null; value: string }>({
    open: false,
    index: null,
    value: "",
  });
  const openAddImage = () => setGalleryModal({ open: true, index: null, value: "" });
  const openEditImage = (i: number) => setGalleryModal({ open: true, index: i, value: draft.gallery[i] });
  const closeGalleryModal = () => setGalleryModal({ open: false, index: null, value: "" });
  const saveGalleryImage = () => {
    const v = galleryModal.value.trim();
    if (v) {
      if (galleryModal.index === null) set("gallery", [...draft.gallery, v]);
      else set("gallery", draft.gallery.map((g, idx) => (idx === galleryModal.index ? v : g)));
    }
    closeGalleryModal();
  };

  return (
    <AdminShell
      title={editing ? "Edit program" : "New program"}
      subtitle={draft.title || "Untitled program"}
      actions={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text/70 transition-colors hover:bg-muted"
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Save style={{ width: 16, height: 16 }} /> {editing ? "Save changes" : "Create program"}
          </button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Basics">
            <div className="space-y-4">
              <Field label="Program title">
                <TextInput value={draft.title} onChange={(e) => onTitle(e.target.value)} placeholder="Adaptive Sports" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="URL slug" hint="Shown as /programs/your-slug">
                  <TextInput value={draft.slug} onChange={(e) => onSlug(e.target.value)} placeholder="adaptive-sports" />
                </Field>
                <Field label="Tagline" hint="A short motto for the hero.">
                  <TextInput value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Sport is a right, not a privilege." />
                </Field>
              </div>
              <Field label="Short description" hint="One line used on cards and previews.">
                <TextArea rows={2} value={draft.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Wheelchair basketball, para-badminton, and inclusive recreation." />
              </Field>
            </div>
          </Card>

          <Card title="About this program" subtitle="The full story — use the toolbar to format.">
            <RichTextEditor value={draft.body} onChange={(v) => set("body", v)} minHeight={260} />
          </Card>

          <Card
            title="Goals"
            action={
              <button type="button" onClick={addGoal} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent">
                <Plus style={{ width: 15, height: 15 }} /> Add goal
              </button>
            }
          >
            {draft.goals.length === 0 ? (
              <Empty text="No goals yet. Add what this program sets out to achieve." />
            ) : (
              <div className="space-y-2">
                {draft.goals.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 shrink-0 text-text/30" />
                    <TextInput value={g} onChange={(e) => setGoal(i, e.target.value)} placeholder="Make competitive sport accessible to everyone." />
                    <RemoveBtn onClick={() => removeGoal(i)} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Impact highlights"
            subtitle="Big stat numbers shown across the program."
            action={
              <button type="button" onClick={addHl} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent">
                <Plus style={{ width: 15, height: 15 }} /> Add highlight
              </button>
            }
          >
            {draft.highlights.length === 0 ? (
              <Empty text="No highlights yet. Add a value and a label, e.g. 250+ / athletes." />
            ) : (
              <div className="space-y-2">
                {draft.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <TextInput className="max-w-[8rem]" value={h.value} onChange={(e) => setHl(i, "value", e.target.value)} placeholder="250+" />
                    <TextInput value={h.label} onChange={(e) => setHl(i, "label", e.target.value)} placeholder="Active athletes" />
                    <RemoveBtn onClick={() => removeHl(i)} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="SEO & Metadata" subtitle="How this program appears in search results and shared links.">
            <div className="space-y-4">
              <Field label="Meta title" hint={`${(draft.seoTitle || "").length} characters · ~60 recommended`}>
                <TextInput
                  value={draft.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  placeholder={`${draft.title || "Program"} | Nirmala Foundation Nepal`}
                />
              </Field>
              <Field label="Meta description" hint={`${(draft.seoDescription || "").length} characters · ~155 recommended`}>
                <TextArea
                  rows={3}
                  value={draft.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  placeholder={draft.desc || "A short summary shown under the title in search results."}
                />
              </Field>
              <Field label="Focus keywords" hint="Comma-separated — e.g. adaptive sports, disability, Nepal">
                <TextInput
                  value={draft.seoKeywords}
                  onChange={(e) => set("seoKeywords", e.target.value)}
                  placeholder="adaptive sports, inclusion, Nepal"
                />
              </Field>

              {/* Google-style search preview */}
              <div>
                <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text/50">
                  Search preview
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="text-xs text-green">
                    nirmalafoundation.org.np › programs › {draft.slug || "slug"}
                  </div>
                  <div className="mt-0.5 truncate text-lg" style={{ color: "#1a0dab" }}>
                    {draft.seoTitle || `${draft.title || "Program"} | Nirmala Foundation Nepal`}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-sm text-text/70">
                    {draft.seoDescription || draft.desc || "Add a meta description to control this snippet."}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Main image">
            <ImagePicker value={draft.image} onChange={(v) => set("image", v)} aspect="16 / 11" hint="This is the program's hero photo." />
          </Card>

          <Card title="Appearance">
            <div className="space-y-4">
              <Field label="Icon (emoji)">
                <TextInput value={draft.icon} onChange={(e) => set("icon", e.target.value)} placeholder="🏀" className="max-w-[6rem] text-center text-lg" />
              </Field>
              <Field label="Theme color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={draft.color}
                    onChange={(e) => set("color", e.target.value)}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-card"
                    aria-label="Theme color"
                  />
                  <TextInput value={draft.color} onChange={(e) => set("color", e.target.value)} placeholder="#5B2C86" />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("color", c)}
                      aria-label={`Use ${c}`}
                      className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                        draft.color.toLowerCase() === c.toLowerCase() ? "border-ink" : "border-white"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </Field>
            </div>
          </Card>

          <Card title="Donation link">
            <Field label="Linked campaign" hint="The 'Donate now' button targets this campaign.">
              <select
                value={draft.donateSlug}
                onChange={(e) => set("donateSlug", e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {campaigns.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
          </Card>

          <Card title="Status">
            <button
              type="button"
              onClick={() => set("published", !draft.published)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3"
            >
              <span className="text-sm font-semibold text-ink">
                {draft.published ? "Published" : "Draft"}
              </span>
              <span
                className={`relative h-6 w-11 rounded-full transition-colors ${draft.published ? "bg-green" : "bg-border"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    draft.published ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          </Card>
        </div>

        {/* Gallery — full width, plenty of space for images */}
        <div className="lg:col-span-3">
          <Card
            title="Gallery"
            subtitle="Add as many photos as you like — upload from your device or paste URLs."
            action={
              <button type="button" onClick={openAddImage} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent">
                <ImagePlus style={{ width: 15, height: 15 }} /> Add image
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {draft.gallery.map((g, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                >
                  {g && <img src={g} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/45 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openEditImage(i)}
                      aria-label="Replace image"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-ink transition-colors hover:bg-white"
                    >
                      <Pencil style={{ width: 16, height: 16 }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGallery(i)}
                      aria-label="Remove image"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-destructive transition-colors hover:bg-white"
                    >
                      <Trash2 style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                  <span className="absolute left-2 top-2 rounded-md bg-ink/55 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                    {i + 1}
                  </span>
                </div>
              ))}

              {/* Add tile */}
              <button
                type="button"
                onClick={openAddImage}
                className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-text/50 transition-colors hover:border-primary/40 hover:text-primary"
              >
                <span className="text-center">
                  <ImagePlus className="mx-auto h-7 w-7" />
                  <span className="mt-1.5 block text-xs font-semibold">Add image</span>
                </span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Gallery add/replace popup */}
      <AdminModal
        open={galleryModal.open}
        onClose={closeGalleryModal}
        title={galleryModal.index === null ? "Add gallery image" : "Replace image"}
        description="Upload a photo from your device or paste an image URL."
        footer={
          <>
            <button
              type="button"
              onClick={closeGalleryModal}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveGalleryImage}
              disabled={!galleryModal.value.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {galleryModal.index === null ? "Add to gallery" : "Replace"}
            </button>
          </>
        }
      >
        <ImagePicker
          value={galleryModal.value}
          onChange={(v) => setGalleryModal((m) => ({ ...m, value: v }))}
          aspect="4 / 3"
        />
      </AdminModal>
    </AdminShell>
  );
}

/* --------------------------- Bits -------------------------------- */

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 soft-shadow md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-text/60">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-text/55">
      {text}
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 style={{ width: 16, height: 16 }} />
    </button>
  );
}
