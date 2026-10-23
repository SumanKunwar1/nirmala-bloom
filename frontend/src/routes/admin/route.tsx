import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout route for /admin. The content + auth provider now lives at the app
 * root (so the public site shares it), so this just renders an <Outlet />.
 */
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin | Nirmala Foundation" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
