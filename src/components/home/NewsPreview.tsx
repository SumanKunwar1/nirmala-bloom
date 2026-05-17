import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { newsPosts, programs } from "@/lib/constants";
import { NewsCard } from "@/components/shared/NewsCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { containerVariants, itemVariants } from "@/components/shared/ScrollReveal";

export function NewsPreview() {
  const recent = newsPosts.slice(0, 3);
  return (
    <section className="py-24 bg-gradient-to-b from-white to-primary-pale/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <SectionHeading
            eyebrow="Latest Stories"
            title="News from the field"
            subtitle="Voices, victories, and quiet moments from across our programs."
          />
          <Link to="/news" className="text-primary font-medium hover:underline underline-offset-4">
            All news →
          </Link>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {recent.map((p, i) => (
            <motion.div key={p.slug} variants={itemVariants}>
              <NewsCard {...p} color={programs[i % programs.length].color} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
