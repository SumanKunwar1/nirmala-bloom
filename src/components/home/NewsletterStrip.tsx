import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HandHeart, Building2, Share2, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { socialLinks } from "@/lib/constants";

const ways = [
  {
    icon: HandHeart,
    title: "Volunteer",
    text: "Give your time and skills at a rural camp, a sports session or a weekend arts circle.",
    cta: "Get in touch",
    to: "/contact" as const,
  },
  {
    icon: Building2,
    title: "Partner With Us",
    text: "Schools, companies and organisations power our reach. Let's build inclusion together.",
    cta: "Become a partner",
    to: "/partners" as const,
  },
  {
    icon: Share2,
    title: "Follow Our Story",
    text: "Share our work, celebrate our athletes and help more people find a place to belong.",
    cta: "Follow us",
    to: "/news" as const,
  },
];

export function NewsletterStrip() {
  return (
    <section className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Get Involved"
          title="Be part of the change"
          subtitle="There are many ways to help break barriers — find the one that fits you."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {ways.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-card border border-border p-8 soft-shadow lift"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-light text-accent mb-6">
                <w.icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-xl font-bold text-ink mb-3">{w.title}</h3>
              <p className="text-text/75 leading-relaxed text-[15px] mb-5">{w.text}</p>
              <Link
                to={w.to}
                className="inline-flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-[0.14em] text-primary hover:gap-2.5 transition-all"
              >
                {w.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="btn-pill btn-primary">
            Follow @nirmala_foundation
          </a>
        </div>
      </div>
    </section>
  );
}
