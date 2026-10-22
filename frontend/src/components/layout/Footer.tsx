import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ArrowRight, ArrowUp, Check, Heart } from "lucide-react";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { useContent } from "@/lib/admin/context";
import { subscribeNewsletter } from "@/lib/admin/inbox";
import logo from "@/assets/nirmala-logo.png";

const explore = [
  { label: "Our story", href: "/about" },
  { label: "Our work", href: "/programs" },
  { label: "News & updates", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Resources", href: "/resources" },
  { label: "Partners", href: "/partners" },
] as const;

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

  const heading = "text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-5";
  const link = "text-white/75 hover:text-white transition-colors";

  return (
    <footer className="aurora-deep grain text-white/75">
      {/* Statement + newsletter */}
      <div className="shell relative pt-20 md:pt-28 pb-16 grid lg:grid-cols-12 gap-12 lg:gap-16 border-b border-white/10">
        <div className="lg:col-span-7">
          <h2 className="display-2 !text-white max-w-2xl">
            Building belonging, <span className="serif-em on-dark">together.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white/70 leading-relaxed">
            Every programme we run is shaped by people with lived experience of disability. Join us
            — as a donor, volunteer, or partner.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/donate" className="btn-pill btn-accent">
              <Heart className="h-4 w-4" fill="currentColor" /> Donate now
            </Link>
            <Link to="/contact" className="btn-pill btn-outline-light">
              Volunteer with us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pl-10 lg:border-l border-white/10">
          <div className={heading}>Newsletter</div>
          <h3 className="font-display text-2xl !text-white">{footer.newsletterHeading}</h3>
          <p className="mt-3 text-white/65 leading-relaxed">{footer.newsletterText}</p>
          {status === "done" ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-5 py-3 text-white">
              <Check className="h-4 w-4 text-accent" /> Thanks — you're on the list.
            </div>
          ) : (
            <form
              className="mt-6 flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 p-1.5 focus-within:border-white/40 transition-colors"
              onSubmit={subscribe}
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-pill btn-light btn-sm disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-3 text-sm text-accent-light">{msg}</p>}
          <p className="mt-3 text-xs text-white/40">One email a month. Unsubscribe any time.</p>
        </div>
      </div>

      {/* Columns */}
      <div className="shell relative py-16 grid grid-cols-2 md:grid-cols-12 gap-10">
        <div className="col-span-2 md:col-span-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={settings.logo || logo}
              alt=""
              className="w-11 h-11 object-contain bg-white rounded-full p-1"
            />
            <span className="font-display text-xl text-white">Nirmala Foundation</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{footer.aboutText}</p>
          <SocialIcons size="md" className="mt-6" />
        </div>

        <div className="md:col-span-2">
          <div className={heading}>Explore</div>
          <ul className="space-y-3 text-[15px]">
            {explore.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className={heading}>Programmes</div>
          <ul className="space-y-3 text-[15px]">
            {programs
              .filter((p) => p.published !== false)
              .map((p) => (
                <li key={p.slug}>
                  <Link to="/programs/$slug" params={{ slug: p.slug }} className={link}>
                    {p.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-3">
          <div className={heading}>Get in touch</div>
          <ul className="space-y-4 text-[15px]">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-1 shrink-0 text-accent" />
              <span className="text-white/75">{contactInfo.address}</span>
            </li>
            <li>
              <a href={`mailto:${contactInfo.email}`} className={`flex items-start gap-3 ${link}`}>
                <Mail className="h-4 w-4 mt-1 shrink-0 text-accent" /> {contactInfo.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                className={`flex items-start gap-3 ${link}`}
              >
                <Phone className="h-4 w-4 mt-1 shrink-0 text-accent" /> {contactInfo.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell relative py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/45">
          <span>{footer.copyright}</span>
          <div className="flex items-center gap-6">
            {footer.legalLinks.map((l) => (
              <a key={l.label} href={l.url} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
