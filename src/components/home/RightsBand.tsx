import { motion } from "framer-motion";
import { Accessibility, GraduationCap, HeartPulse } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const values = [
  {
    icon: Accessibility,
    label: "Mobility",
    text: "Mobility issues can keep qualified people from reaching opportunity. We provide wheelchairs, assistive devices and inclusive access.",
  },
  {
    icon: GraduationCap,
    label: "Education",
    text: "Learning that suits everyone — built around Visual, Auditory and Kinesthetic styles so no child is left behind.",
  },
  {
    icon: HeartPulse,
    label: "Health",
    text: "We dream of a society that is mentally, physically and socially well — reaching rural communities with care and dignity.",
  },
];

export function RightsBand() {
  return (
    <section className="relative py-24 md:py-28 bg-muted/50 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Our Focus"
          title="Three ways we break barriers"
          subtitle="Every program we run flows from three intersecting commitments — because inclusion is a right, not a favour."
        />

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center px-4"
            >
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-white mb-6 shadow-[0_16px_36px_-14px_rgba(91,44,134,0.6)]">
                <v.icon className="h-9 w-9" />
              </span>
              <h3 className="font-display text-xl font-bold text-ink mb-3">{v.label}</h3>
              <p className="text-text/75 leading-relaxed text-[15px] max-w-xs mx-auto">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
