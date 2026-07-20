import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useContent } from "@/lib/admin/context";

export function NewsletterStrip() {
  const { getInvolved, contactInfo } = useContent();
  if (getInvolved.length === 0) return null;
  return (
    <section className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Get Involved"
          title="Be part of the change"
          subtitle="There are many ways to help break barriers — find the one that fits you."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getInvolved.map((w, i) => (
            <motion.div
              key={w.id ?? w.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-card border border-border p-8 soft-shadow lift"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-light text-2xl mb-6">
                {w.icon}
              </span>
              <h3 className="font-display text-xl font-bold text-ink mb-3">{w.title}</h3>
              <p className="text-text/75 leading-relaxed text-[15px] mb-5">{w.text}</p>
              <Link
                to={w.title.toLowerCase().includes("donate") ? "/donate" : "/contact"}
                className="inline-flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-[0.14em] text-primary hover:gap-2.5 transition-all"
              >
                {w.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
        {contactInfo.instagram && (
          <div className="mt-10 text-center">
            <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="btn-pill btn-primary">
              Follow us on Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
