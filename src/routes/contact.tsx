import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/shared/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Nirmala Foundation" },
    { name: "description", content: "Get in touch with Nirmala Foundation Nepal." },
  ]}),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero title="Contact" subtitle="We'd love to hear from you." breadcrumb="Contact" />
      <section className="py-20 mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
        <form className="rounded-3xl bg-white border border-border p-8 shadow-sm space-y-5" onSubmit={(e) => e.preventDefault()}>
          <h2 className="font-display text-2xl font-semibold heading-rule mb-4">Send a message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Name" className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary" />
            <input placeholder="Email" type="email" className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary" />
          </div>
          <input placeholder="Phone" className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary" />
          <select className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary bg-white">
            <option>Subject — General Inquiry</option><option>Volunteer</option><option>Partnership</option><option>Press</option><option>Donation</option>
          </select>
          <textarea placeholder="Your message" rows={6} className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary" />
          <button className="bg-accent text-white rounded-full px-8 py-3 font-semibold hover:scale-105 transition-transform">Send Message</button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-primary-pale/50 p-8">
            <h3 className="font-display text-xl font-semibold mb-4">Get in touch</h3>
            <div className="space-y-3 text-sm text-text/80">
              <p><strong className="text-ink">Address:</strong><br/>Kathmandu, Nepal</p>
              <p><strong className="text-ink">Phone:</strong><br/>+977 9800000000</p>
              <p><strong className="text-ink">Email:</strong><br/>info@nirmalafoundation.org.np</p>
            </div>
            <a href="https://wa.me/9779800000000" className="mt-5 inline-flex items-center gap-2 bg-green text-white rounded-full px-5 py-2 text-sm font-semibold">
              💬 WhatsApp us
            </a>
            <div className="mt-5 flex gap-3">
              {["F", "I", "Y"].map((s) => (
                <a key={s} href="#" className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center font-semibold">{s}</a>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border h-72">
            <iframe title="Map" className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=85.30%2C27.69%2C85.34%2C27.72&layer=mapnik" />
          </div>
        </aside>
      </section>
    </>
  );
}
