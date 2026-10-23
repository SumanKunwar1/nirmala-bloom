import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { NewsCard } from "@/components/shared/NewsCard";
import { imgs } from "@/lib/images";
import { http, type ListMeta } from "@/lib/api";
import type { Story } from "@/lib/admin/context";

/** Cards per page — matches the 3-column grid (3 rows). */
const PAGE_SIZE = 9;

const COLORS = ["#6B2FA0", "#F97316", "#2D7A4F", "#9B5DD5", "#E11D48", "#0891B2"];

type Search = { page?: number; category?: string };

export const Route = createFileRoute("/news/")({
  // Page and category live in the URL so a filtered page is shareable and
  // the browser's back button steps through the pager.
  validateSearch: (search: Record<string, unknown>): Search => {
    const page = Number(search.page);
    const category = typeof search.category === "string" ? search.category : undefined;
    return {
      page: Number.isFinite(page) && page > 1 ? Math.floor(page) : undefined,
      category: category && category !== "All" ? category : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "News & Stories | Nirmala Foundation" },
      {
        name: "description",
        content: "Stories, press, and updates from Nirmala Foundation Nepal.",
      },
    ],
  }),
  component: NewsPage,
});

type Facet = { value: string; count: number };

function NewsPage() {
  const { page = 1, category } = useSearch({ from: "/news/" });
  const navigate = useNavigate({ from: "/news/" });

  const [stories, setStories] = useState<Story[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [facets, setFacets] = useState<Facet[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  /* Filter tabs come from the data, so a category an admin invents appears
     here on its own instead of needing a code change. */
  useEffect(() => {
    let alive = true;
    http
      .get<{ total: number; values: Facet[] }>("/stories/categories", { auth: false })
      .then((d) => {
        if (!alive) return;
        setFacets(d.values);
        setTotal(d.total);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /* One page of stories, straight from the API. */
  useEffect(() => {
    let alive = true;
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      sort: "order createdAt",
    });
    if (category) params.set("category", category);

    http
      .list<Story>(`/stories?${params}`, { auth: false })
      .then((res) => {
        if (!alive) return;
        setStories(res.items);
        setMeta(res.meta);
        setError(null);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "Could not load stories.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [page, category]);

  /* Bring the grid into view when paging — but not on the initial load,
     which would yank the visitor past the hero. */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, category]);

  const setPage = (next: number) =>
    navigate({ search: (prev) => ({ ...prev, page: next > 1 ? next : undefined }) });

  /** Changing the filter always returns to page 1. */
  const setCategory = (next: string | undefined) =>
    navigate({ search: { category: next, page: undefined } });

  const pages = meta?.pages ?? 1;
  const activeCategory = category ?? "All";

  return (
    <>
      <PageHero
        eyebrow="News & Stories"
        title="From the courts, classrooms & communities."
        subtitle="Press features, programme updates, and quiet stories of belonging from across Nepal."
        breadcrumb="News"
        image={imgs.pageNews}
        imageAlt="Field stories from Nirmala Foundation"
      />

      <section className="py-20 shell">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <FilterTab
            label="All"
            count={total}
            active={activeCategory === "All"}
            onClick={() => setCategory(undefined)}
          />
          {facets.map((f) => (
            <FilterTab
              key={f.value}
              label={f.value}
              count={f.count}
              active={activeCategory === f.value}
              onClick={() => setCategory(f.value)}
            />
          ))}
        </div>

        <div ref={gridRef} className="scroll-mt-28">
          {error ? (
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 px-5 py-8 text-center text-sm text-destructive">
              {error}
            </div>
          ) : loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: Math.min(PAGE_SIZE, 6) }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white/60 px-6 py-16 text-center">
              <p className="font-display text-xl text-ink">Nothing here yet.</p>
              <p className="mt-2 text-sm text-text/65">
                {category
                  ? `No stories filed under “${category}” so far.`
                  : "New stories will appear here as they're published."}
              </p>
              {category && (
                <button
                  onClick={() => setCategory(undefined)}
                  className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Show all stories
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((p, i) => (
                <NewsCard key={p.slug} {...p} color={COLORS[i % COLORS.length]} />
              ))}
            </div>
          )}
        </div>

        {/* Real pager — only rendered when there is more than one page. */}
        {!loading && !error && pages > 1 && <Pager page={page} pages={pages} onChange={setPage} />}

        {meta && meta.total > 0 && !loading && (
          <p className="mt-6 text-center text-sm text-text/55">
            Showing{" "}
            <strong className="text-ink">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, meta.total)}
            </strong>{" "}
            of <strong className="text-ink">{meta.total}</strong>
            {category ? ` in ${category}` : " stories"}
          </p>
        )}
      </section>
    </>
  );
}

/* ------------------------------ Pieces ------------------------------ */

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-primary text-white" : "bg-primary-pale text-primary hover:bg-primary/10"
      }`}
    >
      {label}
      <span className={`text-xs font-mono-stat ${active ? "text-white/70" : "text-primary/55"}`}>
        {count}
      </span>
    </button>
  );
}

/**
 * Numbered pager with ellipsis. Keeps first/last always reachable and shows a
 * window around the current page, so it stays usable at any story count.
 */
function Pager({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (n: number) => void;
}) {
  const numbers = pageWindow(page, pages);

  return (
    <nav className="mt-14 flex justify-center gap-2" aria-label="Pagination">
      <PagerBtn onClick={() => onChange(page - 1)} disabled={page <= 1} label="Previous page">
        ←
      </PagerBtn>

      {numbers.map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="grid h-10 w-10 place-items-center text-sm text-text/40">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            aria-label={`Page ${n}`}
            className={`h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
              n === page ? "bg-primary text-white" : "border border-border hover:bg-primary-pale"
            }`}
          >
            {n}
          </button>
        ),
      )}

      <PagerBtn onClick={() => onChange(page + 1)} disabled={page >= pages} label="Next page">
        →
      </PagerBtn>
    </nav>
  );
}

function PagerBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`h-10 w-10 rounded-full border border-border text-sm font-semibold transition-colors ${
        disabled ? "cursor-not-allowed opacity-35" : "hover:bg-primary-pale"
      }`}
    >
      {children}
    </button>
  );
}

/** [1, …, 4, 5, 6, …, 12] — first, last, and a window around the current page. */
function pageWindow(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);

  const out: (number | "…")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pages - 1, page + 1);

  if (from > 2) out.push("…");
  for (let n = from; n <= to; n += 1) out.push(n);
  if (to < pages - 1) out.push("…");
  out.push(pages);

  return out;
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
