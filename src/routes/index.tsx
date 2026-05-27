import { createFileRoute, Link } from "@tanstack/react-router";
import { seoFromEntry, jsonLd, SITE_URL } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";
import { PrimaryCta, SecondaryCta } from "@/components/CtaButtons";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq, faqJsonLd, type FaqItem } from "@/components/Faq";
import { ReportPreview } from "@/components/ReportPreview";
import { HOMEPAGE_INDUSTRIES, INDUSTRIES } from "@/lib/industries";

const FAQ: FaqItem[] = [
  { q: "Vad är Cybersäkerhetslagen?", a: "Cybersäkerhetslagen (2025:1506) är den svenska lagen som genomför delar av EU:s NIS2-direktiv i svensk rätt. Den innehåller krav för verksamhetsutövare som omfattas, bland annat om säkerhetsåtgärder, utbildning, incidentrapportering, information och tillsyn." },
  { q: "Är detta samma sak som NIS2?", a: "NIS2 är EU-direktivet och cybersäkerhetslagen (2025:1506) är Sveriges nationella genomförande i svensk rätt. De hänger ihop, men verksamhetsutövare i Sverige behöver förhålla sig till den svenska lagen, cybersäkerhetsförordningen (2025:1507) och berörda myndigheters föreskrifter." },
  { q: "Är bedömningen juridisk rådgivning?", a: "Nej. Verktyget ger en preliminär indikation och ett arbetsunderlag. Det ersätter inte juridisk rådgivning och bör verifieras mot relevanta källor, myndighetsinformation eller rådgivare innan beslut fattas." },
  { q: "Vad betyder preliminär bedömning?", a: "Det betyder att resultatet bygger på de svar du lämnar och förenklad vägledning. Bedömningen kan hjälpa er att se vad som behöver granskas vidare, men är inte en slutlig juridisk klassificering." },
  { q: "Vad händer efter att jag skickar in mina uppgifter?", a: "Vi kontaktar dig för att stämma av din förfrågan och möjliga nästa steg. Uppgifterna delas inte med partner utan ditt uttryckliga samtycke." },
  { q: "Kan konsulter ta emot förfrågningar?", a: "Ja. NIS2- och cybersäkerhetskonsulter kan anmäla intresse på sidan För konsulter. Relevanta förfrågningar kan komma att matchas med partner först när det finns ett tydligt upplägg och samtycke för delning." },
];

const SECTOR_BLURBS: Record<string, string> = {
  energi: "Aktörer inom el, gas, fjärrvärme, olja och vätgas hör till de mest kritiska sektorerna.",
  transporter: "Luft-, sjö-, järnvägs- och vägtransport samt tillhörande infrastruktur kan omfattas.",
  "halso-och-sjukvard": "Vårdgivare, laboratorier och kritiska medicinska leverantörer behöver typiskt göra en bedömning.",
  "digital-infrastruktur": "DNS, datacenter, molntjänster och betrodda tjänster kan triggas oberoende av storlek.",
  "ikt-tjanster": "MSP- och MSSP-aktörer påverkas via leveranskedjerisk till andra verksamhetsutövare.",
  tillverkning: "Tillverkning av medicinteknik, fordon, elektronik och maskiner listas i Bilaga II.",
};

