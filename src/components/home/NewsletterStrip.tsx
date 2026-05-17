export function NewsletterStrip() {
  return (
    <section className="py-24 bg-gradient-to-b from-primary-pale/40 to-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-light text-green px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] mb-5">
          <span>📬</span> Newsletter
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">Stay connected with our work</h2>
        <p className="mt-3 text-text/70 max-w-xl mx-auto">
          Monthly updates on programs, stories from the field, and ways to get involved.
        </p>
        <form className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="you@example.com"
            required
            className="flex-1 rounded-full px-5 py-3 bg-white border border-border outline-none focus:border-primary"
          />
          <button className="bg-primary text-white rounded-full px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform">
            Subscribe
          </button>
        </form>
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          {["🤝 Volunteer", "🏢 Partner with us", "📱 Follow us"].map((t) => (
            <a key={t} href="#" className="text-primary font-medium hover:underline underline-offset-4">
              {t}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
