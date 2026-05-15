import { motion } from "framer-motion";
import { programs } from "@/lib/constants";
import { ProgramCard } from "@/components/shared/ProgramCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { containerVariants, itemVariants } from "@/components/shared/ScrollReveal";

export function ProgramsGrid() {
  return (
    <section className="py-24 mx-auto max-w-7xl px-6">
      <SectionHeading eyebrow="What We Do" title="Programs that build belonging"
        subtitle="Six interconnected pathways to inclusion — from the basketball court to the classroom and beyond." />
      <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p) => (
          <motion.div key={p.slug} variants={itemVariants}>
            <ProgramCard {...p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
