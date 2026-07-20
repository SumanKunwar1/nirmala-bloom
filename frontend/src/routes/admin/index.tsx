import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Images,
  FileText,
  Newspaper,
  HandCoins,
  Mail,
  Info,
  ArrowRight,
  Pencil,
  Plus,
  TrendingUp,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useHomeContent } from "@/lib/admin/context";
import { useDonations, useSubmissions } from "@/lib/admin/inbox";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

const rs = (n: number) => `Rs ${n.toLocaleString()}`;

function DashboardPage() {
  const store = useHomeContent();
  const content = {
    heroSlides: store.content.heroSlides ?? [],
    impactStats: store.content.impactStats ?? [],
    testimonials: store.content.testimonials ?? [],
    programs: store.content.programs ?? [],
    stories: store.content.stories ?? [],
    team: store.content.team ?? [],
  };
  const donations = useDonations();
  const submissions = useSubmissions();

  const raised = donations.filter((d) => d.status === "completed").reduce((s, d) => s + d.amount, 0);
  const unread = submissions.filter((s) => !s.read).length;

  const stats = [
    { label: "Total raised", value: rs(raised), icon: HandCoins, color: "#2E7D5B", to: "/admin/donations" },
    { label: "Programs", value: content.programs.length, icon: FileText, color: "#5B2C86", to: "/admin/programs" },
    { label: "Stories", value: content.stories.length, icon: Newspaper, color: "#D9732B", to: "/admin/stories" },
    { label: "Unread messages", value: unread, icon: Mail, color: "#1F7A8C", to: "/admin/contact" },
  ];

  const quickActions = [
    {
      title: "Edit the homepage",
      desc: "Update hero slides, impact numbers, and testimonials.",
      icon: Images,
      to: "/admin/home",
      cta: "Manage home page",
    },
    {
      title: "About — Who We Are",
      desc: `Founder story, mission, ${content.team.length} team members & milestones.`,
      icon: Info,
      to: "/admin/about",
      cta: "Edit about page",
    },
    {
      title: "Contact & messages",
      desc: unread > 0 ? `${unread} unread message${unread !== 1 ? "s" : ""} waiting.` : "Edit details and read form submissions.",
      icon: Mail,
      to: "/admin/contact",
      cta: "Open inbox",
    },
  ];

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Welcome back — here's what's live on your site."
      actions={
        <Link
          to="/admin/home"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <Pencil style={{ width: 16, height: 16 }} /> Edit home page
        </Link>
      }
    >
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="group rounded-2xl border border-border bg-card p-5 soft-shadow transition-all hover:-translate-y-0.5 hover:soft-shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl"
                  style={{ backgroundColor: `${s.color}14`, color: s.color }}
                >
                  <Icon style={{ width: 20, height: 20 }} />
                </div>
                <ArrowRight className="h-4 w-4 text-text/30 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-4 font-mono-stat text-3xl font-bold text-ink">{s.value}</div>
              <div className="mt-0.5 text-sm text-text/60">{s.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Quick actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.title}
                  to={a.to}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 soft-shadow transition-all hover:-translate-y-0.5 hover:soft-shadow-lg"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-pale text-primary">
                    <Icon style={{ width: 18, height: 18 }} />
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-ink">{a.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-text/65">{a.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {a.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Home content preview */}
          <h2 className="mb-4 mt-8 font-display text-lg font-semibold text-ink">Homepage content</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card soft-shadow">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-text/55">
                <tr>
                  <th className="px-5 py-3 font-semibold">Section</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Hero carousel", count: content.heroSlides.length },
                  { name: "Impact counters", count: content.impactStats.length },
                  { name: "Testimonials", count: content.testimonials.length },
                ].map((r) => (
                  <tr key={r.name} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3.5 font-semibold text-ink">{r.name}</td>
                    <td className="px-5 py-3.5 text-text/70">{r.count} items</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-light px-2.5 py-1 text-xs font-semibold text-green">
                        <span className="h-1.5 w-1.5 rounded-full bg-green" /> Published
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to="/admin/home"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
                      >
                        Edit <Pencil style={{ width: 13, height: 13 }} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary to-[#3F2160] p-6 text-white soft-shadow">
            <TrendingUp className="h-6 w-6 text-accent-light" />
            <h3 className="mt-3 font-display text-lg font-semibold">You're all set up</h3>
            <p className="mt-1.5 text-sm text-white/75">
              The homepage is fully editable. Start with the hero carousel to make a strong first
              impression.
            </p>
            <Link
              to="/admin/home"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              <Plus style={{ width: 16, height: 16 }} /> Manage content
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 soft-shadow">
            <h3 className="font-display text-base font-semibold text-ink">Getting started</h3>
            <ul className="mt-3 space-y-3 text-sm text-text/70">
              {[
                "Review your hero slides and imagery",
                "Keep impact numbers up to date",
                "Add fresh testimonials from the community",
              ].map((t, i) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-pale text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
