import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout route for /news — renders only an <Outlet /> so the listing (index)
 * and each article ($slug) render as their own standalone page.
 */
export const Route = createFileRoute("/news")({
  component: NewsLayout,
});

function NewsLayout() {
  return <Outlet />;
}
