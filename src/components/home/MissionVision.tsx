import { motion } from "framer-motion";
import { HeartHandshake, Sparkles, Users } from "lucide-react";

const values = [
  { icon: HeartHandshake, label: "Dignity", text: "Every person, every ability — treated with respect." },
  { icon: Users, label: "Inclusion", text: "Built into every programme, not added as an afterthought." },
  { icon: Sparkles, label: "Joy", text: "Belonging that feels alive, celebrated and shared." },
];

export function MissionVision() {
  return (
    <section className="relative py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="eyebrow mb-5">Our Mission</div>
        <h2 className="font-display text-3xl md:text-[2.75rem] md:leading-[1.15] font-bold text-ink">
          Empowering communities, breaking barriers, inspiring futures.
        </h2>
        <p className="mt-6 text-lg md:text-xl text-text/75 leading-relaxed">
          At Nirmala Foundation we strive to break barriers and promote inclusion, ensuring equal
          opportunities for all. Through inclusive sport, the arts, education and mobility — and
          shaped by people with lived experience — we build a Nepal where everyone can take part,
          contribute and thrive.
        </p>
      </div>

      {/* Our Values — icon row */}
      <div className="mx-auto max-w-5xl px-6 mt-16 md:mt-20">
        <div className="text-center mb-10">
          <div className="eyebrow">Our Values</div>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 md:gap-10">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-light text-accent mb-5">
                <v.icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-lg font-bold text-ink mb-2">{v.label}</h3>
              <p className="text-text/70 text-[15px] leading-relaxed max-w-xs mx-auto">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
