import { motion } from "framer-motion";

export function PersonCard({
  name,
  role,
  bio,
  photo,
}: {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-3xl bg-white border border-border overflow-hidden soft-shadow hover:soft-shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-pale">
        {photo ? (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center text-4xl font-display font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6B2FA0, #F97316)" }}
          >
            {initials}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-display text-lg font-semibold leading-tight">{name}</h3>
          <div className="text-accent-light text-xs font-medium mt-0.5">{role}</div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-text/75 text-sm leading-relaxed">{bio}</p>
      </div>
    </motion.div>
  );
}
