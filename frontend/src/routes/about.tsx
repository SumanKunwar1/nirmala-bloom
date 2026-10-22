import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ArrowRight, Heart } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PersonCard } from "@/components/shared/PersonCard";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { imgs, teamPhotos } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nirmala Foundation Nepal" },
      {
        name: "description",
        content:
          "Founded by para-athlete Nirmala Bhandari, advancing disability inclusion across Nepal.",
      },
      { property: "og:title", content: "About Nirmala Foundation" },
    ],
  }),
  component: About,
});

function About() {
  const { about, team, milestones } = useContent();

  const pillars = [
    { label: "Mission", text: about.mission },
    { label: "Vision", text: about.vision },
    { label: "Values", text: about.values },
  ];

  return (
    <>
      <PageHero
        eyebrow="About us"
        breadcrumb="About"
        title={about.heroTitle || "Building belonging across Nepal."}
        subtitle={about.heroSubtitle}
        image={imgs.pageAbout}
        imageAlt="Smiling people from the Nirmala Foundation community"
      >
        <Link to="/programs" className="btn-pill btn-dark">
          See our work <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      {/* Mission · Vision · Values */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-14 md:mb-20">
            <div className="lg:col-span-4">
              <div className="eyebrow">What guides us</div>
            </div>
            <h2 className="lg:col-span-8 display-2">
              Inclusion isn't a programme we run.{" "}
              <span className="serif-em">It's how we run everything.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 border-t border-ink/15">
            {pillars.map((c, i) => (
              <ScrollReveal
                key={c.label}
                delay={i * 0.08}
                className={`py-10 md:pr-10 ${i > 0 ? "border-t md:border-t-0 md:border-l border-ink/15 md:pl-10" : ""}`}
              >
                <span className="font-mono-stat text-sm text-accent-ink">0{i + 1}</span>
                <h3 className="mt-4 font-display text-3xl">{c.label}</h3>
                <p className="mt-4 text-lg text-text/75 leading-relaxed">{c.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="shell grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="photo-frame aspect-[4/5] rounded-[2rem]">
                <img
                  src={about.founderImage || imgs.founderAbout}
                  alt={`${about.founderName}, founder of the Nirmala Foundation`}
                  className="object-top"
                />
              </div>
              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-2xl text-ink">{about.founderName}</div>
                  <div className="text-sm text-text/60">{about.founderRole}</div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink">
                  <Award className="h-4 w-4 text-accent" /> D-30 Honoree 2025
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="eyebrow mb-5">Our founder</div>
            <h2 className="display-2">
              The woman behind <span className="serif-em">the foundation.</span>
            </h2>
            <div
              className="rte-render rte-lead mt-10 text-lg leading-[1.8] text-text/80"
              dangerouslySetInnerHTML={{ __html: about.founderStory }}
            />
            {about.founderHonours.length > 0 && (
              <div className="mt-12">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text/50 mb-4">
                  Honours
                </div>
                <ul className="border-t border-ink/15">
                  {about.founderHonours.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-4 py-4 border-b border-ink/10 text-ink"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Milestones */}
      {milestones.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="shell">
            <SectionHeading
              align="left"
              eyebrow="Our journey"
              title={
                <>
                  Milestones <span className="serif-em">so far.</span>
                </>
              }
              subtitle="A short timeline of the moments that shaped us."
            />
            <ol className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {milestones.map((m, i) => (
                <li key={m.id ?? m.year} className="border-t border-ink/15 pt-6 pb-10">
                  <ScrollReveal delay={(i % 3) * 0.06}>
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
                      <span className="font-mono-stat text-sm text-accent-ink">{m.year}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl">{m.title}</h3>
                    <p className="mt-2 text-text/70 leading-relaxed">{m.desc}</p>
                  </ScrollReveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="py-24 md:py-32 border-t border-border">
          <div className="shell">
            <SectionHeading
              align="left"
              eyebrow="Our people"
              title={
                <>
                  Board <span className="serif-em">&amp; team.</span>
                </>
              }
              subtitle="A small team with deep roots in Nepal's disability community."
              action={
                <Link to="/contact" className="btn-pill btn-outline">
                  Join the team <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {team.map((p, i) => (
                <ScrollReveal key={p.id ?? p.name} delay={(i % 4) * 0.06}>
                  <PersonCard {...p} photo={p.photo || teamPhotos[i % teamPhotos.length]} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing */}
      <section className="pb-24 md:pb-32">
        <div className="shell">
          <div className="rounded-[2rem] bg-sand p-10 md:p-16 grid lg:grid-cols-12 gap-8 items-center">
            <h2 className="lg:col-span-8 display-3">
              Want to build belonging with us? Every gift, hour and partnership counts.
            </h2>
            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
              <Link to="/donate" className="btn-pill btn-accent">
                <Heart className="h-4 w-4" fill="currentColor" /> Donate
              </Link>
              <Link to="/contact" className="btn-pill btn-outline">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
