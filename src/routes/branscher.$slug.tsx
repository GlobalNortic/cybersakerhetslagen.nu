import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { seoFromEntry, jsonLd, SITE_URL } from "@/lib/seo";
import { getIndustryPage } from "@/seo/pageRegistry";
import { INDUSTRIES } from "@/lib/industries";
import { PrimaryCta, SecondaryCta } from "@/components/CtaButtons";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq, faqJsonLd } from "@/components/Faq";

export const Route = createFileRoute("/branscher/$slug")({
  loader: ({ params }) => {
    const industry = INDUSTRIES.find((i) => i.slug === params.slug);
    if (!industry) throw notFound();
    return { industry };
  },
  head: ({ loaderData }) => {
    const i = loaderData?.industry;
    if (!i) return {};
    const entry = getIndustryPage(i.slug);
    if (!entry) return {};
    const s = seoFromEntry(entry);
    return {
      ...s,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Branscher", item: `${SITE_URL}/branscher` },
            { "@type": "ListItem", position: 3, name: i.name, item: `${SITE_URL}/branscher/${i.slug}` },
          ],
        }),
        jsonLd(faqJsonLd(i.questions)),
      ],
    };
  },
  notFoundComponent: () => <div className="p-12 text-center">Bransch hittades inte.</div>,
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
  component: Page,
});

function Page() {
  const { industry } = Route.useLoaderData();
  const related = industry.related?.length
    ? INDUSTRIES.filter((i) => industry.related!.includes(i.slug))
    : INDUSTRIES.filter((i) => i.slug !== industry.slug).slice(0, 2);
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link to="/branscher" className="hover:text-primary">Branscher</Link> / {industry.name}
      </nav>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-primary">Bilaga {industry.annex}</p>
      <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{getIndustryPage(industry.slug)?.h1 ?? `${industry.name} och Cybersäkerhetslagen`}</h1>
      <p className="mt-4 text-lg text-foreground/80">{industry.intro}</p>

      <h2 className="mt-10 text-xl font-semibold">Varför sektorn kan vara relevant</h2>
      <p className="mt-3 text-foreground/80">{industry.why}</p>

      {industry.examples && industry.examples.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Exempel på system och processer som kan vara relevanta</h2>
          <ul className="mt-3 grid gap-2 text-foreground/80">
            {industry.examples.map((e: string) => (
              <li key={e} className="flex gap-2"><span className="text-primary">•</span><span>{e}</span></li>
            ))}
          </ul>
        </>
      )}

      {industry.manualReview && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Varför sektorn ofta behöver granskas manuellt</h2>
          <p className="mt-3 text-foreground/80">{industry.manualReview}</p>
        </>
      )}

      <h2 className="mt-10 text-xl font-semibold">Vanliga frågor inom {industry.name.toLowerCase()}</h2>
      <div className="mt-4"><Faq items={industry.questions} /></div>

      <div className="mt-10 flex flex-wrap gap-3">
        <PrimaryCta />
        <SecondaryCta />
      </div>

      <div className="mt-10"><Disclaimer /></div>

      <h2 className="mt-12 text-xl font-semibold">Relaterade sektorer</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {related.map((o) => (
          <Link key={o.slug} to="/branscher/$slug" params={{ slug: o.slug }}
            className="rounded-lg border border-border bg-card p-4 hover:border-primary">
            <div className="text-xs uppercase text-muted-foreground">Bilaga {o.annex}</div>
            <div className="font-medium">{o.name} och Cybersäkerhetslagen</div>
            {o.oneLine && <p className="mt-1 text-sm text-foreground/70">{o.oneLine}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
