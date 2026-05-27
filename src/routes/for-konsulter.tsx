import { createFileRoute } from "@tanstack/react-router";
import { seoFromEntry } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";
import { PartnerForm } from "@/components/PartnerForm";

export const Route = createFileRoute("/for-konsulter")({
  head: () => seoFromEntry(getPage("/for-konsulter")!),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold md:text-4xl">{getPage("/for-konsulter")!.h1}</h1>
      <p className="mt-4 text-lg text-foreground/80">
        Vi bygger en kanal för organisationer som behöver hjälp att förstå och verifiera sin
        preliminära bedömning enligt Cybersäkerhetslagen. Anmäl intresse så hör vi av oss
        när vi öppnar för partner.
      </p>
      <div className="mt-8"><PartnerForm /></div>
      <p className="mt-6 text-xs text-muted-foreground">
        Leads delas inte automatiskt. Matchning sker i dialog och förutsätter att kunden
        uttryckligen samtycker.
      </p>
    </section>
  );
}
