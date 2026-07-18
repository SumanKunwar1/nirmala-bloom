import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout route for /donate — renders only an <Outlet /> so the campaigns
 * listing (index) and each campaign ($slug) render as their own standalone page.
 */
export const Route = createFileRoute("/donate")({
  component: DonateLayout,
});

function DonateLayout() {
  return <Outlet />;
}
