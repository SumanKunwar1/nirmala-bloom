import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Home,
  FileText,
  Info,
  Newspaper,
  Images,
  Library,
  Building2,
  HeartHandshake,
  HandCoins,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import nirmalaLogo from "@/assets/nirmala-logo.png";
import { useAuth } from "@/lib/admin/context";

type NavItem = {
  label: string;
  to?: string;
  icon: typeof Home;
  soon?: boolean;
};

const nav: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Home Page", to: "/admin/home", icon: Home },
  { label: "Programs", to: "/admin/programs", icon: FileText },
  { label: "About", to: "/admin/about", icon: Info },
  { label: "News & Stories", to: "/admin/stories", icon: Newspaper },
  { label: "Gallery", to: "/admin/gallery", icon: Images },
  { label: "Resources", to: "/admin/resources", icon: Library },
  { label: "Partners", to: "/admin/partners", icon: Building2 },
  { label: "Get Involved", to: "/admin/get-involved", icon: HeartHandshake },
  { label: "Donations", to: "/admin/donations", icon: HandCoins },
  { label: "Contact", to: "/admin/contact", icon: Mail },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { isAuthed, ready, user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth guard — bounce to login if not signed in.
  useEffect(() => {
    if (ready && !isAuthed) navigate({ to: "/admin/login" });
  }, [ready, isAuthed, navigate]);

  // Close the mobile drawer on route change.
  useEffect(() => setMobileOpen(false), [pathname]);

  if (!ready || !isAuthed) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40">
        <div className="flex items-center gap-3 text-text/60">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          Loading admin…
        </div>
      </div>
    );
  }

  const SidebarInner = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img src={nirmalaLogo} alt="" className="h-9 w-9 rounded-lg object-contain" />
        <div className="leading-tight">
          <div className="font-display text-sm font-bold text-ink">Nirmala Foundation</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Admin Panel
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => {
          const active = item.to && (item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to));
          const Icon = item.icon;
          if (item.soon) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text/40"
              >
                <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                {item.label}
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text/50">
                  Soon
                </span>
              </div>
            );
          }
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-text/70 hover:bg-primary-pale hover:text-primary"
              }`}
            >
              <Icon style={{ width: 18, height: 18 }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text/70 transition-colors hover:bg-muted"
        >
          <ExternalLink style={{ width: 18, height: 18 }} /> View live site
        </a>
        <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-white">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold text-ink">{user?.name}</div>
            <div className="truncate text-xs text-text/55">{user?.email}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            aria-label="Sign out"
            className="grid h-8 w-8 place-items-center rounded-lg text-text/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-card shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-lg text-text/60 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarInner />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
          <div className="flex items-center gap-4 px-5 py-4 md:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-lg text-text/70 hover:bg-muted lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl font-bold text-ink md:text-2xl">{title}</h1>
              {subtitle && <p className="truncate text-sm text-text/60">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        </header>

        <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
