import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, ArrowLeft, Save, ImagePlus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Empty, RemoveBtn } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useHomeContent, type GalleryAlbum } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdminPage,
});

const PRESET_COLORS = ["#5B2C86", "#D9732B", "#2E7D5B", "#1F7A8C", "#9B5DD5", "#E11D48", "#0891B2"];
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

type Draft = Omit<GalleryAlbum, "id">;
const empty = (): Draft => ({ title: "", slug: "", color: PRESET_COLORS[0], cover: "", images: [] });

function GalleryAdminPage() {
  const store = useHomeContent();
  const albums = store.content.galleryAlbums ?? [];
  const [view, setView] = useState<"list" | "editor">("list");
  const [id, setId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [del, setDel] = useState<string | null>(null);
  const [imgModal, setImgModal] = useState<{ open: boolean; index: number | null; value: string }>({ open: false, index: null, value: "" });

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const openNew = () => { setDraft(empty()); setId(null); setSlugTouched(false); setView("editor"); };
  const openEdit = (a: GalleryAlbum) => { const { id: _id, ...rest } = a; setDraft({ ...rest, images: [...rest.images] }); setId(a.id); setSlugTouched(true); setView("editor"); };
  const save = () => {
    const clean = { ...draft, slug: draft.slug || slugify(draft.title) };
    if (id) store.updateAlbum(id, clean);
    else store.addAlbum(clean);
    setView("list");
  };

  const saveImg = () => {
    const v = imgModal.value.trim();
    if (v) {
      if (imgModal.index === null) set("images", [...draft.images, v]);
      else set("images", draft.images.map((g, i) => (i === imgModal.index ? v : g)));
    }
    setImgModal({ open: false, index: null, value: "" });
  };

  if (view === "editor") {
    return (
      <AdminShell
        title={id ? "Edit album" : "New album"}
        subtitle={draft.title || "Untitled album"}
        actions={
          <>
            <button type="button" onClick={() => setView("list")} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text/70 hover:bg-muted"><ArrowLeft style={{ width: 16, height: 16 }} /> Back</button>
            <button type="button" disabled={!draft.title.trim()} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save style={{ width: 16, height: 16 }} /> {id ? "Save changes" : "Create album"}</button>
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title="Album details">
              <div className="space-y-4">
                <Field label="Title">
                  <TextInput value={draft.title} onChange={(e) => { const t = e.target.value; setDraft((d) => ({ ...d, title: t, slug: slugTouched ? d.slug : slugify(t) })); }} />
                </Field>
                <Field label="URL slug"><TextInput value={draft.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} /></Field>
                <Field label="Theme color">
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button key={c} type="button" onClick={() => set("color", c)} aria-label={c} className={`h-8 w-8 rounded-full border-2 ${draft.color.toLowerCase() === c.toLowerCase() ? "border-ink" : "border-white"}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </Field>
              </div>
            </Card>

            <Card title="Photos" subtitle="Upload from device or paste URLs." action={<button type="button" onClick={() => setImgModal({ open: true, index: null, value: "" })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"><ImagePlus style={{ width: 15, height: 15 }} /> Add photo</button>}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {draft.images.map((g, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                    {g && <img src={g} alt="" className="h-full w-full object-cover" />}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/45 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" onClick={() => setImgModal({ open: true, index: i, value: g })} className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-ink hover:bg-white"><Pencil style={{ width: 16, height: 16 }} /></button>
                      <button type="button" onClick={() => set("images", draft.images.filter((_, idx) => idx !== i))} className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-destructive hover:bg-white"><Trash2 style={{ width: 16, height: 16 }} /></button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setImgModal({ open: true, index: null, value: "" })} className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-text/50 hover:border-primary/40 hover:text-primary">
                  <span className="text-center"><ImagePlus className="mx-auto h-7 w-7" /><span className="mt-1.5 block text-xs font-semibold">Add photo</span></span>
                </button>
              </div>
            </Card>
          </div>

          <div>
            <Card title="Cover image"><ImagePicker value={draft.cover} onChange={(v) => set("cover", v)} aspect="4 / 3" /></Card>
          </div>
        </div>

        <AdminModal
          open={imgModal.open}
          onClose={() => setImgModal({ open: false, index: null, value: "" })}
          title={imgModal.index === null ? "Add photo" : "Replace photo"}
          footer={
            <>
              <button type="button" onClick={() => setImgModal({ open: false, index: null, value: "" })} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">Cancel</button>
              <button type="button" disabled={!imgModal.value.trim()} onClick={saveImg} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{imgModal.index === null ? "Add" : "Replace"}</button>
            </>
          }
        >
          <ImagePicker value={imgModal.value} onChange={(v) => setImgModal((m) => ({ ...m, value: v }))} aspect="4 / 3" />
        </AdminModal>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Gallery"
      subtitle="Manage photo albums."
      actions={<button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"><Plus style={{ width: 16, height: 16 }} /> Add album</button>}
    >
      {albums.length === 0 ? (
        <Empty text="No albums yet. Create your first one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <div key={a.id} className="group overflow-hidden rounded-2xl border border-border bg-card soft-shadow transition-shadow hover:soft-shadow-lg">
              <div className="relative aspect-[3/2] overflow-hidden bg-muted" style={{ backgroundColor: `${a.color}22` }}>
                {a.cover && <img src={a.cover} alt={a.title} className="h-full w-full object-cover" />}
                <span className="absolute bottom-3 left-3 rounded-full bg-ink/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{a.images.length} photos</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <h3 className="truncate font-display font-semibold text-ink">{a.title}</h3>
                  <div className="text-xs text-text/45">/gallery/{a.slug}</div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => openEdit(a)} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-text/60 hover:bg-primary-pale hover:text-primary"><Pencil style={{ width: 16, height: 16 }} /></button>
                  <RemoveBtn onClick={() => setDel(a.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} onConfirm={() => del && store.removeAlbum(del)} title="Delete album?" message="This album and its photos will be removed." />
    </AdminShell>
  );
}
