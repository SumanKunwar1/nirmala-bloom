import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { socialLinks } from "@/lib/constants";

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
    { Icon: Facebook, label: "Nirmala Foundation on Facebook", href: socialLinks.facebook },
    { Icon: Instagram, label: "Nirmala Foundation on Instagram", href: socialLinks.instagram },
    { Icon: Youtube, label: "Nirmala Foundation on YouTube", href: socialLinks.youtube },
    { Icon: Linkedin, label: "Nirmala Foundation on LinkedIn", href: socialLinks.linkedin },
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

      {/* Info — fully centered */}
      <div className="flex flex-col grow items-center text-center px-5 pt-6 pb-5">
        <h3 className="font-display text-lg font-semibold text-ink leading-tight">{name}</h3>
        <div className="text-accent text-sm font-medium mt-1">{role}</div>
        {bio && <p className="text-text/65 text-sm leading-relaxed mt-3">{bio}</p>}

        {/* Social row — pinned to bottom, divider keeps all cards aligned */}
        <div className="mt-auto w-full pt-6">
          <div className="border-t border-border pt-5 flex justify-center gap-2.5">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-primary hover:text-white hover:border-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
