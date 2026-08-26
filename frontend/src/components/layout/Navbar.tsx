import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ChevronDown, Plus } from "lucide-react";
import { programs } from "@/lib/constants";
import logo from "@/assets/nirmala-logo.png";

type MenuItem = { label: string; href: string; params?: Record<string, string> };
type MenuGroup = { label: string; href?: string; items?: MenuItem[] };

const menu: MenuGroup[] = [
  {
    label: "Who We Are",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Our Partners", href: "/partners" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    label: "What We Do",
    items: [
      { label: "All Programs", href: "/programs" },
      ...programs.map((p) => ({ label: p.title, href: "/programs/$slug", params: { slug: p.slug } })),
    ],
  },
  {
    label: "Our Stories",
    items: [
      { label: "News & Updates", href: "/news" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "Get Involved",
    items: [
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/contact" },
      { label: "Partner With Us", href: "/partners" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  /** Which desktop dropdown is showing. Controlled rather than CSS-hover so a
   *  click can dismiss it — on hover alone the panel stays up after navigating
   *  because the pointer is still over it. */
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { location } = useRouterState();

  const overHero = location.pathname === "/";
  const solid = scrolled || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenus = useCallback(() => {
    setOpen(false);
    setOpenGroup(null);
    setMobileGroup(null);
  }, []);

  /**
   * Dismiss on navigation. Route changes also fire when only the search or
   * hash differs, so this covers more than a plain pathname switch — and the
   * link handlers below cover navigating to the page you are already on,
   * where the router state never changes at all.
   */
  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.searchStr, closeMenus]);

  /** Escape closes the open dropdown; a click outside dismisses it too. */
  useEffect(() => {
    if (!openGroup) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openGroup]);

  /**
   * Run on every nav link click. Closes the menus and drops focus, so the
   * browser does not leave a focus ring on the item you just followed.
   */
  const handleNavigate = useCallback(() => {
    closeMenus();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [closeMenus]);

  const linkColor = solid ? "text-ink/80" : "text-white/90";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          solid ? "bg-white shadow-[0_2px_20px_-8px_rgba(39,27,51,0.25)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-[74px] flex items-center justify-between">
          <Link to="/" onClick={handleNavigate} className="flex items-center gap-3" aria-label="Nirmala Foundation home">
            <img
              src={logo}
              alt=""
              className={`w-11 h-11 object-contain ${solid ? "" : "bg-white/90 rounded-full p-1"}`}
            />
            <div className="leading-tight">
              <div className={`font-display font-extrabold text-[15px] tracking-tight ${solid ? "text-ink" : "text-white"}`}>
                Nirmala Foundation
              </div>
              <div className={`text-[10px] tracking-[0.22em] uppercase ${solid ? "text-text/55" : "text-white/70"}`}>
                Nepal
              </div>
            </div>
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center gap-1">
            {menu.map((group) => {
              if (!group.items) {
                return (
                  <Link
                    key={group.label}
                    to={group.href!}
                    onClick={handleNavigate}
                    className={`px-3.5 py-2 text-[12px] font-display font-semibold uppercase tracking-[0.12em] transition-colors hover:text-accent ${linkColor}`}
                    activeProps={{ className: "px-3.5 py-2 text-[12px] font-display font-semibold uppercase tracking-[0.12em] text-accent" }}
                  >
                    {group.label}
                  </Link>
                );
              }

              const isOpen = openGroup === group.label;
              const panelId = `nav-${group.label.replace(/\s+/g, "-").toLowerCase()}`;

              return (
                <div
                  key={group.label}
                  className="relative"
                  // Hover-to-open is for mice only. On a touch screen the
                  // browser emulates enter/leave around a tap, which would
                  // open the panel and then let the click toggle it shut.
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setOpenGroup(group.label);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") {
                      setOpenGroup((g) => (g === group.label ? null : g));
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenGroup((g) => (g === group.label ? null : group.label))}
                    onFocus={() => setOpenGroup(group.label)}
                    className={`flex items-center gap-1 px-3.5 py-2 text-[12px] font-display font-semibold uppercase tracking-[0.12em] transition-colors hover:text-accent ${linkColor}`}
                  >
                    {group.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 opacity-70 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={panelId}
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 ${
                      isOpen
                        ? "opacity-100 visible translate-y-0"
                        : "pointer-events-none invisible translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="min-w-[230px] rounded-2xl bg-white border border-border shadow-[0_24px_60px_-20px_rgba(39,27,51,0.35)] p-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.label + item.href}
                          to={item.href}
                          params={item.params as never}
                          onClick={handleNavigate}
                          tabIndex={isOpen ? undefined : -1}
                          className="block rounded-xl px-4 py-2.5 text-sm font-medium text-text hover:bg-primary-pale hover:text-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/donate"
              onClick={handleNavigate}
              className="hidden md:inline-flex items-center gap-1.5 bg-accent text-white px-5 py-2.5 rounded-full text-[11px] font-display font-bold uppercase tracking-[0.12em] shadow-[0_10px_26px_-10px_rgba(217,115,43,0.85)] hover:-translate-y-0.5 transition-transform"
            >
              <Heart className="h-3.5 w-3.5" />
              Donate Now
            </Link>
            <button
              className={`lg:hidden p-2 ${solid ? "text-ink" : "text-white"}`}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/97 backdrop-blur-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="font-display font-bold text-white text-lg uppercase tracking-[0.12em]">Menu</span>
              <button className="text-white p-2" onClick={() => setOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {menu.map((group) =>
                group.items ? (
                  <div key={group.label} className="border-b border-white/10">
                    <button
                      onClick={() => setMobileGroup((g) => (g === group.label ? null : group.label))}
                      className="w-full flex items-center justify-between py-4 text-white font-display font-bold uppercase tracking-[0.1em] text-lg"
                    >
                      {group.label}
                      <Plus className={`h-5 w-5 transition-transform ${mobileGroup === group.label ? "rotate-45" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileGroup === group.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 flex flex-col gap-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.label + item.href}
                                to={item.href}
                                params={item.params as never}
                                onClick={handleNavigate}
                                className="py-2 pl-1 text-white/75 hover:text-accent"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={group.label}
                    to={group.href!}
                    onClick={handleNavigate}
                    className="block py-4 border-b border-white/10 text-white font-display font-bold uppercase tracking-[0.1em] text-lg hover:text-accent"
                  >
                    {group.label}
                  </Link>
                )
              )}
              <Link to="/donate" onClick={handleNavigate} className="btn-pill btn-accent w-full justify-center mt-8">
                <Heart className="h-4 w-4" /> Donate Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
