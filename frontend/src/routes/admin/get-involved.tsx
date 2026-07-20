import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty, RemoveBtn } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { useHomeContent, type InvolveWay } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/get-involved")({
  component: GetInvolvedAdminPage,
});

type Draft = Omit<InvolveWay, "id">;
const empty = (): Draft => ({ icon: "🙌", title: "", text: "", cta: "" });

function GetInvolvedAdminPage() {
  const store = useHomeContent();
  const items = store.content.getInvolved ?? [];
  const [modal, setModal] = useState<{ open: boolean; id: string | null; data: Draft }>({ open: false, id: null, data: empty() });
  const [del, setDel] = useState<string | null>(null);
  const setD = (patch: Partial<Draft>) => setModal((m) => ({ ...m, data: { ...m.data, ...patch } }));

  return (
    <AdminShell
      title="Get Involved"
      subtitle="Manage the ways people can support your work."
      actions={
        <button type="button" onClick={() => setModal({ open: true, id: null, data: empty() })} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
          <Plus style={{ width: 16, height: 16 }} /> Add option
        </button>
      }
    >
      {items.length === 0 ? (
        <Empty text="No options yet. Add ways people can get involved." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((w, i) => (
            <div key={w.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 soft-shadow">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-pale text-2xl">{w.icon}</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-semibold text-ink">{w.title}</h3>
                <p className="mt-1 text-sm text-text/65">{w.text}</p>
                <div className="mt-2 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-text/70">{w.cta}</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5">
                  <MoveBtn dir="up" disabled={i === 0} onClick={() => store.move("getInvolved", w.id, -1)} />
                  <MoveBtn dir="down" disabled={i === items.length - 1} onClick={() => store.move("getInvolved", w.id, 1)} />
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setModal({ open: true, id: w.id, data: { icon: w.icon, title: w.title, text: w.text, cta: w.cta } })} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-text/60 hover:bg-primary-pale hover:text-primary">
                    <Pencil style={{ width: 16, height: 16 }} />
                  </button>
                  <RemoveBtn onClick={() => setDel(w.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.id ? "Edit option" : "Add option"}
        footer={
          <>
            <button type="button" onClick={() => setModal((m) => ({ ...m, open: false }))} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">Cancel</button>
            <button
              type="button"
              disabled={!modal.data.title.trim()}
              onClick={() => {
                if (modal.id) store.updateInvolve(modal.id, modal.data);
                else store.addInvolve(modal.data);
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
          <Field label="Icon (emoji)"><TextInput value={modal.data.icon} onChange={(e) => setD({ icon: e.target.value })} className="max-w-[6rem] text-center text-lg" /></Field>
          <Field label="Title"><TextInput value={modal.data.title} onChange={(e) => setD({ title: e.target.value })} placeholder="Volunteer" /></Field>
          <Field label="Description"><TextArea rows={3} value={modal.data.text} onChange={(e) => setD({ text: e.target.value })} /></Field>
          <Field label="Button label"><TextInput value={modal.data.cta} onChange={(e) => setD({ cta: e.target.value })} placeholder="Become a volunteer" /></Field>
        </div>
      </AdminModal>

      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} onConfirm={() => del && store.removeInvolve(del)} title="Delete option?" message="This option will be removed. This can't be undone." />
    </AdminShell>
  );
}

function MoveBtn({ dir, disabled, onClick }: { dir: "up" | "down"; disabled: boolean; onClick: () => void }) {
  const Icon = dir === "up" ? ChevronUp : ChevronDown;
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={`Move ${dir}`} className="grid h-8 w-8 place-items-center rounded-lg text-text/50 transition-colors hover:bg-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent">
      <Icon style={{ width: 16, height: 16 }} />
    </button>
  );
}
