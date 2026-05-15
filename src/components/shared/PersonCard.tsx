import { motion } from "framer-motion";

export function PersonCard({ name, role, bio }: { name: string; role: string; bio: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-2xl bg-white border border-border p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
      <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-display font-bold text-white"
        style={{ background: "linear-gradient(135deg, #6B2FA0, #F97316)" }}>
        {initials}
      </div>
      <h3 className="font-display text-lg font-semibold">{name}</h3>
      <div className="text-accent text-sm font-medium mb-3">{role}</div>
      <p className="text-text/75 text-sm leading-relaxed">{bio}</p>
    </motion.div>
  );
}
