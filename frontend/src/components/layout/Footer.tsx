import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ArrowRight, Check } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { useContent } from "@/lib/admin/context";
import { subscribeNewsletter } from "@/lib/admin/inbox";
import logo from "@/assets/nirmala-logo.png";

export function Footer() {
  const { footer, contactInfo, programs, settings } = useContent();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await subscribeNewsletter(email.trim(), "footer");
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Please try again.");
    }
  };

  return (
    <footer className="mt-24">
      {/* Newsletter band */}
      <div className="aurora-deep grain relative">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center text-white">
          <div className="eyebrow text-accent-light mb-4">Stay Connected</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "#fff" }}>
            {footer.newsletterHeading}
          </h2>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">{footer.newsletterText}</p>
          {status === "done" ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-6 py-3.5 text-white">
              <Check className="h-4 w-4" /> Thanks for subscribing!
            </div>
          ) : (
            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={subscribe}>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                className="flex-1 rounded-full px-5 py-3.5 bg-white/12 border border-white/25 text-white placeholder:text-white/55 outline-none focus:bg-white/20"
              />
              <button type="submit" disabled={status === "loading"} className="btn-pill btn-accent justify-center disabled:opacity-60">
                {status === "loading" ? "…" : "Sign Up"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-3 text-sm text-accent-light">{msg}</p>}
        </div>
      </div>

      {/* Columns */}
      <div className="bg-ink text-white/75">
        <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={settings.logo || logo} alt="" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
              <div>
                <div className="font-display text-white text-lg font-extrabold tracking-tight">Nirmala Foundation</div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-white/55">Nepal</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">{footer.aboutText}</p>
            <SocialIcons size="md" className="mt-5" />
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-[0.18em] mb-5">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-[0.18em] mb-5">Our Work</h4>
            <ul className="space-y-2.5 text-sm">
              {programs.map((p) => (
                <li key={p.slug}>
                  <Link to="/programs/$slug" params={{ slug: p.slug }} className="hover:text-accent transition-colors">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-[0.18em] mb-5">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> {contactInfo.address}
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> {contactInfo.email}
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> {contactInfo.phone}
              </li>
            </ul>
            <Link to="/donate" className="btn-pill btn-accent mt-6 !py-2.5 !px-6 text-[10px]">
              Donate Now
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/55 gap-3">
            <span>{footer.copyright}</span>
            <div className="flex gap-6">
              {footer.legalLinks.map((l) => (
                <a key={l.label} href={l.url} className="hover:text-white">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
