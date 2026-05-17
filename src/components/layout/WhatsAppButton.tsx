import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "9779800000000"; // update with the foundation's real number
const PRESET_MESSAGE = "Namaste! I'd like to learn more about Nirmala Foundation Nepal.";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRESET_MESSAGE)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.9, type: "spring", stiffness: 220, damping: 18 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.65)] hover:shadow-[0_18px_40px_-8px_rgba(37,211,102,0.8)] transition-shadow"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: "#25D366" }}
          aria-hidden
        />
        {/* WhatsApp glyph */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="relative w-7 h-7" aria-hidden>
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.595 5.327l.95-3.469-3.456 1.443zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Tooltip on hover (desktop only) */}
        <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-ink text-white text-xs font-medium px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Chat with us
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-ink rotate-45" />
        </span>
      </a>
    </motion.div>
  );
}
