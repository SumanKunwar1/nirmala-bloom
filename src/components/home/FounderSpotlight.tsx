import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Quote, Award, Trophy, Crown, ArrowRight } from "lucide-react";
import { imgs } from "@/lib/images";

const honours = [
  { icon: Trophy, label: "National wheelchair basketball player" },
  { icon: Award, label: "D-30 Disability Impact List, 2025" },
  { icon: Crown, label: "Miss Disability Queen · UN Women honoree" },
];

export function FounderSpotlight() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28 aurora-deep grain">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="eyebrow text-accent-light mb-4">Meet Our Founder</div>

        {/* Full-width hero image of Nirmala */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative photo-frame aspect-[16/10] md:aspect-[16/7]"
        >
          <img
            src={imgs.founderAbout}
            alt="Nirmala Bhandari, founder of the Nirmala Foundation"
            className="ken-burns object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight" style={{ color: "#fff" }}>
              Nirmala Bhandari
            </h2>
            <div className="text-white/85 text-sm md:text-base mt-1">Founder &amp; Executive Director · Para-athlete</div>
          </div>
        </motion.div>

        {/* Description underneath */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 grid lg:grid-cols-3 gap-10 lg:gap-14 text-white"
        >
          <div className="lg:col-span-2">
            <p className="text-lg md:text-xl text-white/85 leading-relaxed">
              A woman with a disability who turned her own journey — from a Hope Centre resident to a national
              para-athlete — into a movement. Nirmala founded this organisation so that no Nepali with a disability has
              to fight alone for the chance to belong.
            </p>

            <figure className="mt-8 border-l-4 border-accent pl-6">
              <Quote className="h-7 w-7 text-accent" />
              <blockquote
                className="mt-2 font-display font-semibold text-xl md:text-2xl leading-relaxed"
                style={{ color: "#fff" }}
              >
                We don&apos;t ask for permission to belong. We build belonging — every day, in every community.
              </blockquote>
              <figcaption className="mt-3 text-sm text-white/65">
                Nirmala Bhandari, Founder &amp; Executive Director
              </figcaption>
            </figure>

            <Link
              to="/about"
              className="group btn-pill mt-9 bg-white text-primary hover:bg-white"
            >
              Read Nirmala&apos;s Story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ul className="space-y-3">
            {honours.map((h) => (
              <li
                key={h.label}
                className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
                  <h.icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-white/90 leading-tight">{h.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
