import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";

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

  const socials = [
    { Icon: Facebook, label: `${name} on Facebook` },
    { Icon: Twitter, label: `${name} on Twitter` },
    { Icon: Instagram, label: `${name} on Instagram` },
  ];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col rounded-2xl bg-card border border-border overflow-hidden soft-shadow hover:soft-shadow-lg"
    >
      {/* Photo */}
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
            style={{ background: "linear-gradient(135deg, #5B2C86, #D9732B)" }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="flex flex-col grow bg-primary-pale/30 px-5 pb-6">
        {/* Social bar — square buttons sitting at the photo seam */}
        <div className="-mt-5 mb-4 flex gap-2">
          {socials.map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white soft-shadow transition-colors hover:bg-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <h3 className="font-display text-lg font-semibold text-ink leading-tight text-center">{name}</h3>
        <div className="text-accent text-sm font-medium mt-1 text-center">{role}</div>
        {bio && <p className="text-text/65 text-sm leading-relaxed mt-3 text-center">{bio}</p>}
      </div>
    </motion.div>
  );
}
