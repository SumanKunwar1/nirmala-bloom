import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { programs, newsPosts } from "@/lib/constants";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/", "/about", "/programs", "/news", "/gallery", "/resources", "/donate", "/partners", "/contact",
          ...programs.map((p) => `/programs/${p.slug}`),
          ...newsPosts.map((p) => `/news/${p.slug}`),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
