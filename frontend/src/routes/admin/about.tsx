import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Users, Milestone as MilestoneIcon, Plus, Pencil, ChevronUp, ChevronDown, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Empty, RemoveBtn, TabBar } from "@/components/admin/AdminCard";
import { AdminModal, ConfirmDialog, Field, TextInput, TextArea } from "@/components/admin/AdminModal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useHomeContent, type TeamMember, type Milestone } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/about")({
  component: AboutAdminPage,
});

type Tab = "content" | "team" | "milestones";

function AboutAdminPage() {
  const store = useHomeContent();
  const about = store.content.about;
  const team = store.content.team ?? [];
  const milestones = store.content.milestones ?? [];
  const [tab, setTab] = useState<Tab>("content");

  // Team modal
  const [teamModal, setTeamModal] = useState<{ open: boolean; id: string | null; data: Omit<TeamMember, "id"> }>({
    open: false,
    id: null,
    data: { name: "", role: "", bio: "", photo: "" },
  });
  const [teamDel, setTeamDel] = useState<string | null>(null);

  // Milestone modal
  const [msModal, setMsModal] = useState<{ open: boolean; id: string | null; data: Omit<Milestone, "id"> }>({
    open: false,
    id: null,
    data: { year: "", title: "", desc: "" },
  });
  const [msDel, setMsDel] = useState<string | null>(null);

  return (
    <AdminShell title="About — Who We Are" subtitle="Manage your story, founder, team, and milestones.">
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "content", label: "Page content", icon: FileText },
          { key: "team", label: "Team", icon: Users, count: team.length },
          { key: "milestones", label: "Milestones", icon: MilestoneIcon, count: milestones.length },
        ]}
      />

      {tab === "content" && (
        <div className="space-y-6">
          <p className="text-sm text-text/55">Changes are saved automatically as you type.</p>

          <Card title="Page hero">
            <div className="space-y-4">
              <Field label="Title">
                <TextInput value={about.heroTitle} onChange={(e) => store.setAbout({ heroTitle: e.target.value })} />
              </Field>
              <Field label="Subtitle">
                <TextArea rows={2} value={about.heroSubtitle} onChange={(e) => store.setAbout({ heroSubtitle: e.target.value })} />
              </Field>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card title="Founder story" subtitle="Use the toolbar to format the narrative.">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Founder name">
                      <TextInput value={about.founderName} onChange={(e) => store.setAbout({ founderName: e.target.value })} />
                    </Field>
                    <Field label="Role / title">
                      <TextInput value={about.founderRole} onChange={(e) => store.setAbout({ founderRole: e.target.value })} />
                    </Field>
                  </div>
                  <RichTextEditor value={about.founderStory} onChange={(v) => store.setAbout({ founderStory: v })} minHeight={200} />
                </div>
              </Card>

              <Card title="Mission, vision & values">
                <div className="space-y-4">
                  <Field label="Mission">
                    <TextArea rows={2} value={about.mission} onChange={(e) => store.setAbout({ mission: e.target.value })} />
                  </Field>
                  <Field label="Vision">
                    <TextArea rows={2} value={about.vision} onChange={(e) => store.setAbout({ vision: e.target.value })} />
                  </Field>
                  <Field label="Values">
                    <TextArea rows={2} value={about.values} onChange={(e) => store.setAbout({ values: e.target.value })} />
                  </Field>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Founder photo">
                <ImagePicker value={about.founderImage} onChange={(v) => store.setAbout({ founderImage: v })} aspect="4 / 5" />
              </Card>

              <Card
                title="Honours"
                action={
                  <button
                    type="button"
                    onClick={() => store.setAbout({ founderHonours: [...about.founderHonours, ""] })}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
                  >
                    <Plus style={{ width: 15, height: 15 }} /> Add
                  </button>
                }
              >
                {about.founderHonours.length === 0 ? (
                  <Empty text="No honours listed yet." />
                ) : (
                  <div className="space-y-2">
                    {about.founderHonours.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <TextInput
                          value={h}
                          onChange={(e) =>
                            store.setAbout({
                              founderHonours: about.founderHonours.map((x, idx) => (idx === i ? e.target.value : x)),
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => store.setAbout({ founderHonours: about.founderHonours.filter((_, idx) => idx !== i) })}
                          aria-label="Remove"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text/50 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {tab === "team" && (
        <>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setTeamModal({ open: true, id: null, data: { name: "", role: "", bio: "", photo: "" } })}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <Plus style={{ width: 16, height: 16 }} /> Add member
            </button>
          </div>
          {team.length === 0 ? (
            <Empty text="No team members yet. Add your first one." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => (
                <div key={m.id} className="flex flex-col rounded-2xl border border-border bg-card p-4 soft-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted">
                      {m.photo && <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-display font-semibold text-ink">{m.name}</div>
                      <div className="truncate text-sm text-accent">{m.role}</div>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 flex-1 text-sm text-text/65">{m.bio}</p>
                  <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
                    <button type="button" onClick={() => setTeamModal({ open: true, id: m.id, data: { name: m.name, role: m.role, bio: m.bio, photo: m.photo } })} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary-pale">
                      <Pencil style={{ width: 14, height: 14 }} /> Edit
                    </button>
                    <button type="button" onClick={() => setTeamDel(m.id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-text/60 hover:bg-destructive/10 hover:text-destructive">
                      Delete
                    </button>
                    <div className="ml-auto flex gap-0.5">
                      <MoveBtn dir="up" disabled={i === 0} onClick={() => store.move("team", m.id, -1)} />
                      <MoveBtn dir="down" disabled={i === team.length - 1} onClick={() => store.move("team", m.id, 1)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "milestones" && (
        <>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setMsModal({ open: true, id: null, data: { year: "", title: "", desc: "" } })}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <Plus style={{ width: 16, height: 16 }} /> Add milestone
            </button>
          </div>
          {milestones.length === 0 ? (
            <Empty text="No milestones yet." />
          ) : (
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={m.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 soft-shadow">
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <MoveBtn dir="up" disabled={i === 0} onClick={() => store.move("milestones", m.id, -1)} />
                    <MoveBtn dir="down" disabled={i === milestones.length - 1} onClick={() => store.move("milestones", m.id, 1)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono-stat text-sm font-semibold text-accent">{m.year}</div>
                    <div className="font-display font-semibold text-ink">{m.title}</div>
                    <div className="mt-0.5 text-sm text-text/65">{m.desc}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" onClick={() => setMsModal({ open: true, id: m.id, data: { year: m.year, title: m.title, desc: m.desc } })} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-text/60 hover:bg-primary-pale hover:text-primary">
                      <Pencil style={{ width: 16, height: 16 }} />
                    </button>
                    <RemoveBtn onClick={() => setMsDel(m.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Team modal */}
      <AdminModal
        open={teamModal.open}
        onClose={() => setTeamModal((m) => ({ ...m, open: false }))}
        title={teamModal.id ? "Edit member" : "Add member"}
        footer={
          <>
            <button type="button" onClick={() => setTeamModal((m) => ({ ...m, open: false }))} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">Cancel</button>
            <button
              type="button"
              disabled={!teamModal.data.name.trim()}
              onClick={() => {
                if (teamModal.id) store.updateTeam(teamModal.id, teamModal.data);
                else store.addTeam(teamModal.data);
                setTeamModal((m) => ({ ...m, open: false }));
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {teamModal.id ? "Save" : "Add"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name"><TextInput value={teamModal.data.name} onChange={(e) => setTeamModal((m) => ({ ...m, data: { ...m.data, name: e.target.value } }))} /></Field>
          <Field label="Role"><TextInput value={teamModal.data.role} onChange={(e) => setTeamModal((m) => ({ ...m, data: { ...m.data, role: e.target.value } }))} /></Field>
          <Field label="Short bio"><TextArea rows={3} value={teamModal.data.bio} onChange={(e) => setTeamModal((m) => ({ ...m, data: { ...m.data, bio: e.target.value } }))} /></Field>
          <Field label="Photo"><ImagePicker value={teamModal.data.photo} onChange={(v) => setTeamModal((m) => ({ ...m, data: { ...m.data, photo: v } }))} aspect="1 / 1" /></Field>
        </div>
      </AdminModal>

      {/* Milestone modal */}
      <AdminModal
        open={msModal.open}
        onClose={() => setMsModal((m) => ({ ...m, open: false }))}
        title={msModal.id ? "Edit milestone" : "Add milestone"}
        footer={
          <>
            <button type="button" onClick={() => setMsModal((m) => ({ ...m, open: false }))} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text/80 hover:bg-muted">Cancel</button>
            <button
              type="button"
              disabled={!msModal.data.title.trim()}
              onClick={() => {
                if (msModal.id) store.updateMilestone(msModal.id, msModal.data);
                else store.addMilestone(msModal.data);
                setMsModal((m) => ({ ...m, open: false }));
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {msModal.id ? "Save" : "Add"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Year / date" hint='e.g. "Jan 2024"'><TextInput value={msModal.data.year} onChange={(e) => setMsModal((m) => ({ ...m, data: { ...m.data, year: e.target.value } }))} /></Field>
          <Field label="Title"><TextInput value={msModal.data.title} onChange={(e) => setMsModal((m) => ({ ...m, data: { ...m.data, title: e.target.value } }))} /></Field>
          <Field label="Description"><TextArea rows={3} value={msModal.data.desc} onChange={(e) => setMsModal((m) => ({ ...m, data: { ...m.data, desc: e.target.value } }))} /></Field>
        </div>
      </AdminModal>

      <ConfirmDialog open={teamDel !== null} onClose={() => setTeamDel(null)} onConfirm={() => teamDel && store.removeTeam(teamDel)} title="Delete member?" message="This team member will be removed. This can't be undone." />
      <ConfirmDialog open={msDel !== null} onClose={() => setMsDel(null)} onConfirm={() => msDel && store.removeMilestone(msDel)} title="Delete milestone?" message="This milestone will be removed. This can't be undone." />
    </AdminShell>
  );
}

function MoveBtn({ dir, disabled, onClick }: { dir: "up" | "down"; disabled: boolean; onClick: () => void }) {
  const Icon = dir === "up" ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Move ${dir}`}
      className="grid h-8 w-8 place-items-center rounded-lg text-text/50 transition-colors hover:bg-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <Icon style={{ width: 16, height: 16 }} />
    </button>
  );
}
