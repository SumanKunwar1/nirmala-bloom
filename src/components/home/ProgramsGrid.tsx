import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { programs } from "@/lib/constants";
import { ProgramCard } from "@/components/shared/ProgramCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { containerVariants, itemVariants } from "@/components/shared/ScrollReveal";

export function ProgramsGrid() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <SectionHeading
            eyebrow="What We Do"
            title="Programs that build belonging"
            subtitle="Six interconnected pathways to inclusion — from the basketball court to the classroom and beyond."
          />
          <Link
            to="/programs"
            className="text-primary font-medium text-sm hover:underline underline-offset-4 hidden md:inline-block"
          >
            View all programs →
          </Link>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {programs.map((p) => (
            <motion.div key={p.slug} variants={itemVariants}>
              <ProgramCard {...p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
