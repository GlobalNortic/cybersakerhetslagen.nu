import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { seo, jsonLd, SITE_URL } from "@/lib/seo";
import { CITIES, INDUSTRIES } from "@/lib/industries";
import { PrimaryCta, SecondaryCta } from "@/components/CtaButtons";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/stad/$slug")({
  loader: ({ params }) => {
    const city = CITIES.find((c) => c.slug === params.slug);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.city;
    if (!c) return {};
    const s = seo({
      title: `NIS2 & Cybersäkerhetslagen i ${c.name}`,
      description: `Vägledning för företag och organisationer i ${c.name} kring Cybersäkerhetslagen och NIS2. Gör en preliminär bedömning.`,
      path: `/stad/${c.slug}`,
      ogTitle: `${c.name}: NIS2 & Cybersäkerhetslagen`,
      ogDescription: `Lokal vägledning och preliminär bedömning för verksamheter i ${c.name}.`,
    });
    return {
      ...s,
      scripts: [jsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: c.name, item: `${SITE_URL}/stad/${c.slug}` },
        ],
      })],
    };
  },
  notFoundComponent: () => <div className="p-12 text-center">Sidan hittades inte.</div>,
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
  component: Page,
});

function Page() {
  const { city } = Route.useLoaderData();
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold md:text-4xl">NIS2 och Cybersäkerhetslagen i {city.name}</h1>
      <p className="mt-4 text-lg text-foreground/80">
        Många verksamheter i {city.name} – inom allt från energi och transport till
        tillverkning och offentlig förvaltning – kan komma att omfattas av Cybersäkerhetslagen
        (2025:1506). Tjänsten ger en första, vägledande bild av om ni hör dit.
      </p>
      <p className="mt-4 rounded-md border border-border bg-muted/60 p-4 text-sm text-foreground/75">
        Vi påstår inte att vi har lokalt kontor i {city.name}. Sidan hjälper organisationer i
        regionen att hitta rätt väg för en preliminär bedömning och fortsatt granskning.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Vanliga sektorer i regionen</h2>
          <p className="mt-2 text-sm text-foreground/75">
            Lokala förutsättningar varierar. Använd bedömningen för att se hur sektor och
            storlek påverkar er situation.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Nästa steg för verksamheter i {city.name}</h2>
          <p className="mt-2 text-sm text-foreground/75">
            Den preliminära bedömningen blir ett bra arbetsunderlag inför dialog med jurist
            eller cybersäkerhetskonsult.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <PrimaryCta />
        <SecondaryCta />
      </div>

      <h2 className="mt-12 text-xl font-semibold">Branscher att utforska</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.slice(0, 6).map((i) => (
          <Link key={i.slug} to="/branscher/$slug" params={{ slug: i.slug }}
            className="rounded-lg border border-border bg-card p-4 hover:border-primary">
            <div className="text-xs uppercase text-muted-foreground">Bilaga {i.annex}</div>
            <div className="font-medium">{i.name}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10"><Disclaimer /></div>
    </section>
  );
}
