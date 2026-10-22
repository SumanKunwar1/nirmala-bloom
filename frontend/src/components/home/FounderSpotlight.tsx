import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Award, ArrowRight } from "lucide-react";
import { imgs } from "@/lib/images";
import { useContent } from "@/lib/admin/context";

const ease = [0.22, 1, 0.36, 1] as const;

export function FounderSpotlight() {
  const { about } = useContent();
  const honours = about.founderHonours.slice(0, 3);

  return (
    <section className="py-24 md:py-32">
      <div className="shell grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-6 relative"
        >
          <div className="photo-frame aspect-[4/5] rounded-[2rem]">
            <img
              src={about.founderImage || imgs.founderAbout}
              alt={`${about.founderName}, founder of the Nirmala Foundation`}
              loading="lazy"
              className="object-top"
            />
          </div>
          <div className="absolute -bottom-6 right-4 sm:right-8 inline-flex items-center gap-3 rounded-full bg-white pl-2 pr-5 py-2 soft-shadow-lg">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white">
              <Award className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-ink">
              D-30 Disability Impact List · 2025
            </span>
          </div>
        </motion.div>

        <div className="lg:col-span-6">
          <div className="eyebrow mb-6">Meet our founder</div>
          <blockquote className="display-3 !leading-[1.25] text-ink">
            &ldquo;We don&apos;t ask for permission to belong. We build belonging —{" "}
            <span className="serif-em">every day, in every community.</span>&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-10 bg-ink/30" />
            <div>
              <div className="font-semibold text-ink">{about.founderName}</div>
              <div className="text-sm text-text/60">{about.founderRole}</div>
            </div>
          </div>

          <p className="mt-8 text-lg text-text/75 leading-relaxed">
            A woman with a disability who turned her own journey — from a Hope Centre resident to a
            national para-athlete — into a movement, so that no Nepali with a disability has to
            fight alone for the chance to belong.
          </p>

          {honours.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {honours.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/80"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          <Link to="/about" className="btn-pill btn-dark mt-10">
            Read {about.founderName.split(" ")[0]}&apos;s story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
