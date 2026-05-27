import { createFileRoute } from "@tanstack/react-router";
import { seoFromEntry, jsonLd, SITE_URL } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";
import { AssessmentWidget } from "@/components/AssessmentWidget";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/bedomning")({
  head: () => {
    const s = seoFromEntry(getPage("/bedomning")!);
    return {
      ...s,
      scripts: [jsonLd({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Preliminär NIS2-bedömning",
        provider: { "@type": "Organization", name: "cybersakerhetslagen.nu", url: SITE_URL },
        areaServed: "SE",
        serviceType: "Vägledande NIS2-bedömning",
      })],
    };
  },
  component: BedomningPage,
});

function BedomningPage() {
  return (
    <section className="mx-auto w-full max-w-[100vw] min-w-0 box-border px-4 py-12 md:max-w-3xl">
      <p className="w-full max-w-[calc(100vw-2rem)] min-w-0 text-xs font-medium uppercase tracking-wider text-primary md:max-w-full">Bedömning</p>
      <h1 className="mt-2 w-full max-w-[calc(100vw-2rem)] min-w-0 break-words text-3xl font-semibold md:max-w-full md:text-4xl" lang="sv">{getPage("/bedomning")!.h1}</h1>
      <p className="mt-4 w-full max-w-[calc(100vw-2rem)] min-w-0 break-words text-foreground/80 md:max-w-full">
        Svara på några frågor om organisationsform, sektor, storlek och särskilda
        omständigheter. Du får tillbaka en vägledande indikation – inte ett juridiskt besked.
      </p>
      <ul className="mt-4 grid w-full max-w-[calc(100vw-2rem)] min-w-0 gap-1 text-sm text-foreground/75 md:max-w-full">
        <li>• Resultatet är ett arbetsunderlag inför juridisk eller teknisk granskning.</li>
        <li>• Inga svar lagras eller delas med tredje part utan ditt uttryckliga samtycke.</li>
        <li>• Verifiera alltid mot lagtext och tillsynsmyndighet innan beslut fattas.</li>
      </ul>
      <div className="mt-6"><Disclaimer /></div>
      <div className="mt-8"><AssessmentWidget /></div>
    </section>
  );
}
