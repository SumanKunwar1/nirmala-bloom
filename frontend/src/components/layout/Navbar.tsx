import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ChevronDown, ArrowRight, ArrowUpRight, X, Mail, Phone } from "lucide-react";
import { useContent } from "@/lib/admin/context";
import { programImages, imgs } from "@/lib/images";
import logo from "@/assets/nirmala-logo.png";

type MenuItem = { label: string; hint?: string; href: string; params?: Record<string, string> };
type MenuGroup = {
  label: string;
  href?: string;
  /** Path prefixes that mark this group as the current section. */
  match: string[];
  items?: MenuItem[];
  /** Renders the wide programme panel instead of a plain list. */
  mega?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;
/** How long a hovered dropdown stays open after the pointer leaves it. */
const HOVER_CLOSE_MS = 350;

export function Navbar() {
  const { programs, settings, contactInfo } = useContent();
  const visiblePrograms = programs.filter((p) => p.published !== false);

  const menu: MenuGroup[] = [
    {
      label: "About",
      match: ["/about", "/partners", "/resources"],
      items: [
        { label: "Our story", hint: "Mission, founder & the team", href: "/about" },
        { label: "Partners", hint: "The people we build alongside", href: "/partners" },
        { label: "Resources", hint: "Reports, research & guides", href: "/resources" },
      ],
    },
    {
      label: "Our Work",
      match: ["/programs"],
      mega: true,
      items: visiblePrograms.map((p) => ({
        label: p.title,
        hint: p.desc,
        href: "/programs/$slug",
        params: { slug: p.slug },
      })),
    },
    {
      label: "Stories",
      match: ["/news", "/gallery"],
      items: [
        { label: "News & updates", hint: "Field notes, events & press", href: "/news" },
        { label: "Gallery", hint: "Moments of belonging", href: "/gallery" },
      ],
    },
    {
      label: "Get Involved",
      match: ["/donate"],
      items: [
        { label: "Donate", hint: "Fund a programme directly", href: "/donate" },
        { label: "Volunteer", hint: "Give your time and skills", href: "/contact" },
        { label: "Partner with us", hint: "Organisations & companies", href: "/partners" },
      ],
    },
    { label: "Contact", href: "/contact", match: ["/contact"] },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  /** Which desktop dropdown is showing. Controlled rather than CSS-hover so a
   *  click can dismiss it — on hover alone the panel stays up after navigating
   *  because the pointer is still over it. */
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  /** Pointer type of the press that led to the current click. A mouse has
   *  already opened the panel on hover, so its click must not toggle it shut. */
  const pressPointer = useRef<string | null>(null);
  /**
   * Pending hover-close. Leaving a trigger only closes its panel after a short
   * grace period, so the pointer can cross the gap between the button and the
   * panel (or overshoot an edge) without the menu vanishing.
   */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  const scheduleClose = useCallback(
    (label: string) => {
      cancelClose();
      closeTimer.current = setTimeout(() => {
        setOpenGroup((g) => (g === label ? null : g));
      }, HOVER_CLOSE_MS);
    },
    [cancelClose],
  );
  useEffect(() => cancelClose, [cancelClose]);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenus = useCallback(() => {
    cancelClose();
    setOpen(false);
    setOpenGroup(null);
    setMobileGroup(null);
  }, [cancelClose]);

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

  /** The mobile sheet owns the screen while open — lock page scroll and let Escape close it. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /**
   * Run on every nav link click. Closes the menus and drops focus, so the
   * browser does not leave a focus ring on the item you just followed.
   */
  const handleNavigate = useCallback(() => {
    closeMenus();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [closeMenus]);

  const isActive = (g: MenuGroup) => g.match.some((m) => location.pathname.startsWith(m));

  const programFor = (slug?: string) => visiblePrograms.find((p) => p.slug === slug);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 border-b ${
          scrolled || openGroup
            ? "bg-background/90 backdrop-blur-xl border-border shadow-[0_8px_30px_-20px_rgba(31,26,46,0.35)]"
            : "bg-background/70 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="shell h-[74px] flex items-center justify-between gap-3 lg:gap-6">
          <Link
            to="/"
            onClick={handleNavigate}
            className="flex items-center gap-3 shrink-0"
            aria-label="Nirmala Foundation home"
          >
            <img
              src={settings.logo || logo}
              alt=""
              className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 object-contain"
            />
            <span className="leading-none min-w-0">
              <span className="block font-display text-[16px] sm:text-[19px] truncate font-semibold tracking-[-0.02em] text-ink">
                Nirmala Foundation
              </span>
              <span className="block mt-1 text-[10px] font-semibold tracking-[0.28em] uppercase text-text/55">
                Nepal
              </span>
            </span>
          </Link>

          <nav ref={navRef} aria-label="Main" className="hidden lg:flex items-center gap-0.5">
            {menu.map((group) => {
              const active = isActive(group);
              const base =
                "relative flex items-center gap-1 px-3.5 py-2 rounded-full text-[15px] font-medium transition-colors";
              const tone = active ? "text-ink" : "text-ink/65 hover:text-ink";
              const marker = active && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-1 w-1 rounded-full bg-accent"
                  aria-hidden
                />
              );

              if (!group.items) {
                return (
                  <Link
                    key={group.label}
                    to={group.href!}
                    onClick={handleNavigate}
                    className={`${base} ${tone}`}
                  >
                    {group.label}
                    {marker}
                  </Link>
                );
              }

              const isOpen = openGroup === group.label;
              const panelId = `nav-${group.label.replace(/\s+/g, "-").toLowerCase()}`;

              return (
                <div
                  key={group.label}
                  className={group.mega ? "" : "relative"}
                  // Hover-to-open is for mice only. On a touch screen the
                  // browser emulates enter/leave around a tap, which would
                  // open the panel and then let the click toggle it shut.
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    cancelClose();
                    setOpenGroup(group.label);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") scheduleClose(group.label);
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onPointerDown={(e) => {
                      pressPointer.current = e.pointerType;
                    }}
                    onClick={() => {
                      const mouse = pressPointer.current === "mouse";
                      pressPointer.current = null;
                      setOpenGroup((g) =>
                        mouse ? group.label : g === group.label ? null : group.label,
                      );
                    }}
                    onFocus={() => setOpenGroup(group.label)}
                    className={`${base} ${isOpen ? "text-ink bg-ink/[0.04]" : tone}`}
                  >
                    {group.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 opacity-60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                    {marker}
                  </button>

                  <div
                    id={panelId}
                    className={`absolute top-full pt-3 transition-all duration-200 ${
                      group.mega ? "left-1/2 -translate-x-1/2" : "left-0"
                    } ${isOpen ? "opacity-100 visible translate-y-0" : "pointer-events-none invisible translate-y-1.5 opacity-0"}`}
                  >
                    {group.mega ? (
                      <div className="w-[min(920px,calc(100vw-3rem))] rounded-3xl bg-white border border-border shadow-[0_40px_80px_-30px_rgba(31,26,46,0.35)] p-3 grid grid-cols-[280px_1fr] gap-3">
                        <Link
                          to="/programs"
                          onClick={handleNavigate}
                          tabIndex={isOpen ? undefined : -1}
                          className="group relative overflow-hidden rounded-2xl min-h-[300px] flex flex-col justify-end p-6 text-white"
                        >
                          <img
                            src={imgs.pagePrograms}
                            alt=""
                            className="zoom-img absolute inset-0 h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-plum via-plum/50 to-transparent" />
                          <span className="relative">
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                              {visiblePrograms.length} programmes
                            </span>
                            <span className="mt-2 block font-display text-2xl leading-tight">
                              One movement, many ways in.
                            </span>
                            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                              Explore all our work{" "}
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </span>
                        </Link>
                        <div className="grid grid-cols-2 gap-1 content-start p-1">
                          {group.items.map((item) => {
                            const p = programFor(item.params?.slug);
                            return (
                              <Link
                                key={item.label}
                                to={item.href}
                                params={item.params as never}
                                onClick={handleNavigate}
                                tabIndex={isOpen ? undefined : -1}
                                className="group flex gap-3.5 rounded-2xl p-3.5 hover:bg-sand/70 transition-colors"
                              >
                                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                                  {(p?.image || programImages[p?.slug ?? ""]) && (
                                    <img
                                      src={p?.image || programImages[p!.slug]}
                                      alt=""
                                      loading="lazy"
                                      className="zoom-img h-full w-full object-cover"
                                    />
                                  )}
                                </span>
                                <span className="min-w-0">
                                  <span className="flex items-center gap-1.5 font-semibold text-ink text-[15px]">
                                    {item.label}
                                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0" />
                                  </span>
                                  <span className="mt-0.5 block text-[13px] leading-snug text-text/65 line-clamp-2">
                                    {item.hint}
                                  </span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="w-[290px] rounded-2xl bg-white border border-border shadow-[0_30px_60px_-24px_rgba(31,26,46,0.3)] p-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.label + item.href}
                            to={item.href}
                            params={item.params as never}
                            onClick={handleNavigate}
                            tabIndex={isOpen ? undefined : -1}
                            className="group flex items-start justify-between gap-3 rounded-xl px-4 py-3 hover:bg-sand/70 transition-colors"
                          >
                            <span>
                              <span className="block text-[15px] font-semibold text-ink">
                                {item.label}
                              </span>
                              {item.hint && (
                                <span className="block text-[13px] text-text/60 mt-0.5">
                                  {item.hint}
                                </span>
                              )}
                            </span>
                            <ArrowRight className="mt-1 h-4 w-4 text-ink/30 transition-all group-hover:text-accent group-hover:translate-x-0.5" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/donate"
              onClick={handleNavigate}
              className="btn-pill btn-accent btn-sm !shadow-none !px-4 sm:!px-[1.15rem]"
            >
              <Heart className="hidden sm:block h-4 w-4" fill="currentColor" />
              <span>Donate</span>
            </Link>
            <button
              className="lg:hidden grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink hover:bg-ink/[0.04] transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-plum/50 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease }}
              className="fixed inset-y-0 right-0 z-[61] w-full max-w-md bg-background flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 h-[74px] border-b border-border">
                <span className="font-display text-xl font-semibold text-ink">Menu</span>
                <button
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
                <Link
                  to="/"
                  onClick={handleNavigate}
                  className="flex items-center justify-between py-4 border-b border-border font-display text-2xl text-ink"
                >
                  Home
                </Link>
                {menu.map((group, gi) =>
                  group.items ? (
                    <div key={group.label} className="border-b border-border">
                      <button
                        onClick={() =>
                          setMobileGroup((g) => (g === group.label ? null : group.label))
                        }
                        aria-expanded={mobileGroup === group.label}
                        className="w-full flex items-center justify-between py-4 font-display text-2xl text-ink"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono-stat text-xs text-text/40">0{gi + 1}</span>
                          {group.label}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-text/50 transition-transform duration-300 ${
                            mobileGroup === group.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileGroup === group.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 grid gap-1">
                              {group.mega && (
                                <Link
                                  to="/programs"
                                  onClick={handleNavigate}
                                  className="flex items-center justify-between rounded-xl bg-ink text-white px-4 py-3 text-[15px] font-semibold"
                                >
                                  Overview of all programmes <ArrowRight className="h-4 w-4" />
                                </Link>
                              )}
                              {group.items.map((item) => (
                                <Link
                                  key={item.label + item.href}
                                  to={item.href}
                                  params={item.params as never}
                                  onClick={handleNavigate}
                                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-ink/80 hover:bg-sand"
                                >
                                  {item.label}
                                  <ArrowRight className="h-4 w-4 text-ink/30" />
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
                      className="flex items-baseline gap-3 py-4 border-b border-border font-display text-2xl text-ink"
                    >
                      <span className="font-mono-stat text-xs text-text/40">0{gi + 1}</span>
                      {group.label}
                    </Link>
                  ),
                )}
              </nav>

              <div className="border-t border-border p-5 space-y-4 bg-sand/60">
                <Link
                  to="/donate"
                  onClick={handleNavigate}
                  className="btn-pill btn-accent btn-lg w-full"
                >
                  <Heart className="h-4 w-4" fill="currentColor" /> Donate now
                </Link>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text/70">
                  {contactInfo.email && (
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="inline-flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" /> {contactInfo.email}
                    </a>
                  )}
                  {contactInfo.phone && (
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" /> {contactInfo.phone}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
