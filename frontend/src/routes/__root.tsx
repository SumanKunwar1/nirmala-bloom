import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
} from "@tanstack/react-router";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AdminProvider } from "@/lib/admin/context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 pt-24 pb-16">
      <div className="max-w-lg text-center">
        <div className="eyebrow no-rule">Error 404</div>
        <h1 className="display-2 mt-4">Page not found</h1>
        <p className="mt-4 text-lg text-text/70">
          The page you're looking for has moved or doesn't exist. Let's get you somewhere useful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-pill btn-dark">
            Go home
          </Link>
          <Link to="/programs" className="btn-pill btn-outline">
            See our work
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-text/70">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-primary text-white rounded-full px-5 py-2 text-sm font-semibold"
          >
            Try again
          </button>
          <a href="/" className="border border-border rounded-full px-5 py-2 text-sm font-semibold">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "Nirmala Foundation Nepal — Breaking Barriers, Building Belonging" },
      {
        name: "description",
        content:
          "Empowering people with disabilities through sports, arts, education & mobility in Nepal.",
      },
      { property: "og:title", content: "Nirmala Foundation Nepal" },
      {
        property: "og:description",
        content: "Disability inclusion through sports, arts, education and mobility.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // The admin panel has its own full-screen chrome — hide the public site
  // navbar, footer, and floating buttons on any /admin route.
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <HeadContent />
        {isAdmin ? (
          <div className="admin-ui">
            <Outlet />
          </div>
        ) : (
          <>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="min-h-screen">
              <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        )}
      </AdminProvider>
    </QueryClientProvider>
  );
}
