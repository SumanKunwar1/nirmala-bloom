import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Palette, Search, PanelBottom, AlertTriangle, Plus, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Empty, TabBar } from "@/components/admin/AdminCard";
import { ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useHomeContent } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdminPage,
});

type Tab = "general" | "branding" | "seo" | "footer" | "danger";

function SettingsAdminPage() {
  const store = useHomeContent();
  const s = store.content.settings;
  const f = store.content.footer;
  const [tab, setTab] = useState<Tab>("general");
  const [resetOpen, setResetOpen] = useState(false);

  const uidLocal = () => `l_${Math.random().toString(36).slice(2)}`;

  return (
    <AdminShell title="Settings" subtitle="Site-wide configuration, branding, SEO, and footer.">
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "general", label: "General", icon: SettingsIcon },
          { key: "branding", label: "Branding", icon: Palette },
          { key: "seo", label: "SEO", icon: Search },
          { key: "footer", label: "Footer", icon: PanelBottom },
          { key: "danger", label: "Danger zone", icon: AlertTriangle },
        ]}
      />

      {tab === "general" && (
        <Card title="General" subtitle="Changes save automatically.">
          <div className="space-y-4">
            <Field label="Site name"><TextInput value={s.siteName} onChange={(e) => store.setSettings({ siteName: e.target.value })} /></Field>
            <Field label="Tagline"><TextInput value={s.tagline} onChange={(e) => store.setSettings({ tagline: e.target.value })} /></Field>
            <Field label="Description"><TextArea rows={3} value={s.description} onChange={(e) => store.setSettings({ description: e.target.value })} /></Field>
          </div>
        </Card>
      )}

      {tab === "branding" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Logo"><ImagePicker value={s.logo} onChange={(v) => store.setSettings({ logo: v })} aspect="1 / 1" /></Card>
          <Card title="Primary color">
            <div className="flex items-center gap-3">
              <input type="color" value={s.primaryColor} onChange={(e) => store.setSettings({ primaryColor: e.target.value })} className="h-12 w-16 cursor-pointer rounded-lg border border-border" aria-label="Primary color" />
              <TextInput value={s.primaryColor} onChange={(e) => store.setSettings({ primaryColor: e.target.value })} />
            </div>
            <p className="mt-3 text-sm text-text/55">The brand color used across buttons and highlights.</p>
          </Card>
        </div>
      )}

      {tab === "seo" && (
        <Card title="Default SEO" subtitle="Used for the homepage and as a fallback across the site.">
          <div className="space-y-4">
            <Field label="Meta title" hint={`${(s.seoTitle || "").length} characters · ~60 recommended`}>
              <TextInput value={s.seoTitle} onChange={(e) => store.setSettings({ seoTitle: e.target.value })} />
            </Field>
            <Field label="Meta description" hint={`${(s.seoDescription || "").length} characters · ~155 recommended`}>
              <TextArea rows={3} value={s.seoDescription} onChange={(e) => store.setSettings({ seoDescription: e.target.value })} />
            </Field>
            <Field label="Keywords" hint="Comma-separated"><TextInput value={s.seoKeywords} onChange={(e) => store.setSettings({ seoKeywords: e.target.value })} /></Field>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs text-green">nirmalafoundation.org.np</div>
              <div className="mt-0.5 truncate text-lg" style={{ color: "#1a0dab" }}>{s.seoTitle || s.siteName}</div>
              <div className="mt-0.5 line-clamp-2 text-sm text-text/70">{s.seoDescription || s.description}</div>
            </div>
          </div>
        </Card>
      )}

      {tab === "footer" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Footer content">
            <div className="space-y-4">
              <Field label="About text"><TextArea rows={3} value={f.aboutText} onChange={(e) => store.setFooter({ aboutText: e.target.value })} /></Field>
              <Field label="Copyright"><TextInput value={f.copyright} onChange={(e) => store.setFooter({ copyright: e.target.value })} /></Field>
            </div>
          </Card>

          <Card title="Newsletter band">
            <div className="space-y-4">
              <Field label="Heading"><TextInput value={f.newsletterHeading} onChange={(e) => store.setFooter({ newsletterHeading: e.target.value })} /></Field>
              <Field label="Text"><TextArea rows={3} value={f.newsletterText} onChange={(e) => store.setFooter({ newsletterText: e.target.value })} /></Field>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card
              title="Legal links"
              action={<button type="button" onClick={() => store.setFooter({ legalLinks: [...f.legalLinks, { id: uidLocal(), label: "New link", url: "#" }] })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"><Plus style={{ width: 15, height: 15 }} /> Add link</button>}
            >
              {f.legalLinks.length === 0 ? (
                <Empty text="No legal links." />
              ) : (
                <div className="space-y-2">
                  {f.legalLinks.map((l, i) => (
                    <div key={l.id} className="flex items-center gap-2">
                      <TextInput className="max-w-[12rem]" value={l.label} onChange={(e) => store.setFooter({ legalLinks: f.legalLinks.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)) })} placeholder="Label" />
                      <TextInput value={l.url} onChange={(e) => store.setFooter({ legalLinks: f.legalLinks.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)) })} placeholder="https://…" />
                      <button type="button" onClick={() => store.setFooter({ legalLinks: f.legalLinks.filter((_, idx) => idx !== i) })} aria-label="Remove" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text/50 hover:bg-destructive/10 hover:text-destructive"><X style={{ width: 16, height: 16 }} /></button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {tab === "danger" && (
        <Card title="Danger zone">
          <div className="flex flex-col items-start gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold text-ink">Reset all content to defaults</div>
              <p className="mt-1 text-sm text-text/65">Restores every section — home, programs, about, stories, contact, resources, gallery, partners, settings, and footer — to their original seed values. Your edits will be lost.</p>
            </div>
            <button type="button" onClick={() => setResetOpen(true)} className="shrink-0 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Reset everything</button>
          </div>
          <p className="mt-4 text-xs text-text/45">Note: this only affects editable content, not contact submissions or donation records.</p>
        </Card>
      )}

      <ConfirmDialog open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={() => store.resetAll()} title="Reset all content?" message="Every editable section will be restored to its original defaults. This can't be undone." confirmLabel="Reset everything" />
    </AdminShell>
  );
}
