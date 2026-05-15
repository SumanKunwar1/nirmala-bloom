import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PersonCard } from "@/components/shared/PersonCard";
import { ScrollReveal, containerVariants, itemVariants } from "@/components/shared/ScrollReveal";
import { team, milestones } from "@/lib/constants";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Nirmala Foundation Nepal" },
    { name: "description", content: "Founded by para-athlete Nirmala Bhandari, advancing disability inclusion across Nepal." },
    { property: "og:title", content: "About Nirmala Foundation" },
  ]}),
  component: About,
});

function About() {
  return (
    <>
      <PageHero title="Who We Are" subtitle="A Kathmandu-based foundation building a more inclusive Nepal." breadcrumb="About" />

      <section className="py-24 mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <SectionHeading eyebrow="Our Story" title="From Hope Centre to national champion." />
          <div className="space-y-4 text-text/80 leading-relaxed">
            <p>Nirmala Foundation Nepal was founded in January 2024 by <strong className="text-ink">Nirmala Bhandari</strong> — a former Hope Centre resident, national wheelchair basketball player, para-powerlifter, Miss Disability Queen, and UN Women Nepal honoree.</p>
            <p>Recognized on the D-30 Disability Impact List 2025, Nirmala leads a team committed to dignity, mobility, and joy for Nepalis with disabilities.</p>
          </div>
          <blockquote className="mt-8 border-l-4 border-accent pl-6 py-2 text-xl font-display italic text-ink">
            "We don't ask for permission to belong. We build belonging — every day, in every community."
          </blockquote>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="aspect-[4/5] rounded-3xl grain shadow-2xl" style={{ background: "linear-gradient(135deg, #6B2FA0 0%, #F97316 100%)" }} />
        </ScrollReveal>
      </section>

      <section className="py-20 bg-primary-pale/40">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="What guides us" title="Mission, vision & values" align="center" />
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: "🎯", title: "Mission", text: "To empower people with disabilities in Nepal through inclusive sports, arts, education, and mobility." },
              { icon: "👁️", title: "Vision", text: "A Nepal where every person — regardless of ability — belongs, contributes, and thrives." },
              { icon: "💜", title: "Values", text: "Dignity, accessibility, joy, community, and unwavering advocacy." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl bg-white p-7 border-l-4 border-primary shadow-sm">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-2">{c.title}</h3>
                <p className="text-text/75 text-sm leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Our Journey" title="Milestones" align="center" />
        <div className="relative mt-12">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
          <div className="space-y-10">
            {milestones.map((m, i) => (
              <ScrollReveal key={m.year} delay={i * 0.05}>
                <div className={`md:flex items-center gap-8 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                  <div className="flex-1 md:text-right">
                    <div className="rounded-2xl bg-white border border-border p-6 shadow-sm">
                      <div className="text-accent text-sm font-mono-stat font-semibold">{m.year}</div>
                      <h3 className="font-display text-xl font-semibold mt-1">{m.title}</h3>
                      <p className="text-text/75 text-sm mt-2">{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-4 h-4 rounded-full bg-accent ring-4 ring-accent-light shrink-0" />
                  <div className="flex-1" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-pale/40">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Our People" title="Board & team" />
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((p) => (
              <motion.div key={p.name} variants={itemVariants}><PersonCard {...p} /></motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
