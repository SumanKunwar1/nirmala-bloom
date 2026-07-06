import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { programs } from "@/lib/constants";
import { ProgramCard } from "@/components/shared/ProgramCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { containerVariants, itemVariants } from "@/components/shared/ScrollReveal";

export function ProgramsGrid() {
  return (
    <section className="py-24 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Our Work"
          title="Pathways to inclusion"
          subtitle="Six interconnected programs — from the basketball court to the classroom and beyond — that turn ability into opportunity."
        />
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
        <div className="mt-12 text-center">
          <Link to="/programs" className="btn-pill btn-outline">
            View All Programs <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
