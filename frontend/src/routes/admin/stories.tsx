import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty, RemoveBtn } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useHomeContent, type Story } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/stories")({
  component: StoriesAdminPage,
});

const CATEGORIES = ["News", "Events", "Stories", "Press"];

type Draft = Omit<Story, "id">;
const empty = (): Draft => ({
  title: "",
  slug: "",
  category: CATEGORIES[0],
  date: "",
  excerpt: "",
  readTime: "3 min",
  image: "",
  body: "",
  published: true,
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function StoriesAdminPage() {
  const store = useHomeContent();
  const stories = store.content.stories ?? [];
  const [modal, setModal] = useState<{ open: boolean; id: string | null; data: Draft; slugTouched: boolean }>({
    open: false,
    id: null,
    data: empty(),
    slugTouched: false,
  });
  const [del, setDel] = useState<string | null>(null);

  const openNew = () => setModal({ open: true, id: null, data: empty(), slugTouched: false });
  const openEdit = (s: Story) => {
    const { id, ...rest } = s;
    setModal({ open: true, id, data: { ...rest }, slugTouched: true });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));
  const setD = (patch: Partial<Draft>) => setModal((m) => ({ ...m, data: { ...m.data, ...patch } }));

  const save = () => {
    const data = { ...modal.data, slug: modal.data.slug || slugify(modal.data.title) };
    if (modal.id) store.updateStory(modal.id, data);
    else store.addStory(data);
    close();
  };

  return (
    <AdminShell
      title="News & Stories"
      subtitle="Publish updates, events, and stories from the field."
      actions={
        <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
          <Plus style={{ width: 16, height: 16 }} /> Add story
        </button>
      }
    >
      {stories.length === 0 ? (
        <Empty text="No stories yet. Add your first one." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((s) => (
            <div key={s.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card soft-shadow transition-shadow hover:soft-shadow-lg">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {s.image && <img src={s.image} alt={s.title} className="h-full w-full object-cover" />}
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur">
                  {s.category}
                </span>
                <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${s.published ? "bg-green-light/90 text-green" : "bg-muted/90 text-text/60"}`}>
                  {s.published ? <Eye style={{ width: 12, height: 12 }} /> : <EyeOff style={{ width: 12, height: 12 }} />}
                  {s.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="text-xs text-text/50">{s.date} · {s.readTime}</div>
                <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink">{s.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-text/65">{s.excerpt}</p>
                <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
                  <button type="button" onClick={() => openEdit(s)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary-pale">
                    <Pencil style={{ width: 14, height: 14 }} /> Edit
                  </button>
                  <div className="ml-auto"><RemoveBtn onClick={() => setDel(s.id)} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={modal.open}
        onClose={close}
        title={modal.id ? "Edit story" : "Add story"}
        description="Write and publish a news post or story."
        maxWidth="max-w-2xl"
        footer={
          <>
            <button type="button" onClick={close} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">Cancel</button>
            <button type="button" disabled={!modal.data.title.trim()} onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {modal.id ? "Save changes" : "Publish"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title">
            <TextInput
              value={modal.data.title}
              onChange={(e) => {
                const title = e.target.value;
                setModal((m) => ({ ...m, data: { ...m.data, title, slug: m.slugTouched ? m.data.slug : slugify(title) } }));
              }}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL slug">
              <TextInput value={modal.data.slug} onChange={(e) => setModal((m) => ({ ...m, slugTouched: true, data: { ...m.data, slug: slugify(e.target.value) } }))} />
            </Field>
            <Field label="Category">
              <select value={modal.data.category} onChange={(e) => setD({ category: e.target.value })} className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" hint='e.g. "December 8, 2025"'>
              <TextInput value={modal.data.date} onChange={(e) => setD({ date: e.target.value })} placeholder="December 8, 2025" />
            </Field>
            <Field label="Read time">
              <TextInput value={modal.data.readTime} onChange={(e) => setD({ readTime: e.target.value })} placeholder="4 min" />
            </Field>
          </div>
          <Field label="Excerpt" hint="Short summary shown on cards.">
            <TextArea rows={2} value={modal.data.excerpt} onChange={(e) => setD({ excerpt: e.target.value })} />
          </Field>
          <Field label="Cover image">
            <ImagePicker value={modal.data.image} onChange={(v) => setD({ image: v })} aspect="16 / 9" />
          </Field>
          <Field label="Body">
            <RichTextEditor value={modal.data.body} onChange={(v) => setD({ body: v })} minHeight={200} />
          </Field>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={modal.data.published} onChange={(e) => setD({ published: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
            <span className="text-sm font-semibold text-ink">Published</span>
          </label>
        </div>
      </AdminModal>

      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} onConfirm={() => del && store.removeStory(del)} title="Delete story?" message="This story will be permanently removed. This can't be undone." />
    </AdminShell>
  );
}
