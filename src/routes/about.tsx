import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Target, Eye, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PersonCard } from "@/components/shared/PersonCard";
import { ScrollReveal, containerVariants, itemVariants } from "@/components/shared/ScrollReveal";
import { team, milestones } from "@/lib/constants";
import { imgs, teamPhotos } from "@/lib/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nirmala Foundation Nepal" },
      {
        name: "description",
        content: "Founded by para-athlete Nirmala Bhandari, advancing disability inclusion across Nepal.",
      },
      { property: "og:title", content: "About Nirmala Foundation" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="Building belonging across Nepal."
        subtitle="A Kathmandu-based foundation working on disability inclusion through sports, arts, education and mobility — founded and led by people with lived experience."
        breadcrumb="About"
        image={imgs.pageAbout}
        imageAlt="Smiling people from the Nirmala Foundation community"
      />

      {/* Founder story */}
      <section className="py-24 mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <SectionHeading eyebrow="Our founder" title="The woman behind the foundation." />
          <div className="space-y-4 text-text/80 leading-relaxed">
            <p>
              The Nirmala Foundation Nepal was founded in January 2024 by{" "}
              <strong className="text-ink">Nirmala Bhandari</strong> — a woman with a disability whose own life is the
              reason this organisation exists. From her early years as a resident of the Hope Centre, she refused to let
              circumstance decide what she could become.
            </p>
            <p>
              Today she is a national wheelchair basketball player and para-powerlifter, a{" "}
              <strong className="text-ink">Miss Disability Queen</strong>, a UN Women Nepal honoree, and was named to the{" "}
              <strong className="text-ink">D-30 Disability Impact List 2025</strong>. But her proudest work is here —
              leading a team that builds dignity, mobility and joy for Nepalis with disabilities, every single day.
            </p>
            <p>
              Nirmala&apos;s lived experience shapes everything: programmes are co-created with the people they serve, not
              designed for them from a distance.
            </p>
          </div>
          <blockquote className="mt-8 border-l-4 border-accent pl-6 py-2 text-xl font-display italic text-ink">
            &ldquo;We don&apos;t ask for permission to belong. We build belonging — every day, in every community.&rdquo;
          </blockquote>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {[
              "National wheelchair basketball player",
              "Para-powerlifter",
              "Miss Disability Queen",
              "D-30 Honoree 2025",
            ].map((h) => (
              <li key={h} className="flex items-center gap-3 rounded-2xl bg-primary-pale/60 border border-border px-4 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                <span className="text-sm text-ink font-medium leading-tight">{h}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/15 to-accent/15 blur-2xl" aria-hidden />
            <div className="relative photo-frame aspect-[4/5] soft-shadow-lg">
              <img src={imgs.founderPortrait} alt="Nirmala Bhandari, founder of the Nirmala Foundation" className="ken-burns" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-2xl bg-white px-4 py-3 soft-shadow">
              <div className="w-9 h-9 rounded-full bg-accent/15 grid place-items-center">
                <Award className="h-4 w-4 text-accent" />
              </div>
              <div className="text-xs leading-tight">
                <div className="font-semibold text-ink">D-30 Honoree 2025</div>
                <div className="text-text/55">Global disability impact list</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Mission · Vision · Values */}
      <section className="py-24 relative overflow-hidden bg-primary-pale/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl float-slow" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/15 blur-3xl float-slower" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="What Guides Us" title="Mission, vision &amp; values" align="center" />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: Target,
                title: "Mission",
                text: "To empower people with disabilities in Nepal through inclusive sports, arts, education, and mobility.",
                color: "#5B2C86",
              },
              {
                icon: Eye,
                title: "Vision",
                text: "A Nepal where every person — regardless of ability — belongs, contributes, and thrives.",
                color: "#D9732B",
              },
              {
                icon: HeartHandshake,
                title: "Values",
                text: "Dignity, accessibility, joy, community, and unwavering advocacy.",
                color: "#2D7A4F",
              },
            ].map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 0.1}>
                <div className="relative h-full rounded-3xl bg-white p-7 soft-shadow overflow-hidden">
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ background: `linear-gradient(90deg, ${c.color}, #D9732B)` }}
                  />
                  <div className="w-14 h-14 rounded-2xl grid place-items-center bg-primary-pale text-primary mb-4">
                    <c.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-2 text-ink">{c.title}</h3>
                  <p className="text-text/75 leading-relaxed">{c.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Our Journey"
          title="Milestones"
          subtitle="A short timeline of the moments that shaped us."
          align="center"
        />
        <div className="relative mt-14">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-accent/40 to-primary/40 hidden md:block" />
          <div className="space-y-10">
            {milestones.map((m, i) => (
              <ScrollReveal key={m.year} delay={i * 0.05}>
                <div className={`md:flex items-center gap-8 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                  <div className="flex-1 md:text-right">
                    <div className="rounded-2xl bg-white border border-border p-6 soft-shadow">
                      <div className="text-accent text-sm font-mono-stat font-semibold">{m.year}</div>
                      <h3 className="font-display text-xl font-semibold mt-1">{m.title}</h3>
                      <p className="text-text/75 text-sm mt-2">{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:grid place-items-center w-10 h-10 rounded-full bg-white ring-4 ring-accent-light shrink-0">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                  </div>
                  <div className="flex-1" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gradient-to-b from-primary-pale/40 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Our People"
            title="Board &amp; team"
            subtitle="A small team with deep roots in Nepal's disability community."
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {team.map((p, i) => (
              <motion.div key={p.name} variants={itemVariants}>
                <PersonCard {...p} photo={teamPhotos[i % teamPhotos.length]} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
