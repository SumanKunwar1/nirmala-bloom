import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function FloatingDonateButton() {
  const { location } = useRouterState();
  if (location.pathname.startsWith("/donate")) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
      className="fixed bottom-6 right-6 z-40">
      <Link to="/donate" className="group relative flex items-center gap-2 bg-accent text-white pl-5 pr-6 py-4 rounded-full shadow-2xl shadow-orange-300 font-semibold">
        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-40" aria-hidden />
        <span className="relative">💛</span>
        <span className="relative max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[180px] transition-all duration-300">
          <span className="ml-2">Support Our Work</span>
        </span>
      </Link>
    </motion.div>
  );
}
