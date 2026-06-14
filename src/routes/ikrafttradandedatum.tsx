import { createFileRoute, Link } from "@tanstack/react-router";
import { seoFromEntry, jsonLd, SITE_URL } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";
import { Disclaimer } from "@/components/Disclaimer";

const riksdagenUrl =
  "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/cybersakerhetslag-20251506_sfs-2025-1506/";

export const Route = createFileRoute("/ikrafttradandedatum")({
  head: () => ({
    ...seoFromEntry(getPage("/ikrafttradandedatum")!),
    scripts: [
      jsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: getPage("/ikrafttradandedatum")!.h1,
        description: getPage("/ikrafttradandedatum")!.description,
        url: `${SITE_URL}/ikrafttradandedatum`,
        inLanguage: "sv-SE",
        mainEntityOfPage: `${SITE_URL}/ikrafttradandedatum`,
        about: "Cybersäkerhetslagen (2025:1506)",
      }),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "När trädde cybersäkerhetslagen i kraft?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cybersäkerhetslagen (2025:1506) trädde i kraft den 15 januari 2026.",
            },
          },
          {
            "@type": "Question",
            name: "Vilken lag ersatte cybersäkerhetslagen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cybersäkerhetslagen upphävde lagen (2018:1174) om informationssäkerhet för samhällsviktiga och digitala tjänster.",
            },
          },
        ],
      }),
    ],
  }),
  component: Page,
});

function Page() {
  const page = getPage("/ikrafttradandedatum")!;

  return (
    <article className="mx-auto w-full max-w-[100vw] box-border px-4 py-12 md:max-w-4xl md:py-16">
      <p className="text-sm font-medium text-primary">Cybersäkerhetslagen (2025:1506)</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{page.h1}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/80">
        Cybersäkerhetslagen trädde i kraft den 15 januari 2026. Lagen genomför delar av EU:s
        NIS2-direktiv i svensk rätt och ersatte den tidigare NIS-lagen.
      </p>

      <section className="mt-8 rounded-lg border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">Kort svar</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/80">
          Den svenska cybersäkerhetslagen, med SFS-nummer 2025:1506, gäller från och med den 15
          januari 2026.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Vad betyder ikraftträdande?</h2>
        <p className="mt-3 leading-relaxed text-foreground/80">
          Ikraftträdande betyder det datum då en lag börjar gälla. För cybersäkerhetslagen är det
          datumet 15 januari 2026.
        </p>
        <p className="mt-3 leading-relaxed text-foreground/80">
          Riksdagens övergångsbestämmelser anger också att den äldre lagen om informationssäkerhet
          för samhällsviktiga och digitala tjänster upphävs genom den nya lagen. Den äldre lagen kan
          ändå fortsätta att gälla för överträdelser som skedde före ikraftträdandet.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Praktiskt nästa steg</h2>
        <p className="mt-3 leading-relaxed text-foreground/80">
          Om du vill förstå om din organisation kan omfattas av lagen kan du börja med en preliminär
          bedömning. Den ger en första indikation och pekar ut frågor som kan behöva granskas
          vidare.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/bedomning"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Gör preliminär bedömning
          </Link>
          <Link
            to="/branscher"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Se branscher och sektorer
          </Link>
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-2xl font-semibold">Källor</h2>
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          <li>
            <a
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={riksdagenUrl}
            >
              Riksdagen: Cybersäkerhetslag (2025:1506)
            </a>
          </li>
        </ul>
      </section>

      <div className="mt-10">
        <Disclaimer />
      </div>
    </article>
  );
}
