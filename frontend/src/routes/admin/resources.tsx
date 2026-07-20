import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, FileText, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty, RemoveBtn } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { useHomeContent, type Resource } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/resources")({
  component: ResourcesAdminPage,
});

const CATEGORIES = ["Annual Reports", "Research", "Policy Briefs", "Guides"];
const CAT_COLOR: Record<string, string> = {
  "Annual Reports": "#5B2C86",
  Research: "#D9732B",
  "Policy Briefs": "#2D7A4F",
  Guides: "#0891B2",
};

type Draft = Omit<Resource, "id">;
const empty = (): Draft => ({ title: "", category: CATEGORIES[0], year: "2025", desc: "", url: "#" });

function ResourcesAdminPage() {
  const store = useHomeContent();
  const resources = store.content.resources ?? [];
  const [modal, setModal] = useState<{ open: boolean; id: string | null; data: Draft }>({ open: false, id: null, data: empty() });
  const [del, setDel] = useState<string | null>(null);
  const setD = (patch: Partial<Draft>) => setModal((m) => ({ ...m, data: { ...m.data, ...patch } }));

  return (
    <AdminShell
      title="Resources"
      subtitle="Reports, research, policy briefs, and guides."
      actions={
        <button type="button" onClick={() => setModal({ open: true, id: null, data: empty() })} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
          <Plus style={{ width: 16, height: 16 }} /> Add resource
        </button>
      }
    >
      {resources.length === 0 ? (
        <Empty text="No resources yet. Add your first publication." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((r) => {
            const color = CAT_COLOR[r.category] ?? "#5B2C86";
            return (
              <div key={r.id} className="flex gap-4 rounded-2xl border border-border bg-card p-5 soft-shadow">
                <div className="grid h-16 w-12 shrink-0 place-items-center rounded-xl text-2xl text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}AA)` }}>
                  <FileText style={{ width: 20, height: 20 }} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>{r.category} · {r.year}</span>
                  <h3 className="font-display text-base font-semibold text-ink">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-text/65">{r.desc}</p>
                  {r.url && r.url !== "#" && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline">
                      <ExternalLink style={{ width: 12, height: 12 }} /> Link
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button type="button" onClick={() => setModal({ open: true, id: r.id, data: { title: r.title, category: r.category, year: r.year, desc: r.desc, url: r.url } })} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-text/60 hover:bg-primary-pale hover:text-primary">
                    <Pencil style={{ width: 16, height: 16 }} />
                  </button>
                  <RemoveBtn onClick={() => setDel(r.id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminModal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.id ? "Edit resource" : "Add resource"}
        footer={
          <>
            <button type="button" onClick={() => setModal((m) => ({ ...m, open: false }))} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">Cancel</button>
            <button
              type="button"
              disabled={!modal.data.title.trim()}
              onClick={() => {
                if (modal.id) store.updateResource(modal.id, modal.data);
                else store.addResource(modal.data);
                setModal((m) => ({ ...m, open: false }));
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {modal.id ? "Save" : "Add"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title"><TextInput value={modal.data.title} onChange={(e) => setD({ title: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select value={modal.data.category} onChange={(e) => setD({ category: e.target.value })} className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Year"><TextInput value={modal.data.year} onChange={(e) => setD({ year: e.target.value })} /></Field>
          </div>
          <Field label="Description"><TextArea rows={3} value={modal.data.desc} onChange={(e) => setD({ desc: e.target.value })} /></Field>
          <Field label="Download / link URL"><TextInput value={modal.data.url} onChange={(e) => setD({ url: e.target.value })} placeholder="https://…" /></Field>
        </div>
      </AdminModal>

      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} onConfirm={() => del && store.removeResource(del)} title="Delete resource?" message="This publication will be removed." />
    </AdminShell>
  );
}
