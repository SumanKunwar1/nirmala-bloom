import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProgramCard } from "@/components/shared/ProgramCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { programImages } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProgramsGrid() {
  const { programs: all } = useContent();
  const programs = all.filter((p) => p.published !== false);
  const [active, setActive] = useState(0);

  if (programs.length === 0) return null;
  const current = programs[Math.min(active, programs.length - 1)];

  return (
    <section className="py-24 md:py-32 bg-sand">
      <div className="shell">
        <SectionHeading
          align="left"
          eyebrow="Our work"
          title={
            <>
              {programs.length} pathways to <span className="serif-em">inclusion.</span>
            </>
          }
          subtitle="From the basketball court to the classroom and the Himalayan trail — programmes designed with, not for, Nepalis with disabilities."
          action={
            <Link to="/programs" className="btn-pill btn-outline">
              See all our work <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        {/* Desktop — interactive index with a live preview */}
        <div className="hidden lg:grid grid-cols-12 gap-12">
          <ol className="col-span-7 border-t border-ink/15">
            {programs.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.slug} className="border-b border-ink/15">
                  <Link
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-6"
                  >
                    <span
                      className={`font-mono-stat text-sm transition-colors ${on ? "text-accent-ink" : "text-text/40"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span
                        className={`block font-display text-[2rem] leading-tight tracking-[-0.02em] transition-colors duration-300 ${
                          on ? "text-ink" : "text-ink/45"
                        }`}
                      >
                        {p.title}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-2 text-text/70 max-w-lg">{p.desc}</span>
                        </span>
                      </span>
                    </span>
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-full border transition-all duration-300 ${
                        on ? "bg-ink border-ink text-white" : "border-ink/20 text-ink/50"
                      }`}
                    >
                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="col-span-5">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-plum">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={current.slug}
                    src={current.image || programImages[current.slug]}
                    alt=""
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-plum/90 via-plum/10 to-transparent" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-x-0 bottom-0 p-8 text-white"
                  >
                    {current.tagline && (
                      <p className="font-display text-2xl italic leading-snug">
                        &ldquo;{current.tagline}&rdquo;
                      </p>
                    )}
                    {current.highlights?.length > 0 && (
                      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-5">
                        {current.highlights.slice(0, 3).map((h) => (
                          <div key={h.label}>
                            <dt className="sr-only">{h.label}</dt>
                            <dd className="font-display text-2xl leading-none">{h.value}</dd>
                            <dd className="mt-1.5 text-xs text-white/65">{h.label}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & tablet — cards */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-5">
          {programs.map((p, i) => (
            <ProgramCard key={p.slug} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
