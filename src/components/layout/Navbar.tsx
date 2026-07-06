import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  const { location } = useRouterState();

  const overHero = location.pathname === "/";
  const solid = scrolled || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const linkColor = solid ? "text-ink/80" : "text-white/90";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          solid ? "bg-white shadow-[0_2px_20px_-8px_rgba(39,27,51,0.25)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-[74px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Nirmala Foundation home">
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

          <nav className="hidden lg:flex items-center gap-1">
            {menu.map((group) =>
              group.items ? (
                <div key={group.label} className="relative group">
                  <button
                    className={`flex items-center gap-1 px-3.5 py-2 text-[12px] font-display font-semibold uppercase tracking-[0.12em] transition-colors hover:text-accent ${linkColor}`}
                  >
                    {group.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible">
                    <div className="min-w-[230px] rounded-2xl bg-white border border-border shadow-[0_24px_60px_-20px_rgba(39,27,51,0.35)] p-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.label + item.href}
                          to={item.href}
                          params={item.params as never}
                          className="block rounded-xl px-4 py-2.5 text-sm font-medium text-text hover:bg-primary-pale hover:text-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={group.label}
                  to={group.href!}
                  className={`px-3.5 py-2 text-[12px] font-display font-semibold uppercase tracking-[0.12em] transition-colors hover:text-accent ${linkColor}`}
                  activeProps={{ className: "px-3.5 py-2 text-[12px] font-display font-semibold uppercase tracking-[0.12em] text-accent" }}
                >
                  {group.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/donate"
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
                    className="block py-4 border-b border-white/10 text-white font-display font-bold uppercase tracking-[0.1em] text-lg hover:text-accent"
                  >
                    {group.label}
                  </Link>
                )
              )}
              <Link to="/donate" className="btn-pill btn-accent w-full justify-center mt-8">
                <Heart className="h-4 w-4" /> Donate Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
