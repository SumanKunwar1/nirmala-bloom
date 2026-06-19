import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
} from "@tanstack/react-router";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingDonateButton } from "@/components/layout/FloatingDonateButton";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-text/70">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block mt-6 bg-accent text-white rounded-full px-6 py-3 font-semibold">
          Go home
        </Link>
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
        content: "Empowering people with disabilities through sports, arts, education & mobility in Nepal.",
      },
      { property: "og:title", content: "Nirmala Foundation Nepal" },
      { property: "og:description", content: "Disability inclusion through sports, arts, education and mobility." },
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
  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <FloatingDonateButton />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}
