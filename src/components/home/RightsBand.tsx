import { motion } from "framer-motion";

const statements = [
  "The right to live with dignity in a community of one's choosing.",
  "The right to take part in every aspect of life — school, sport, work and play.",
  "The right to make our own decisions about our own lives.",
];

export function RightsBand() {
  return (
    <section className="relative py-20 md:py-24 bg-muted/60 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-accent">What we stand for</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
            Inclusion is a right, not a favour.
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8">
          {statements.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-5 border-l-2 border-accent/60"
            >
              <div className="font-mono-stat text-sm font-bold text-accent mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="font-display text-xl md:text-2xl text-ink leading-snug">{s}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
