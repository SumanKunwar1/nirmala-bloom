import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHero } from "@/components/shared/PageHero";
import { galleryImages, imgs } from "@/lib/images";
import { useContent, type GalleryAlbum } from "@/lib/admin/context";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Nirmala Foundation" },
      { name: "description", content: "Photos and videos from Nirmala Foundation programs." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { galleryAlbums } = useContent();
  const [active, setActive] = useState<GalleryAlbum | null>(null);
  const [filter, setFilter] = useState<"All" | "Photos" | "Videos">("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const activePhotos =
    active && active.images.length ? active.images : active ? [active.cover || galleryImages[active.slug]] : [];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments of belonging."
        subtitle="Snapshots from courts, classrooms, retreats, and rural camps — moments where inclusion came alive."
        breadcrumb="Gallery"
        image={imgs.pageGallery}
        imageAlt="Photos and stories of the Nirmala community"
      />

      <section className="py-20 mx-auto max-w-7xl px-6">
        <div className="flex gap-2 mb-10 flex-wrap">
          {(["All", "Photos", "Videos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === t ? "bg-primary text-white" : "bg-primary-pale text-primary hover:bg-primary/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {!active ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryAlbums.map((a) => (
              <motion.button
                key={a.slug}
                whileHover={{ y: -6 }}
                transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActive(a)}
                className="group rounded-3xl overflow-hidden text-left bg-white border border-border soft-shadow hover:soft-shadow-lg"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={a.cover || galleryImages[a.slug]}
                    alt={a.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-lg font-semibold leading-tight">{a.title}</h3>
                    <div className="text-xs text-white/75 mt-1">{a.images.length} items</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setActive(null)} className="text-primary text-sm mb-6 hover:underline underline-offset-4">
              ← All albums
            </button>
            <h2 className="font-display text-3xl font-semibold mb-6">{active.title}</h2>
            {activePhotos.length === 0 ? (
              <p className="text-text/55">No photos in this album yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {activePhotos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className="photo-frame aspect-square overflow-hidden group"
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <AnimatePresence>
        {lightbox !== null && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-black/90 grid place-items-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white text-2xl" aria-label="Close">
              ×
            </button>
            <button
              className="absolute left-6 text-white text-3xl"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => Math.max(0, (p ?? 0) - 1));
              }}
            >
              ‹
            </button>
            <button
              className="absolute right-6 text-white text-3xl"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => Math.min(activePhotos.length - 1, (p ?? 0) + 1));
              }}
            >
              ›
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={activePhotos[lightbox] ?? active.cover}
              alt=""
              className="max-h-[80vh] max-w-4xl rounded-2xl object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
