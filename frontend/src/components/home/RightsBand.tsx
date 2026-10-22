import { motion } from "framer-motion";
import { Accessibility, GraduationCap, HeartPulse } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const focus = [
  {
    icon: Accessibility,
    label: "Mobility",
    text: "Mobility issues keep qualified people from reaching opportunity. We provide wheelchairs, assistive devices and push for inclusive access.",
  },
  {
    icon: GraduationCap,
    label: "Education",
    text: "Learning that suits everyone — built around visual, auditory and kinaesthetic styles so no child is left behind.",
  },
  {
    icon: HeartPulse,
    label: "Health",
    text: "A society that is mentally, physically and socially well — reaching rural communities with care and dignity.",
  },
];

export function RightsBand() {
  return (
    <section className="aurora-deep grain py-24 md:py-32 text-white">
      <div className="shell relative">
        <SectionHeading
          align="left"
          light
          eyebrow="Our focus"
          title={
            <>
              Three ways we <span className="serif-em on-dark">break barriers.</span>
            </>
          }
          subtitle="Every programme flows from three intersecting commitments — because inclusion is a right, not a favour."
        />

        <div className="grid md:grid-cols-3 gap-px rounded-[1.75rem] overflow-hidden bg-white/10">
          {focus.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-plum p-8 md:p-10 transition-colors hover:bg-[#251a36]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.07] text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <v.icon className="h-6 w-6" />
                </span>
                <span className="font-mono-stat text-sm text-white/35">0{i + 1}</span>
              </div>
              <h3 className="mt-10 font-display text-3xl !text-white">{v.label}</h3>
              <p className="mt-4 text-white/65 leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
