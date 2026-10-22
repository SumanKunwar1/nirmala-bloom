import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useContent } from "@/lib/admin/context";

/** "Get involved" — the ways someone can help, as a simple row of options. */
export function NewsletterStrip() {
  const { getInvolved } = useContent();
  if (getInvolved.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-sand">
      <div className="shell">
        <SectionHeading
          align="center"
          eyebrow="Get involved"
          title={
            <>
              Find your way <span className="serif-em">to help.</span>
            </>
          }
          subtitle="There are many ways to break barriers with us — pick the one that fits you."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {getInvolved.map((w, i) => (
            <motion.div
              key={w.id ?? w.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={w.title.toLowerCase().includes("donate") ? "/donate" : "/contact"}
                className="group flex h-full flex-col rounded-[1.5rem] bg-background border border-border p-7 transition-all hover:bg-white hover:soft-shadow-lg hover:-translate-y-1"
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl border border-border"
                  aria-hidden
                >
                  {w.icon}
                </span>
                <h3 className="mt-8 font-display text-2xl">{w.title}</h3>
                <p className="mt-3 flex-1 text-text/70 leading-relaxed text-[15px]">{w.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {w.cta}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
