import { createFileRoute } from "@tanstack/react-router";
import { seoFromEntry } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";
import { PrimaryCta, SecondaryCta } from "@/components/CtaButtons";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/nis2-konsult")({
  head: () => seoFromEntry(getPage("/nis2-konsult")!),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold md:text-4xl">{getPage("/nis2-konsult")!.h1}</h1>
      <p className="mt-4 text-lg text-foreground/80">
        Den preliminära bedömningen är en bra start. Nästa steg är ofta en granskning av
        jurist eller cybersäkerhetskonsult som kan verifiera scope, identifiera krav och
        prioritera åtgärder.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          ["Verifiering av scope", "Granskning av om verksamheten är väsentlig eller viktig verksamhetsutövare enligt lagen."],
          ["Gap-analys mot kraven", "Genomgång av riskhantering, incidentrapportering, leveranskedja och styrning."],
          ["Plan för åtgärder", "Prioriterad åtgärdsplan utifrån verksamhetens risker och resurser."],
          ["Stöd vid dialog med tillsyn", "Hjälp att tolka och dokumentera bedömningar mot källa och myndighet."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-border bg-card p-5">
            <div className="font-semibold">{t}</div>
            <p className="mt-2 text-sm text-foreground/75">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <PrimaryCta>Gör preliminär bedömning först</PrimaryCta>
        <SecondaryCta />
      </div>

      <div className="mt-10"><Disclaimer /></div>
    </section>
  );
}
