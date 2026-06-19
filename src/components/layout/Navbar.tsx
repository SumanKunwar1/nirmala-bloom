import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { navLinks } from "@/lib/constants";
import logo from "@/assets/nirmala-logo.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "NP">("EN");
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-white/85 backdrop-blur-lg shadow-sm" : "bg-white/40 backdrop-blur-md"}`}>
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Nirmala Foundation home">
            <img src={logo} alt="" className="w-12 h-12 object-contain" />
            <div className="leading-tight">
              <div className="font-display font-bold text-ink text-base">Nirmala Foundation</div>
              <div className="text-[11px] tracking-wider uppercase text-text/60">Nepal</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href}
                className="relative px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm font-semibold text-primary" }}
                activeOptions={{ exact: l.href === "/" }}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-primary-pale rounded-full p-1 text-xs font-semibold">
              {(["EN", "NP"] as const).map((code) => (
                <button key={code} onClick={() => setLang(code)}
                  className={`px-3 py-1 rounded-full transition-colors ${lang === code ? "bg-primary text-white" : "text-primary"}`}>
                  {code}
                </button>
              ))}
            </div>
            <Link to="/donate" className="hidden md:inline-flex items-center gap-1.5 bg-accent text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[0_10px_24px_-10px_rgba(217,115,43,0.8)] hover:-translate-y-0.5 transition-transform">
              <Heart className="h-4 w-4" />
              Donate
            </Link>
            <button className="lg:hidden p-2 text-ink" onClick={() => setOpen(true)} aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-xl flex flex-col">
            <div className="flex items-center justify-between p-6">
              <span className="font-display text-white text-lg">Menu</span>
              <button className="text-white p-2" onClick={() => setOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <motion.nav initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
              {navLinks.map((l) => (
                <motion.div key={l.href} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <Link to={l.href} className="text-3xl font-display text-white hover:text-accent">{l.label}</Link>
                </motion.div>
              ))}
              <Link to="/donate" className="mt-8 bg-accent text-white px-8 py-4 rounded-full font-semibold">
                Donate Now
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
