import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
} from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-3 text-muted-foreground">Sidan kunde inte hittas.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Till startsidan</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Ett fel uppstod</h1>
        <p className="mt-2 text-sm text-muted-foreground">Försök igen eller gå till startsidan.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Försök igen</button>
          <a href="/" className="rounded-md border border-border bg-background px-4 py-2 text-sm">Startsidan</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { name: "description", content: "Gör en preliminär bedömning av om ditt företag kan omfattas av Cybersäkerhetslagen." },
      { property: "og:description", content: "Gör en preliminär bedömning av om ditt företag kan omfattas av Cybersäkerhetslagen." },
      { name: "twitter:description", content: "Gör en preliminär bedömning av om ditt företag kan omfattas av Cybersäkerhetslagen." },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "cybersakerhetslagen.nu",
          url: SITE_URL,
          logo: `${SITE_URL}/icon-mark.png`,
          inLanguage: "sv-SE",
          areaServed: "SE",
          contactPoint: [{
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "kontakt@cybersakerhetslagen.nu",
            availableLanguage: ["sv", "en"],
          }],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "cybersakerhetslagen.nu",
          url: SITE_URL,
          inLanguage: "sv-SE",
        }),
      },
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
      <div className="flex min-h-screen w-full max-w-[100vw] flex-col box-border">
        <SiteHeader />
        <main className="flex-1 w-full max-w-[100vw] box-border">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
