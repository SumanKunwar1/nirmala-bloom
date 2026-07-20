import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings, Inbox, Mail, Phone, Trash2, MailOpen, CornerUpLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Empty, TabBar } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { useHomeContent } from "@/lib/admin/context";
import {
  useSubmissions,
  markSubmissionRead,
  deleteSubmission,
  type ContactSubmission,
} from "@/lib/admin/inbox";

export const Route = createFileRoute("/admin/contact")({
  component: ContactAdminPage,
});

type Tab = "info" | "submissions";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function ContactAdminPage() {
  const store = useHomeContent();
  const info = store.content.contactInfo;
  const submissions = useSubmissions();
  const [tab, setTab] = useState<Tab>("info");
  const [open, setOpen] = useState<ContactSubmission | null>(null);
  const [del, setDel] = useState<string | null>(null);

  const unread = submissions.filter((s) => !s.read).length;

  const openSubmission = (s: ContactSubmission) => {
    setOpen(s);
    if (!s.read) markSubmissionRead(s.id, true);
  };

  return (
    <AdminShell title="Contact" subtitle="Edit your contact details and read messages from the public form.">
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "info", label: "Page info", icon: Settings },
          { key: "submissions", label: "Submissions", icon: Inbox, count: submissions.length },
        ]}
      />

      {tab === "info" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Contact details" subtitle="Changes save automatically.">
            <div className="space-y-4">
              <Field label="Address"><TextInput value={info.address} onChange={(e) => store.setContactInfo({ address: e.target.value })} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone"><TextInput value={info.phone} onChange={(e) => store.setContactInfo({ phone: e.target.value })} /></Field>
                <Field label="WhatsApp number" hint="Digits only, incl. country code."><TextInput value={info.whatsapp} onChange={(e) => store.setContactInfo({ whatsapp: e.target.value })} /></Field>
              </div>
              <Field label="Email"><TextInput value={info.email} onChange={(e) => store.setContactInfo({ email: e.target.value })} /></Field>
              <Field label="Office hours"><TextInput value={info.hours} onChange={(e) => store.setContactInfo({ hours: e.target.value })} /></Field>
              <Field label="Map embed URL" hint="An OpenStreetMap / Google Maps embed src."><TextArea rows={2} value={info.mapEmbed} onChange={(e) => store.setContactInfo({ mapEmbed: e.target.value })} /></Field>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Social links">
              <div className="space-y-4">
                <Field label="Facebook"><TextInput value={info.facebook} onChange={(e) => store.setContactInfo({ facebook: e.target.value })} /></Field>
                <Field label="Instagram"><TextInput value={info.instagram} onChange={(e) => store.setContactInfo({ instagram: e.target.value })} /></Field>
                <Field label="YouTube"><TextInput value={info.youtube} onChange={(e) => store.setContactInfo({ youtube: e.target.value })} /></Field>
                <Field label="LinkedIn"><TextInput value={info.linkedin} onChange={(e) => store.setContactInfo({ linkedin: e.target.value })} /></Field>
              </div>
            </Card>
            <Card title="Live preview">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> {info.phone}</div>
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> {info.email}</div>
                <div className="text-text/60">{info.address} · {info.hours}</div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "submissions" && (
        <>
          <div className="mb-4 flex items-center gap-3 text-sm text-text/60">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 font-semibold text-accent">
              {unread} unread
            </span>
            <span>{submissions.length} total messages</span>
          </div>

          {submissions.length === 0 ? (
            <Empty text="No messages yet. Submissions from the public contact form will appear here." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card soft-shadow">
              <div className="divide-y divide-border">
                {submissions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => openSubmission(s)}
                    className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40 ${s.read ? "" : "bg-primary-pale/30"}`}
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.read ? "bg-transparent" : "bg-accent"}`} />
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                      {s.name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`truncate ${s.read ? "font-medium text-ink" : "font-bold text-ink"}`}>{s.name}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-text/60">{s.subject}</span>
                      </div>
                      <div className="truncate text-sm text-text/60">{s.message}</div>
                    </div>
                    <div className="shrink-0 text-xs text-text/45">{fmtDate(s.createdAt)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Submission detail */}
      <AdminModal
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open?.subject ?? "Message"}
        description={open ? `From ${open.name} · ${fmtDate(open.createdAt)}` : ""}
        maxWidth="max-w-lg"
        footer={
          open ? (
            <>
              <button type="button" onClick={() => { markSubmissionRead(open.id, !open.read); setOpen({ ...open, read: !open.read }); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">
                <MailOpen style={{ width: 15, height: 15 }} /> Mark {open.read ? "unread" : "read"}
              </button>
              <button type="button" onClick={() => { setDel(open.id); setOpen(null); }} className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
                <Trash2 style={{ width: 15, height: 15 }} /> Delete
              </button>
              <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 transition-transform">
                <CornerUpLeft style={{ width: 15, height: 15 }} /> Reply
              </a>
            </>
          ) : null
        }
      >
        {open && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-4 text-sm">
              <div><div className="text-xs text-text/50">Name</div><div className="font-semibold text-ink">{open.name}</div></div>
              <div><div className="text-xs text-text/50">Email</div><div className="truncate font-semibold text-ink">{open.email}</div></div>
              <div><div className="text-xs text-text/50">Phone</div><div className="font-semibold text-ink">{open.phone || "—"}</div></div>
              <div><div className="text-xs text-text/50">Subject</div><div className="font-semibold text-ink">{open.subject}</div></div>
            </div>
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text/50">Message</div>
              <p className="whitespace-pre-wrap rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-text/80">{open.message}</p>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog open={del !== null} onClose={() => setDel(null)} onConfirm={() => del && deleteSubmission(del)} title="Delete message?" message="This message will be permanently removed." />
    </AdminShell>
  );
}
