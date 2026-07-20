import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Images,
  BarChart3,
  Quote,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import {
  useHomeContent,
  type HeroSlide,
  type ImpactStat,
  type Testimonial,
} from "@/lib/admin/context";

export const Route = createFileRoute("/admin/home")({
  component: HomeAdminPage,
});

type TabKey = "heroSlides" | "impactStats" | "testimonials";

const TABS: { key: TabKey; label: string; icon: typeof Images; singular: string }[] = [
  { key: "heroSlides", label: "Hero Slides", icon: Images, singular: "slide" },
  { key: "impactStats", label: "Impact Stats", icon: BarChart3, singular: "stat" },
  { key: "testimonials", label: "Testimonials", icon: Quote, singular: "testimonial" },
];

type Form = Record<string, string>;

function HomeAdminPage() {
  const store = useHomeContent();
  const { content } = store;
  const [tab, setTab] = useState<TabKey>("heroSlides");
  const [editor, setEditor] = useState<{ open: boolean; id: string | null; form: Form }>({
    open: false,
    id: null,
    form: {},
  });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [resetOpen, setResetOpen] = useState(false);

  const activeTab = TABS.find((t) => t.key === tab)!;
  const items = content[tab];

  /* ------------------------- form helpers ------------------------ */

  const emptyForm = (): Form => {
    if (tab === "heroSlides") return { eyebrow: "", title: "", text: "", image: "" };
    if (tab === "impactStats") return { label: "", value: "", suffix: "" };
    return { quote: "", name: "", role: "" };
  };

  const openAdd = () => setEditor({ open: true, id: null, form: emptyForm() });

  const openEdit = (item: HeroSlide | ImpactStat | Testimonial) => {
    const { id, ...rest } = item as Record<string, unknown> & { id: string };
    const form: Form = {};
    Object.entries(rest).forEach(([k, v]) => (form[k] = String(v)));
    setEditor({ open: true, id, form });
  };

  const setField = (k: string, v: string) =>
    setEditor((e) => ({ ...e, form: { ...e.form, [k]: v } }));

  const save = () => {
    const f = editor.form;
    if (tab === "heroSlides") {
      const data = { eyebrow: f.eyebrow, title: f.title, text: f.text, image: f.image };
      editor.id ? store.updateHeroSlide(editor.id, data) : store.addHeroSlide(data);
    } else if (tab === "impactStats") {
      const data = { label: f.label, value: Number(f.value) || 0, suffix: f.suffix };
      editor.id ? store.updateImpactStat(editor.id, data) : store.addImpactStat(data);
    } else {
      const data = { quote: f.quote, name: f.name, role: f.role };
      editor.id ? store.updateTestimonial(editor.id, data) : store.addTestimonial(data);
    }
    setEditor({ open: false, id: null, form: {} });
  };

  const remove = (id: string) => {
    if (tab === "heroSlides") store.removeHeroSlide(id);
    else if (tab === "impactStats") store.removeImpactStat(id);
    else store.removeTestimonial(id);
  };

  const canSave = () => {
    const f = editor.form;
    if (tab === "heroSlides") return f.title?.trim() && f.image?.trim();
    if (tab === "impactStats") return f.label?.trim() && f.value?.trim();
    return f.quote?.trim() && f.name?.trim();
  };

  /* ---------------------------- render --------------------------- */

  return (
    <AdminShell
      title="Home Page"
      subtitle="Manage the content that appears on your homepage."
      actions={
        <>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-text/70 transition-colors hover:bg-muted sm:inline-flex"
          >
            <RotateCcw style={{ width: 15, height: 15 }} /> Reset
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus style={{ width: 16, height: 16 }} /> Add {activeTab.singular}
          </button>
        </>
      }
    >
      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 soft-shadow">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                active ? "bg-primary text-white" : "text-text/65 hover:bg-muted"
              }`}
            >
              <Icon style={{ width: 16, height: 16 }} />
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-muted text-text/60"
                }`}
              >
                {content[t.key].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <activeTab.icon className="h-10 w-10 text-text/25" />
          <p className="mt-3 font-semibold text-ink">No {activeTab.label.toLowerCase()} yet</p>
          <p className="mt-1 text-sm text-text/55">Add your first {activeTab.singular} to get started.</p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus style={{ width: 16, height: 16 }} /> Add {activeTab.singular}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 soft-shadow transition-shadow hover:soft-shadow-lg"
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => store.move(tab, item.id, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="grid h-6 w-6 place-items-center rounded text-text/50 transition-colors hover:bg-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronUp style={{ width: 16, height: 16 }} />
                </button>
                <button
                  type="button"
                  onClick={() => store.move(tab, item.id, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  className="grid h-6 w-6 place-items-center rounded text-text/50 transition-colors hover:bg-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronDown style={{ width: 16, height: 16 }} />
                </button>
              </div>

              {/* Preview by type */}
              <div className="min-w-0 flex-1">{renderRow(tab, item)}</div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label="Edit"
                  className="grid h-9 w-9 place-items-center rounded-lg text-text/60 transition-colors hover:bg-primary-pale hover:text-primary"
                >
                  <Pencil style={{ width: 16, height: 16 }} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm({ open: true, id: item.id })}
                  aria-label="Delete"
                  className="grid h-9 w-9 place-items-center rounded-lg text-text/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / edit modal */}
      <AdminModal
        open={editor.open}
        onClose={() => setEditor({ open: false, id: null, form: {} })}
        title={`${editor.id ? "Edit" : "Add"} ${activeTab.singular}`}
        description={`${editor.id ? "Update the details of this" : "Create a new"} ${activeTab.singular}.`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditor({ open: false, id: null, form: {} })}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!canSave()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {editor.id ? "Save changes" : "Add"}
            </button>
          </>
        }
      >
        {renderForm(tab, editor.form, setField)}
      </AdminModal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => confirm.id && remove(confirm.id)}
        title={`Delete ${activeTab.singular}?`}
        message={`This ${activeTab.singular} will be removed from your homepage. This action can't be undone.`}
      />

      {/* Reset confirm */}
      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => store.resetAll()}
        title="Reset all homepage content?"
        message="All hero slides, impact stats, and testimonials will be restored to their original defaults. Your changes will be lost."
        confirmLabel="Reset content"
      />
    </AdminShell>
  );
}

