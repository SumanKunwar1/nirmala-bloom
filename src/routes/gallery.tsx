import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHero } from "@/components/shared/PageHero";
import { galleryAlbums } from "@/lib/constants";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [
    { title: "Gallery — Nirmala Foundation" },
    { name: "description", content: "Photos and videos from Nirmala Foundation programs." },
  ]}),
  component: GalleryPage,
});

function GalleryPage() {
  const [active, setActive] = useState<typeof galleryAlbums[number] | null>(null);
  const [filter, setFilter] = useState<"All" | "Photos" | "Videos">("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <PageHero title="Gallery" subtitle="Moments of belonging." breadcrumb="Gallery" />
      <section className="py-16 mx-auto max-w-7xl px-6">
        <div className="flex gap-2 mb-10">
          {(["All", "Photos", "Videos"] as const).map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${filter === t ? "bg-primary text-white" : "bg-primary-pale text-primary"}`}>
              {t}
            </button>
          ))}
        </div>

        {!active ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryAlbums.map((a) => (
              <motion.button key={a.slug} whileHover={{ y: -6 }} onClick={() => setActive(a)}
                className="rounded-2xl overflow-hidden text-left bg-white border border-border shadow-sm hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] grain" style={{ background: `linear-gradient(135deg, ${a.color}, #F97316)` }} />
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                  <div className="text-sm text-text/60">{a.count} items</div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setActive(null)} className="text-primary text-sm mb-6">← All albums</button>
            <h2 className="font-display text-3xl font-semibold mb-6">{active.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <button key={i} onClick={() => setLightbox(i)} className="aspect-square rounded-xl grain hover:scale-105 transition-transform"
                  style={{ background: `linear-gradient(${45 + i * 25}deg, ${active.color}, #F97316)` }} aria-label={`Photo ${i + 1}`} />
              ))}
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {lightbox !== null && active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/90 grid place-items-center p-6" onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-6 text-white text-2xl" aria-label="Close">×</button>
            <button className="absolute left-6 text-white text-3xl" onClick={(e) => { e.stopPropagation(); setLightbox((p) => Math.max(0, (p ?? 0) - 1)); }}>‹</button>
            <button className="absolute right-6 text-white text-3xl" onClick={(e) => { e.stopPropagation(); setLightbox((p) => Math.min(11, (p ?? 0) + 1)); }}>›</button>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="aspect-[4/3] w-full max-w-4xl rounded-2xl grain"
              style={{ background: `linear-gradient(135deg, ${active.color}, #F97316)` }} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
