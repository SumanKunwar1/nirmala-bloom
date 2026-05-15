import { Link } from "@tanstack/react-router";
import { navLinks, programs } from "@/lib/constants";
import logo from "@/assets/nirmala-logo.png";

export function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
            <div>
              <div className="font-display text-white text-lg font-semibold">Nirmala Foundation</div>
              <div className="text-xs tracking-wider uppercase text-white/60">Nepal</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            Empowering people with disabilities through sports, arts, education, and mobility across Nepal.
          </p>
          <div className="flex gap-3 mt-5">
            {["Facebook", "Instagram", "YouTube"].map((s) => (
              <a key={s} href="#" aria-label={s} className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent grid place-items-center transition-colors">
                <span className="text-xs font-bold">{s[0]}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}><Link to={l.href} className="hover:text-accent transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4">Programs</h4>
          <ul className="space-y-2 text-sm">
            {programs.map((p) => (
              <li key={p.slug}><Link to="/programs/$slug" params={{ slug: p.slug }} className="hover:text-accent transition-colors">{p.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4">Stay Connected</h4>
          <p className="text-sm text-white/70 mb-3">Kathmandu, Nepal<br/>info@nirmalafoundation.org.np<br/>+977 9800000000</p>
          <form className="flex gap-2 mt-4">
            <input type="email" placeholder="Email address" className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/50 focus:bg-white/15 outline-none" />
            <button className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold">Join</button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/60 gap-3">
          <span>© 2025 Nirmala Foundation Nepal. Registered NGO, Nepal.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
