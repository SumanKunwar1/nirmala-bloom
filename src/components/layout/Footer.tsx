import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { navLinks, programs } from "@/lib/constants";
import { SocialIcons } from "@/components/shared/SocialIcons";
import logo from "@/assets/nirmala-logo.png";

export function Footer() {
  return (
    <footer className="mt-24">
      {/* Newsletter band — BlinkNow's "Add hope to your inbox" */}
      <div className="aurora-deep grain relative">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center text-white">
          <div className="eyebrow text-accent-light mb-4">Stay Connected</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "#fff" }}>
            Add hope to your inbox
          </h2>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">
            Monthly stories from the field, program updates, and simple ways to get involved — straight to you.
          </p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@example.com"
              required
              aria-label="Email address"
              className="flex-1 rounded-full px-5 py-3.5 bg-white/12 border border-white/25 text-white placeholder:text-white/55 outline-none focus:bg-white/20"
            />
            <button className="btn-pill btn-accent justify-center">
              Sign Up <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Columns */}
      <div className="bg-ink text-white/75">
        <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
              <div>
                <div className="font-display text-white text-lg font-extrabold tracking-tight">Nirmala Foundation</div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-white/55">Nepal</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Empowering communities, breaking barriers, and inspiring futures for people with
              disabilities across Nepal.
            </p>
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
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> Kathmandu, Nepal
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> info@nirmalafoundation.org.np
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> +977 9800000000
              </li>
            </ul>
            <Link to="/donate" className="btn-pill btn-accent mt-6 !py-2.5 !px-6 text-[10px]">
              Donate Now
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/55 gap-3">
            <span>© 2025 Nirmala Foundation Nepal. Registered NGO, Nepal.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
