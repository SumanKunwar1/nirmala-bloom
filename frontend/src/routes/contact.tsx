import { createFileRoute } from "@tanstack/react-router";
import { useState, type ComponentType } from "react";
import { MapPin, Phone, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { imgs } from "@/lib/images";
import { addSubmission } from "@/lib/admin/inbox";
import { useContent } from "@/lib/admin/context";

const SUBJECTS = ["General Inquiry", "Volunteer", "Partnership", "Press", "Donation"];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Nirmala Foundation" },
      { name: "description", content: "Get in touch with Nirmala Foundation Nepal." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { contactInfo } = useContent();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await addSubmission({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

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

      <section className="py-20 shell grid lg:grid-cols-5 gap-10">
        {sent ? (
          <div className="lg:col-span-3 rounded-3xl bg-white border border-border p-10 soft-shadow flex flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-green-light text-green">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">Message sent!</h2>
            <p className="mt-2 max-w-md text-text/70">
              Thank you for reaching out. Our team will get back to you soon.
            </p>
            <button onClick={() => setSent(false)} className="btn-pill btn-outline mt-7">
              Send another message
            </button>
          </div>
        ) : (
          <form
            className="lg:col-span-3 rounded-3xl bg-white border border-border p-8 soft-shadow space-y-5"
            onSubmit={submit}
          >
            <div className="eyebrow mb-2">Send a Message</div>
            <h2 className="font-display text-2xl font-bold heading-rule mb-2">We&apos;d love to hear from you</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            <select
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary bg-white"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s === "General Inquiry" ? "Subject — General Inquiry" : s}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Your message"
              rows={6}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary"
            />
            {error && (
              <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <button type="submit" disabled={sending} className="btn-pill btn-accent disabled:opacity-60">
              {sending ? "Sending…" : "Send Message →"}
            </button>
          </form>
        )}

        <aside className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-primary-pale to-accent-light/60 p-7">
            <h3 className="font-display text-xl font-semibold mb-5">Get in touch</h3>
            <ul className="space-y-4 text-sm text-text/80">
              <ContactRow icon={MapPin} label="Address" value={contactInfo.address} />
              <ContactRow icon={Phone} label="Phone" value={contactInfo.phone} />
              <ContactRow icon={Mail} label="Email" value={contactInfo.email} />
            </ul>
            {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                className="mt-6 inline-flex items-center gap-2 bg-green text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:-translate-y-0.5 transition-transform"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            )}
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text/55 mb-3">
                Follow us
              </div>
              <SocialIcons size="md" />
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border h-72 soft-shadow">
            <iframe title="Map" className="w-full h-full" src={contactInfo.mapEmbed} />
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
