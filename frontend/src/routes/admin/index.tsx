import { useEffect, useMemo, useState } from "react";
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
  Users,
  Target,
  Mails,
  Library,
  Building2,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Quote,
  BarChart3,
  Clock,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Empty } from "@/components/admin/AdminCard";
import { useHomeContent, useAuth } from "@/lib/admin/context";
import type { Stamped } from "@/lib/api";
import {
  useDonations,
  useSubmissions,
  getDonationStats,
  getNewsletterStats,
  type DonationStats,
} from "@/lib/admin/inbox";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

const rs = (n: number) => `Rs ${Math.round(n).toLocaleString()}`;

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(
      amount,
    );
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

/** "3 days ago" — used for both content edits and activity. */
function timeAgo(iso?: string | null) {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Most recent `updatedAt` in a collection — records from the API carry it. */
function lastEdited(list: Stamped[]): string | null {
  const stamps = list
    .map((x) => x?.updatedAt)
    .filter((v): v is string => typeof v === "string");
  if (!stamps.length) return null;
  return stamps.sort().at(-1) ?? null;
}

function DashboardPage() {
  const { content } = useHomeContent();
  const { user } = useAuth();
  const donations = useDonations();
  const submissions = useSubmissions();

  const [stats, setStats] = useState<DonationStats | null>(null);
  const [audience, setAudience] = useState<{ total: number; active: number; unsubscribed: number } | null>(
    null,
  );

  // Money and audience figures come from the server so they are aggregated
  // correctly (multi-currency donations are summed in the base currency).
  useEffect(() => {
    getDonationStats().then(setStats).catch(() => {});
    getNewsletterStats().then(setAudience).catch(() => {});
  }, [donations.length]);

  const unread = submissions.filter((s) => !s.read).length;
  const needsReview = donations.filter((d) => d.needsReview).length;
  const liveCampaigns = content.campaigns.filter((c) => c.published);
  const currency = stats?.currency ?? "NPR";

  /* ------------------------- Needs attention ------------------------- *
   * Every item here is derived from real content — the list is empty
   * when there is genuinely nothing to do.                              */
  const todos = useMemo(() => {
    const items: { text: string; to: string; tone: "urgent" | "warn" | "info" }[] = [];

    if (needsReview > 0)
      items.push({
        text: `${needsReview} gateway payment${needsReview === 1 ? "" : "s"} need attributing to a donor and campaign`,
        to: "/admin/donations",
        tone: "urgent",
      });

    if (unread > 0)
      items.push({
        text: `${unread} unread message${unread === 1 ? "" : "s"} in the contact inbox`,
        to: "/admin/contact",
        tone: "urgent",
      });

    if (stats?.pendingCount)
      items.push({
        text: `${stats.pendingCount} donation${stats.pendingCount === 1 ? "" : "s"} pending (${rs(stats.pending)}) — confirm any bank transfers that have landed`,
        to: "/admin/donations",
        tone: "warn",
      });

    const draftPrograms = content.programs.filter((p) => !p.published).length;
    if (draftPrograms)
      items.push({
        text: `${draftPrograms} program${draftPrograms === 1 ? " is" : "s are"} unpublished`,
        to: "/admin/programs",
        tone: "info",
      });

    const draftStories = content.stories.filter((s) => !s.published).length;
    if (draftStories)
      items.push({
        text: `${draftStories} story draft${draftStories === 1 ? "" : "s"} not yet published`,
        to: "/admin/stories",
        tone: "info",
      });

    const draftCampaigns = content.campaigns.filter((c) => !c.published).length;
    if (draftCampaigns)
      items.push({
        text: `${draftCampaigns} campaign${draftCampaigns === 1 ? " is" : "s are"} unpublished — nobody can donate to ${draftCampaigns === 1 ? "it" : "them"}`,
        to: "/admin/campaigns",
        tone: "warn",
      });

    const funded = liveCampaigns.filter((c) => c.percent >= 100 && c.acceptsDonations);
    if (funded.length)
      items.push({
        text: `${funded.length} campaign${funded.length === 1 ? " has" : "s have"} reached their goal — consider closing or raising the target`,
        to: "/admin/campaigns",
        tone: "info",
      });

    const noImage = liveCampaigns.filter((c) => !c.image).length;
    if (noImage)
      items.push({
        text: `${noImage} campaign${noImage === 1 ? "" : "s"} still using the default cover image`,
        to: "/admin/campaigns",
        tone: "info",
      });

    const emptyAlbums = content.galleryAlbums.filter((a) => (a.images?.length ?? 0) === 0).length;
    if (emptyAlbums)
      items.push({
        text: `${emptyAlbums} gallery album${emptyAlbums === 1 ? " has" : "s have"} no photos yet`,
        to: "/admin/gallery",
        tone: "info",
      });

    const noSeo = content.programs.filter((p) => p.published && !p.seoDescription).length;
    if (noSeo)
      items.push({
        text: `${noSeo} published program${noSeo === 1 ? "" : "s"} missing an SEO description`,
        to: "/admin/programs",
        tone: "info",
      });

    if (content.heroSlides.length === 0)
      items.push({ text: "The homepage hero carousel is empty", to: "/admin/home", tone: "urgent" });

    return items;
  }, [needsReview, unread, stats, content, liveCampaigns]);

  /* --------------------------- Stat cards --------------------------- */
  const cards = [
    {
      label: "Total raised",
      value: stats ? rs(stats.raised) : "—",
      sub: stats ? `${stats.count} donation${stats.count === 1 ? "" : "s"} · avg ${rs(stats.average)}` : "",
      icon: HandCoins,
      color: "#2E7D5B",
      to: "/admin/donations",
    },
    {
      label: "Supporters",
      value: stats ? String(stats.donors) : "—",
      sub: audience ? `${audience.active} newsletter subscriber${audience.active === 1 ? "" : "s"}` : "",
      icon: Users,
      color: "#5B2C86",
      to: "/admin/donations",
    },
    {
      label: "Live campaigns",
      value: String(liveCampaigns.length),
      sub: liveCampaigns.length
        ? `${rs(liveCampaigns.reduce((s, c) => s + c.raised, 0))} of ${rs(liveCampaigns.reduce((s, c) => s + c.goal, 0))}`
        : "None published",
      icon: Target,
      color: "#D9732B",
      to: "/admin/campaigns",
    },
    {
      label: "Unread messages",
      value: String(unread),
      sub: `${submissions.length} total received`,
      icon: Mail,
      color: "#1F7A8C",
      to: "/admin/contact",
    },
  ];

  /* ------------------------- Activity feed -------------------------- *
   * Real donations and real form submissions, merged newest-first.     */
  const activity = useMemo(() => {
    const gifts = donations
      .filter((d) => d.status === "completed")
      .slice(0, 8)
      .map((d) => ({
        kind: "donation" as const,
        when: d.completedAt ?? d.createdAt,
        title: d.anonymous ? "Anonymous" : d.donor,
        detail: `${money(d.amount, d.currency)} → ${d.campaignTitle}`,
        to: "/admin/donations",
      }));

    const msgs = submissions.slice(0, 8).map((s) => ({
      kind: "message" as const,
      when: s.createdAt,
      title: s.name,
      detail: s.subject || s.message.slice(0, 60),
      to: "/admin/contact",
    }));

    return [...gifts, ...msgs]
      .filter((a) => a.when)
      .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
      .slice(0, 8);
  }, [donations, submissions]);

  /* ---------------------- Content inventory ------------------------- *
   * One row per editable section, with its real count, real draft
   * count where the model supports publishing, and last edit time.     */
  const inventory = [
    {
      group: "Home page",
      to: "/admin/home",
      icon: Images,
      rows: [
        { name: "Hero slides", list: content.heroSlides },
        { name: "Impact counters", list: content.impactStats },
        { name: "Testimonials", list: content.testimonials },
      ],
    },
    {
      group: "Programs",
      to: "/admin/programs",
      icon: FileText,
      rows: [
        {
          name: "Programs",
          list: content.programs,
          drafts: content.programs.filter((p) => !p.published).length,
        },
      ],
    },
    {
      group: "News & stories",
      to: "/admin/stories",
      icon: Newspaper,
      rows: [
        {
          name: "Stories",
          list: content.stories,
          drafts: content.stories.filter((s) => !s.published).length,
        },
      ],
    },
    {
      group: "Campaigns",
      to: "/admin/campaigns",
      icon: Target,
      rows: [
        {
          name: "Donation campaigns",
          list: content.campaigns,
          drafts: content.campaigns.filter((c) => !c.published).length,
        },
      ],
    },
    {
      group: "About",
      to: "/admin/about",
      icon: Info,
      rows: [
        { name: "Team members", list: content.team },
        { name: "Milestones", list: content.milestones },
      ],
    },
    {
      group: "Gallery",
      to: "/admin/gallery",
      icon: Images,
      rows: [{ name: "Albums", list: content.galleryAlbums }],
    },
    {
      group: "Resources",
      to: "/admin/resources",
      icon: Library,
      rows: [{ name: "Documents", list: content.resources }],
    },
    {
      group: "Partners",
      to: "/admin/partners",
      icon: Building2,
      rows: [{ name: "Partners", list: content.partners }],
    },
    {
      group: "Get involved",
      to: "/admin/get-involved",
      icon: HeartHandshake,
      rows: [{ name: "Ways to help", list: content.getInvolved }],
    },
  ];

  const maxMonth = Math.max(1, ...(stats?.monthly ?? []).map((m) => m.total));
  const firstName = user?.name?.split(" ")[0];

  return (
    <AdminShell
      title="Dashboard"
      subtitle={
        firstName
          ? `Welcome back, ${firstName} — here's what's live on ${content.settings.siteName}.`
          : `Here's what's live on ${content.settings.siteName}.`
      }
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
        {cards.map((s) => {
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
              {s.sub && <div className="mt-1 text-xs text-text/45">{s.sub}</div>}
            </Link>
          );
        })}
      </div>

      {/* Needs attention */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Needs your attention</h2>
        {todos.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-green/25 bg-green-light/40 px-5 py-4 text-sm">
            <CheckCircle2 style={{ width: 20, height: 20 }} className="shrink-0 text-green" />
            <span className="text-text/80">
              Nothing outstanding — inbox is clear, no pending payments, and everything is published.
            </span>
          </div>
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {todos.map((t) => {
              const tone = {
                urgent: "border-destructive/25 bg-destructive/5 text-destructive",
                warn: "border-accent/30 bg-accent-light/40 text-accent",
                info: "border-border bg-card text-text/50",
              }[t.tone];
              return (
                <li key={t.text}>
                  <Link
                    to={t.to}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors hover:brightness-[0.98] ${tone}`}
                  >
                    <AlertTriangle style={{ width: 16, height: 16, marginTop: 2 }} className="shrink-0" />
                    <span className="flex-1 text-text/80">{t.text}</span>
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Fundraising */}
          <section className="rounded-2xl border border-border bg-card p-5 soft-shadow md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-semibold text-ink">Fundraising</h2>
                <p className="mt-0.5 text-sm text-text/55">
                  Live progress from the donation ledger, in {currency}.
                </p>
              </div>
              <Link
                to="/admin/campaigns"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
              >
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {liveCampaigns.length === 0 ? (
              <div className="mt-4">
                <Empty text="No published campaigns yet — create one so people can donate." />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {liveCampaigns.slice(0, 5).map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden>{c.icon}</span>
                        <span className="truncate font-semibold text-ink">{c.title}</span>
                        {!c.acceptsDonations && (
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text/60">
                            Closed
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-mono-stat text-text/70">
                        {rs(c.raised)} <span className="text-text/40">/ {rs(c.goal)}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${c.percent}%`, background: c.color }}
                      />
                    </div>
                    <div className="mt-1 flex gap-3 text-xs text-text/45">
                      <span>
                        <strong className="text-ink">{c.percent}%</strong> funded
                      </span>
                      <span>{c.donors} donors</span>
                      {c.lastDonationAt && <span>last gift {timeAgo(c.lastDonationAt)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!!stats?.monthly.length && (
              <div className="mt-6 border-t border-border pt-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <BarChart3 style={{ width: 15, height: 15 }} className="text-primary" />
                  Last 12 months
                </div>
                <div className="mt-3 flex h-20 items-end gap-1.5">
                  {stats.monthly.map((m) => (
                    <div key={m.month} className="group relative flex-1">
                      <div
                        className="w-full rounded-t bg-primary/60 transition-colors group-hover:bg-primary"
                        style={{ height: `${Math.max(4, (m.total / maxMonth) * 72)}px` }}
                      />
                      <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] text-white group-hover:block">
                        {m.month}: {rs(m.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Content inventory */}
          <section>
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">Site content</h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card soft-shadow">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-text/55">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Section</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Last edited</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventory.flatMap((g) =>
                    g.rows.map((r) => {
                      const drafts = "drafts" in r ? (r.drafts as number) : 0;
                      const total = r.list.length;
                      const edited = timeAgo(lastEdited(r.list));
                      return (
                        <tr key={`${g.group}-${r.name}`} className="transition-colors hover:bg-muted/30">
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-ink">{r.name}</div>
                            <div className="text-xs text-text/45">{g.group}</div>
                          </td>
                          <td className="px-5 py-3.5 text-text/70">
                            {total} item{total === 1 ? "" : "s"}
                          </td>
                          <td className="px-5 py-3.5">
                            {total === 0 ? (
                              <StatusPill tone="empty">Empty</StatusPill>
                            ) : drafts > 0 ? (
                              <StatusPill tone="draft">
                                {total - drafts} live · {drafts} draft
                              </StatusPill>
                            ) : (
                              <StatusPill tone="live">Published</StatusPill>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-text/50">{edited ?? "—"}</td>
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              to={g.to}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
                            >
                              Edit <Pencil style={{ width: 13, height: 13 }} />
                            </Link>
                          </td>
                        </tr>
                      );
                    }),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Activity */}
          <section className="rounded-2xl border border-border bg-card p-5 soft-shadow">
            <div className="flex items-center gap-2">
              <Clock style={{ width: 16, height: 16 }} className="text-primary" />
              <h2 className="font-display text-base font-semibold text-ink">Recent activity</h2>
            </div>
            {activity.length === 0 ? (
              <div className="mt-4">
                <Empty text="No donations or messages yet." />
              </div>
            ) : (
              <ul className="mt-4 space-y-3.5">
                {activity.map((a, i) => (
                  <li key={`${a.kind}-${i}`}>
                    <Link to={a.to} className="flex gap-3 group">
                      <span
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                          a.kind === "donation"
                            ? "bg-green-light text-green"
                            : "bg-primary-pale text-primary"
                        }`}
                      >
                        {a.kind === "donation" ? (
                          <HandCoins style={{ width: 14, height: 14 }} />
                        ) : (
                          <Mail style={{ width: 14, height: 14 }} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink group-hover:text-primary">
                          {a.title}
                        </span>
                        <span className="block truncate text-xs text-text/60">{a.detail}</span>
                        <span className="block text-[11px] text-text/40">{timeAgo(a.when)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Audience */}
          <section className="rounded-2xl border border-border bg-card p-5 soft-shadow">
            <div className="flex items-center gap-2">
              <Mails style={{ width: 16, height: 16 }} className="text-primary" />
              <h2 className="font-display text-base font-semibold text-ink">Audience</h2>
            </div>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="Newsletter subscribers" value={audience ? String(audience.active) : "—"} />
              <Row label="Unsubscribed" value={audience ? String(audience.unsubscribed) : "—"} />
              <Row label="Donors" value={stats ? String(stats.donors) : "—"} />
              <Row label="Messages received" value={String(submissions.length)} />
            </dl>
            <Link
              to="/admin/newsletter"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
            >
              Manage subscribers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* Where the money comes from */}
          {!!stats?.byGateway.length && (
            <section className="rounded-2xl border border-border bg-card p-5 soft-shadow">
              <h2 className="font-display text-base font-semibold text-ink">Payment methods</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                {stats.byGateway.map((g) => (
                  <Row
                    key={g.gateway}
                    label={g.gateway === "globalime" ? "Global IME" : g.gateway}
                    value={`${rs(g.total)} · ${g.count}`}
                  />
                ))}
              </dl>
            </section>
          )}

          {/* Top testimonial — real content, not a placeholder blurb */}
          {content.testimonials.length > 0 && (
            <section className="rounded-2xl border border-border bg-gradient-to-br from-primary to-[#3F2160] p-6 text-white soft-shadow">
              <Quote className="h-5 w-5 text-accent-light" />
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                &ldquo;{content.testimonials[0].quote}&rdquo;
              </p>
              <div className="mt-3 text-xs text-white/60">
                {content.testimonials[0].name} · {content.testimonials[0].role}
              </div>
              <Link
                to="/admin/home"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
              >
                <Pencil style={{ width: 15, height: 15 }} /> Edit testimonials
              </Link>
            </section>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

/* ------------------------------ Bits ------------------------------ */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="capitalize text-text/65">{label}</dt>
      <dd className="font-mono-stat font-semibold text-ink">{value}</dd>
    </div>
  );
}

function StatusPill({ tone, children }: { tone: "live" | "draft" | "empty"; children: React.ReactNode }) {
  const cls = {
    live: "bg-green-light text-green",
    draft: "bg-accent-light text-accent",
    empty: "bg-muted text-text/55",
  }[tone];
  const dot = { live: "bg-green", draft: "bg-accent", empty: "bg-text/40" }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {children}
    </span>
  );
}