/* ------------------------- row previews -------------------------- */

function renderRow(tab: TabKey, item: HeroSlide | ImpactStat | Testimonial) {
  if (tab === "heroSlides") {
    const s = item as HeroSlide;
    return (
      <div className="flex items-center gap-4">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
          {s.image && <img src={s.image} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            {s.eyebrow}
          </div>
          <div className="truncate font-display font-semibold text-ink">{s.title}</div>
          <div className="mt-0.5 line-clamp-1 text-sm text-text/60">{s.text}</div>
        </div>
      </div>
    );
  }
  if (tab === "impactStats") {
    const s = item as ImpactStat;
    return (
      <div className="flex items-center gap-4">
        <div className="font-mono-stat text-3xl font-bold text-primary">
          {s.value}
          {s.suffix}
        </div>
        <div className="text-sm font-semibold uppercase tracking-wider text-text/70">{s.label}</div>
      </div>
    );
  }
  const t = item as Testimonial;
  return (
    <div>
      <p className="line-clamp-2 text-sm italic text-text/80">"{t.quote}"</p>
      <div className="mt-1.5 text-sm">
        <span className="font-semibold text-ink">{t.name}</span>
        <span className="text-text/55"> — {t.role}</span>
      </div>
    </div>
  );
}

/* --------------------------- forms ------------------------------- */

function renderForm(tab: TabKey, form: Form, set: (k: string, v: string) => void) {
  if (tab === "heroSlides") {
    return (
      <div className="space-y-4">
        <Field label="Eyebrow" hint="Small label above the headline.">
          <TextInput
            value={form.eyebrow ?? ""}
            onChange={(e) => set("eyebrow", e.target.value)}
            placeholder="Adaptive Sports"
          />
        </Field>
        <Field label="Title">
          <TextInput
            value={form.title ?? ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Every person deserves a place to play."
          />
        </Field>
        <Field label="Description">
          <TextArea
            rows={3}
            value={form.text ?? ""}
            onChange={(e) => set("text", e.target.value)}
            placeholder="Short supporting sentence for this slide."
          />
        </Field>
        <Field label="Background image" hint="Upload from your device or paste an image URL.">
          <ImagePicker
            value={form.image ?? ""}
            onChange={(v) => set("image", v)}
            aspect="16 / 9"
          />
        </Field>
      </div>
    );
  }
  if (tab === "impactStats") {
    return (
      <div className="space-y-4">
        <Field label="Label">
          <TextInput
            value={form.label ?? ""}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Children Reached"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Value" hint="Number only.">
            <TextInput
              type="number"
              value={form.value ?? ""}
              onChange={(e) => set("value", e.target.value)}
              placeholder="500"
            />
          </Field>
          <Field label="Suffix" hint='e.g. "+" or "%"'>
            <TextInput
              value={form.suffix ?? ""}
              onChange={(e) => set("suffix", e.target.value)}
              placeholder="+"
            />
          </Field>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-text/50">Preview</div>
          <div className="mt-1 font-mono-stat text-3xl font-bold text-primary">
            {form.value || "0"}
            {form.suffix}
          </div>
          <div className="text-xs uppercase tracking-wider text-text/60">{form.label || "Label"}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <Field label="Quote">
        <TextArea
          rows={3}
          value={form.quote ?? ""}
          onChange={(e) => set("quote", e.target.value)}
          placeholder="Nirmala Foundation gave me my first wheelchair…"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <TextInput
            value={form.name ?? ""}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Suman R."
          />
        </Field>
        <Field label="Role">
          <TextInput
            value={form.role ?? ""}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Athlete, Wheelchair Basketball"
          />
        </Field>
      </div>
    </div>
  );
}
