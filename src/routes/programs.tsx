import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout route for /programs.
 * It only renders an <Outlet /> so that the index route (the listing) and the
 * $slug route (a full program details page) each render as their own page,
 * instead of the detail page trying to render inside the listing.
 */
export const Route = createFileRoute("/programs")({
  component: ProgramsLayout,
});

function ProgramsLayout() {
  return <Outlet />;
}