export const Route = createFileRoute("/")({
  head: () => {
    const s = seoFromEntry(getPage("/")!);
    return {
      ...s,
      scripts: [
        jsonLd(faqJsonLd(FAQ)),
        jsonLd({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Preliminär NIS2-bedömning",
          serviceType: "Vägledande bedömning enligt Cybersäkerhetslagen",
          provider: { "@type": "Organization", name: "cybersakerhetslagen.nu", url: SITE_URL },
          areaServed: { "@type": "Country", name: "Sverige" },
          availableLanguage: "sv-SE",
          url: `${SITE_URL}/bedomning`,
          description: "Webbaserad preliminär bedömning av om en organisation kan omfattas av Cybersäkerhetslagen (2025:1506) som genomför NIS2 i Sverige.",
        }),
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
          ],
        }),
      ],
    };
  },
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero — dark navy */}
      <section className="relative w-full max-w-[100vw] box-border border-b border-border bg-[oklch(0.18_0.04_250)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.32_0.09_245)_0%,transparent_55%)] opacity-80" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-[100vw] min-w-0 gap-12 box-border px-4 py-20 md:max-w-6xl md:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
          <div className="w-full max-w-full min-w-0 box-border">
            <p className="w-full max-w-[calc(100vw-2rem)] min-w-0 break-words text-xs font-medium uppercase tracking-[0.12em] text-white/70 sm:tracking-[0.18em]">
              Cybersäkerhetslagen (2025:1506) · NIS2
            </p>
            <h1 className="mt-4 w-full max-w-[calc(100vw-2rem)] min-w-0 text-3xl font-semibold leading-[1.15] tracking-tight break-words md:max-w-3xl md:text-4xl lg:text-5xl" lang="sv">
              {getPage("/")!.h1}
            </h1>
            <p className="mt-5 w-full max-w-[calc(100vw-2rem)] min-w-0 text-base leading-relaxed break-words text-white/85 md:max-w-2xl md:text-lg">
              Gör en preliminär NIS2-bedömning på några minuter och få en tydligare bild av
              vad som kan behöva granskas vidare.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/bedomning"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-[oklch(0.18_0.04_250)] shadow-sm transition hover:bg-white/90"
              >
                Gör preliminär bedömning
              </Link>
              <Link
                to="/kontakt"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-white/30 bg-transparent px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Boka genomgång
              </Link>
            </div>
            <p className="mt-8 w-full max-w-[calc(100vw-2rem)] min-w-0 text-sm leading-relaxed break-words text-white/65 md:max-w-2xl">
              Bygger på Cybersäkerhetslagen (2025:1506), NIS2-direktivets sektorer och
              försiktig vägledning för fortsatt granskning.
            </p>
          </div>
          <div className="relative w-full max-w-full min-w-0 box-border lg:pl-4">
            <ReportPreview priority />
            <p className="mt-3 w-full max-w-[calc(100vw-2rem)] min-w-0 text-xs text-white/60 md:max-w-full">
              Förhandsvisning av en preliminär bedömning – frågor, indikation och förslag på nästa steg.
            </p>
          </div>
        </div>
      </section>

      {/* What the assessment covers — process timeline */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-[100vw] box-border px-4 py-12 md:max-w-6xl md:py-16">
        <div className="w-full max-w-full min-w-0 md:max-w-2xl">
          <h2 className="text-2xl font-semibold md:text-3xl">Vad bedömningen går igenom</h2>
          <p className="mt-2 text-sm text-foreground/75 md:text-base">
            Bedömningen sammanställer de faktorer som typiskt avgör om en organisation
            kan omfattas. Resultatet är ett arbetsunderlag inför fortsatt granskning.
          </p>
        </div>

        {(() => {
          const steps: Array<[string, string]> = [
            ["Organisationsform", "Bolag, myndighet, region, kommun eller annan form."],
            ["NIS2-sektor", "Vilken bransch eller sektor verksamheten tillhör."],
            ["Storlek", "Antal anställda, omsättning och balansomslutning."],
            ["Särskilda omständigheter", "Faktorer som kan påverka bedömningen."],
            ["Osäkerheter", "Frågor som kan behöva utredas vidare."],
          ];
          return (
            <>
              {/* Desktop horizontal process */}
              <ol className="relative mt-10 hidden lg:grid lg:grid-cols-5 lg:gap-6">
                <div
                  aria-hidden
                  className="absolute left-[10%] right-[10%] top-4 h-px bg-border"
                />
                {steps.map(([t, d], i) => (
                  <li key={t} className="relative flex flex-col items-center text-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-background text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <div className="mt-3 text-sm font-semibold text-foreground">{t}</div>
                    <p className="mt-1 text-sm leading-snug text-foreground/70">{d}</p>
                  </li>
                ))}
              </ol>

              {/* Mobile / tablet vertical steps */}
              <ol className="mt-8 lg:hidden">
                {steps.map(([t, d], i) => {
                  const last = i === steps.length - 1;
                  return (
                    <li key={t} className="relative flex gap-4 pb-6 last:pb-0">
                      {!last && (
                        <span
                          aria-hidden
                          className="absolute left-4 top-8 bottom-0 w-px bg-border"
                        />
                      )}
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary bg-background text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <div className="pt-1">
                        <div className="text-sm font-semibold text-foreground">{t}</div>
                        <p className="mt-0.5 text-sm leading-snug text-foreground/70">{d}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          );
        })()}
        </div>
      </section>

      {/* Why start with a preliminary assessment — two-column info */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid w-full max-w-[100vw] min-w-0 gap-10 box-border px-4 py-12 md:max-w-6xl md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:py-16">
          <div className="w-full max-w-full min-w-0">
            <h2 className="text-2xl font-semibold md:text-3xl">Varför börja med en preliminär bedömning?</h2>
            <p className="mt-3 text-sm text-foreground/75 md:text-base">
              En preliminär bedömning ger en första bild av om verksamheten kan beröras av
              cybersäkerhetslagen och vilka frågor som behöver utredas vidare.
            </p>
            <div className="mt-6 border-l-2 border-primary/40 bg-card/60 px-4 py-3 text-sm text-foreground/75">
              Resultatet är vägledande och ersätter inte juridisk rådgivning.
            </div>
          </div>
          <ul className="w-full max-w-full min-w-0 divide-y divide-border border-y border-border">
            {[
              "Förstå om ni kan omfattas",
              "Identifiera frågor som behöver granskas",
              "Skapa underlag för intern dialog eller rådgivning",
              "Undvika att börja med fel åtgärder",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 py-3">
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10.5l4 4 8-9" />
                </svg>
                <span className="text-sm leading-snug text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Common sectors */}
      <section id="vanliga-sektorer" className="mx-auto w-full max-w-[100vw] box-border px-4 py-12 md:max-w-6xl md:py-16">
        <div className="flex w-full max-w-full min-w-0 flex-wrap items-end justify-between gap-4">
          <div className="w-full max-w-full min-w-0 md:max-w-2xl">
            <h2 className="text-2xl font-semibold md:text-3xl">Exempel på sektorer enligt NIS2</h2>
            <p className="mt-2 text-sm text-foreground/75 md:text-base">
              NIS2 pekar ut 18 sektorer som kan omfattas av cybersäkerhetslagen. Här visas några
              exempel. Se hela listan för en mer komplett genomgång.
            </p>
          </div>
          <Link to="/branscher" className="text-sm font-medium text-primary hover:underline">Se alla branscher →</Link>
        </div>
        <div className="mt-6 grid w-full max-w-full min-w-0 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.filter((i) => HOMEPAGE_INDUSTRIES.includes(i.slug))
            .sort((a, b) => HOMEPAGE_INDUSTRIES.indexOf(a.slug) - HOMEPAGE_INDUSTRIES.indexOf(b.slug))
            .map((i) => (
              <Link
                key={i.slug}
                to="/branscher/$slug"
                params={{ slug: i.slug }}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm"
              >
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {i.annex === "I" ? "Bilaga I – högkritisk sektor" : "Bilaga II – kritisk sektor"}
                </div>
                <div className="mt-1 text-base font-semibold group-hover:text-primary">
                  {i.name}
                </div>
                <p className="mt-1.5 text-sm leading-snug text-foreground/70">
                  {SECTOR_BLURBS[i.slug] ?? i.intro}
                </p>
                <span className="mt-auto pt-3 text-xs font-medium text-primary">Läs sektorgenomgång →</span>
              </Link>
          ))}
        </div>
      </section>

      {/* Partner band */}
      <section className="border-y border-border bg-[oklch(0.18_0.04_250)] text-white">
        <div className="mx-auto grid w-full max-w-[100vw] min-w-0 gap-8 box-border px-4 py-14 md:max-w-6xl md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="w-full max-w-full min-w-0">
            <h2 className="text-2xl font-semibold">Erbjuder ni NIS2- eller cybersäkerhetstjänster?</h2>
            <p className="mt-3 max-w-2xl text-white/80">
              Vi bygger en kanal för organisationer som behöver hjälp att förstå och verifiera
              sin preliminära bedömning enligt Cybersäkerhetslagen.
            </p>
          </div>
          <Link
            to="/for-konsulter"
            className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-[oklch(0.18_0.04_250)] hover:bg-white/90"
          >
            Anmäl intresse som partner
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[100vw] box-border px-4 py-16 md:max-w-3xl md:py-20">
        <h2 className="text-2xl font-semibold md:text-3xl">Vanliga frågor</h2>
        <div className="mt-6"><Faq items={FAQ} /></div>
        <div className="mt-8"><Disclaimer /></div>
      </section>
    </>
  );
}
