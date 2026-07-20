import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { NewsCard } from "@/components/shared/NewsCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { containerVariants, itemVariants } from "@/components/shared/ScrollReveal";
import { useContent } from "@/lib/admin/context";

const COLORS = ["#6B2FA0", "#F97316", "#2D7A4F", "#9B5DD5", "#E11D48", "#0891B2"];

export function NewsPreview() {
  const { stories } = useContent();
  const recent = stories.filter((s) => s.published !== false).slice(0, 3);
  return (
    <section className="py-24 md:py-28 bg-gradient-to-b from-white to-primary-pale/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Latest Stories"
          title="News from the field"
          subtitle="Voices, victories, and quiet moments from across our programs."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {recent.map((p, i) => (
            <motion.div key={p.slug} variants={itemVariants}>
              <NewsCard {...p} color={COLORS[i % COLORS.length]} />
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-12 text-center">
          <Link to="/news" className="btn-pill btn-outline">
            All News <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
