import { motion } from "framer-motion";
import { Target, Eye, HeartHandshake } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Our mission",
    text: "To empower people with disabilities in Nepal through inclusive sport, the arts, education and mobility — removing the barriers that keep them from full participation.",
  },
  {
    icon: Eye,
    title: "Our vision",
    text: "A Nepal where every person — regardless of ability — belongs, contributes and thrives, with their rights and dignity upheld in every community.",
  },
  {
    icon: HeartHandshake,
    title: "Our values",
    text: "Dignity, accessibility, joy and lived experience guide every decision. The people we serve help shape the work we do.",
  },
];

export function MissionVision() {
  return (
    <section className="relative py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-accent">What guides us</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight">
            A human-rights approach, shaped by lived experience.
          </h2>
          <p className="mt-5 text-lg text-text/80 leading-relaxed">
            We don&apos;t decide what inclusion should look like from the outside. The people we
            serve sit at the centre of every programme we run.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full rounded-3xl bg-card border border-border p-8 soft-shadow lift"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-pale text-primary mb-5">
                <p.icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-2xl font-semibold text-ink mb-3">{p.title}</h3>
              <p className="text-text/80 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
