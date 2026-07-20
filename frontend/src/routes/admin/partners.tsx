import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Star, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty, RemoveBtn } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useHomeContent, type PartnerItem } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/partners")({
  component: PartnersAdminPage,
});

const REGIONS = ["International", "National"];
const TYPES = ["Strategic", "Programme", "Corporate", "Community", "Media"];

type Draft = Omit<PartnerItem, "id">;
const empty = (): Draft => ({
  name: "",
  tagline: "",
  desc: "",
  region: REGIONS[0],
  type: TYPES[0],
  since: "2025",
  areas: [],
  url: "",
  color: "#5B2C86",
  logo: "",
  featured: false,
});

function PartnersAdminPage() {
  const store = useHomeContent();
  const partners = store.content.partners ?? [];
  const [modal, setModal] = useState<{ open: boolean; id: string | null; data: Draft; areasText: string }>({ open: false, id: null, data: empty(), areasText: "" });
  const [del, setDel] = useState<string | null>(null);
  const setD = (patch: Partial<Draft>) => setModal((m) => ({ ...m, data: { ...m.data, ...patch } }));

  const openNew = () => setModal({ open: true, id: null, data: empty(), areasText: "" });
  const openEdit = (p: PartnerItem) => {
    const { id, ...rest } = p;
    setModal({ open: true, id, data: { ...rest, areas: [...rest.areas] }, areasText: rest.areas.join(", ") });
  };
  const save = () => {
    const areas = modal.areasText.split(",").map((a) => a.trim()).filter(Boolean);
    const data = { ...modal.data, areas };
    if (modal.id) store.updatePartner(modal.id, data);
    else store.addPartner(data);
    setModal((m) => ({ ...m, open: false }));
  };

  return (
    <AdminShell
      title="Partners"
      subtitle="Organisations and supporters you work with."
      actions={<button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"><Plus style={{ width: 16, height: 16 }} /> Add partner</button>}
    >
      {partners.length === 0 ? (
        <Empty text="No partners yet. Add your first one." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partners.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 soft-shadow">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl text-white" style={{ backgroundColor: p.color }}>
                  {p.logo ? <img src={p.logo} alt={p.name} className="h-full w-full object-cover" /> : <span className="text-sm font-bold">{p.name.slice(0, 2).toUpperCase()}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-display font-semibold text-ink">{p.name}</h3>
                    {p.featured && <Star style={{ width: 14, height: 14 }} className="shrink-0 fill-accent text-accent" />}
                  </div>
                  <div className="truncate text-xs text-text/55">{p.tagline}</div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 flex-1 text-sm text-text/65">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge>{p.region}</Badge>
                <Badge>{p.type}</Badge>
                <Badge>Since {p.since}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
                <button type="button" onClick={() => openEdit(p)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary-pale"><Pencil style={{ width: 14, height: 14 }} /> Edit</button>
                {p.url && p.url !== "#" && <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-text/50 hover:text-teal"><ExternalLink style={{ width: 14, height: 14 }} /></a>}
                <div className="ml-auto"><RemoveBtn onClick={() => setDel(p.id)} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.id ? "Edit partner" : "Add partner"}
        maxWidth="max-w-xl"
        footer={
          <>
            <button type="button" onClick={() => setModal((m) => ({ ...m, open: false }))} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">Cancel</button>
            <button type="button" disabled={!modal.data.name.trim()} onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{modal.id ? "Save" : "Add"}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><TextInput value={modal.data.name} onChange={(e) => setD({ name: e.target.value })} /></Field>
            <Field label="Tagline"><TextInput value={modal.data.tagline} onChange={(e) => setD({ tagline: e.target.value })} /></Field>
          </div>
          <Field label="Description"><TextArea rows={2} value={modal.data.desc} onChange={(e) => setD({ desc: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Region">
              <select value={modal.data.region} onChange={(e) => setD({ region: e.target.value })} className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <select value={modal.data.type} onChange={(e) => setD({ type: e.target.value })} className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Since"><TextInput value={modal.data.since} onChange={(e) => setD({ since: e.target.value })} /></Field>
          </div>
          <Field label="Focus areas" hint="Comma-separated"><TextInput value={modal.areasText} onChange={(e) => setModal((m) => ({ ...m, areasText: e.target.value }))} placeholder="Gender, Advocacy, Research" /></Field>
          <Field label="Website URL"><TextInput value={modal.data.url} onChange={(e) => setD({ url: e.target.value })} placeholder="https://…" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand color">
              <div className="flex items-center gap-2">
                <input type="color" value={modal.data.color} onChange={(e) => setD({ color: e.target.value })} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-border" aria-label="Color" />
                <TextInput value={modal.data.color} onChange={(e) => setD({ color: e.target.value })} />
              </div>
            </Field>
            <Field label="Featured">
              <button type="button" onClick={() => setD({ featured: !modal.data.featured })} className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-2.5">
                <span className="text-sm font-semibold text-ink">{modal.data.featured ? "Featured" : "Standard"}</span>
                <span className={`relative h-6 w-11 rounded-full transition-colors ${modal.data.featured ? "bg-green" : "bg-border"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${modal.data.featured ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </span>
              </button>
            </Field>
          </div>
          <Field label="Logo"><ImagePicker value={modal.data.logo} onChange={(v) => setD({ logo: v })} aspect="1 / 1" /></Field>
        </div>
      </AdminModal>

      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} onConfirm={() => del && store.removePartner(del)} title="Delete partner?" message="This partner will be removed." />
    </AdminShell>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-text/60">{children}</span>;
}
