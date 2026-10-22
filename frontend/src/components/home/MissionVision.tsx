import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { imgs } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

const values = [
  { label: "Dignity", text: "Every person, every ability — treated with respect, never pity." },
  {
    label: "Inclusion",
    text: "Built into every programme from day one, not added as an afterthought.",
  },
  {
    label: "Lived experience",
    text: "Led by people with disabilities, so the work answers real needs.",
  },
  {
    label: "Joy",
    text: "Belonging that feels alive — celebrated, shared and visible in public life.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function MissionVision() {
  const { about } = useContent();

  return (
    <section className="py-24 md:py-36">
      <div className="shell">
        {/* Statement */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="eyebrow">Our mission</div>
            <p className="mt-6 text-text/70 leading-relaxed max-w-sm">{about.mission}</p>
            <Link
              to="/about"
              className="group mt-6 inline-flex items-center gap-2 font-semibold text-ink"
            >
              <span className="link-draw">Read our story</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease }}
            className="lg:col-span-8 display-2 !leading-[1.12]"
          >
            We're building a Nepal where people with disabilities don't wait for a seat at the table
            — <span className="serif-em">they help set it.</span>
          </motion.h2>
        </div>

        {/* Image + values */}
        <div className="mt-16 md:mt-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease }}
            className="lg:col-span-5 relative"
          >
            <div className="photo-frame aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <img
                src={imgs.founderCommunity}
                alt="Members of the Nirmala Foundation community together"
                loading="lazy"
                className="ken-burns"
              />
            </div>
            <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-[300px] rounded-2xl bg-white/95 backdrop-blur p-5 soft-shadow-lg">
              <div className="font-display text-4xl text-ink leading-none">1 in 6</div>
              <p className="mt-2 text-sm text-text/70 leading-snug">
                people worldwide live with a disability. Inclusion isn't a niche — it's everyone's
                future.
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-baseline justify-between gap-4 pb-6 border-b border-ink/15">
              <h3 className="font-display text-2xl md:text-3xl">What guides us</h3>
              <span className="text-sm text-text/50">Our values</span>
            </div>
            <ol className="flex-1">
              {values.map((v, i) => (
                <motion.li
                  key={v.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="group grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_12rem_1fr] gap-x-4 gap-y-1 py-7 border-b border-border"
                >
                  <span className="font-mono-stat text-sm text-accent-ink pt-1.5">0{i + 1}</span>
                  <span className="font-display text-xl md:text-2xl text-ink transition-colors group-hover:text-primary">
                    {v.label}
                  </span>
                  <span className="col-start-2 sm:col-start-3 text-text/70 leading-relaxed">
                    {v.text}
                  </span>
                </motion.li>
              ))}
            </ol>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-sand p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text/50">
                  Vision
                </div>
                <p className="mt-3 text-ink leading-relaxed">{about.vision}</p>
              </div>
              <div className="rounded-2xl bg-primary text-white p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Our promise
                </div>
                <p className="mt-3 leading-relaxed text-white/90">
                  Nothing about us without us — every programme is co-designed with the people it
                  serves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
