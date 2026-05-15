export function NewsletterStrip() {
  return (
    <section className="py-20 bg-green-light">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold">Stay connected with our work</h2>
        <p className="mt-3 text-text/75">Monthly updates on programs, stories, and ways to get involved.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input type="email" placeholder="you@example.com" required
            className="flex-1 rounded-full px-5 py-3 bg-white border border-border outline-none focus:border-primary" />
          <button className="bg-primary text-white rounded-full px-6 py-3 font-semibold hover:scale-105 transition-transform">Subscribe</button>
        </form>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          {["🤝 Volunteer", "🏢 Partner With Us", "📱 Follow Us"].map((t) => (
            <a key={t} href="#" className="text-primary font-medium hover:underline underline-offset-4">{t}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
