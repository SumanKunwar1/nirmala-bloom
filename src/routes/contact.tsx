import { createFileRoute } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { imgs } from "@/lib/images";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nirmala Foundation" },
      { name: "description", content: "Get in touch with Nirmala Foundation Nepal." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="We'd love to hear from you."
        subtitle="Questions about our work, partnership ideas, press requests, or volunteering — drop us a note and the team will be in touch."
        breadcrumb="Contact"
        image={imgs.pageContact}
        imageAlt="Connect with the Nirmala Foundation team"
      />

      <section className="py-20 mx-auto max-w-7xl px-6 grid lg:grid-cols-5 gap-10">
        <form
          className="lg:col-span-3 rounded-3xl bg-white border border-border p-8 soft-shadow space-y-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="font-display text-2xl font-semibold heading-rule mb-2">Send a message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Full name" />
            <Input placeholder="Email" type="email" />
          </div>
          <Input placeholder="Phone (optional)" />
          <Select>
            <option>Subject — General Inquiry</option>
            <option>Volunteer</option>
            <option>Partnership</option>
            <option>Press</option>
            <option>Donation</option>
          </Select>
          <textarea
            placeholder="Your message"
            rows={6}
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary"
          />
          <button className="bg-accent text-white rounded-full px-8 py-3 font-semibold hover:-translate-y-0.5 transition-transform shadow-[0_10px_24px_-10px_rgba(217,115,43,0.7)]">
            Send message →
          </button>
        </form>

        <aside className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-primary-pale to-accent-light/60 p-7">
            <h3 className="font-display text-xl font-semibold mb-5">Get in touch</h3>
            <ul className="space-y-4 text-sm text-text/80">
              <ContactRow icon={MapPin} label="Address" value="Kathmandu, Nepal" />
              <ContactRow icon={Phone} label="Phone" value="+977 9800000000" />
              <ContactRow icon={Mail} label="Email" value="info@nirmalafoundation.org.np" />
            </ul>
            <a
              href="https://wa.me/9779800000000"
              className="mt-6 inline-flex items-center gap-2 bg-green text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:-translate-y-0.5 transition-transform"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text/55 mb-3">
                Follow us
              </div>
              <SocialIcons size="md" />
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border h-72 soft-shadow">
            <iframe
              title="Map"
              className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=85.30%2C27.69%2C85.34%2C27.72&layer=mapnik"
            />
          </div>
        </aside>
      </section>
    </>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary transition-colors"
    />
  );
}
function Select({ children }: { children: React.ReactNode }) {
  return (
    <select className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary bg-white">
      {children}
    </select>
  );
}
function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-white grid place-items-center shrink-0 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="font-semibold text-ink text-sm">{label}</div>
        <div className="text-text/75">{value}</div>
      </div>
    </li>
  );
}
