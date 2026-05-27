import { createFileRoute } from "@tanstack/react-router";
import { seoFromEntry, jsonLd, SITE_URL } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/kontakt")({
  head: () => {
    const s = seoFromEntry(getPage("/kontakt")!);
    return {
      ...s,
      scripts: [jsonLd({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: `${SITE_URL}/kontakt`,
        name: "Kontakt – cybersakerhetslagen.nu",
      })],
    };
  },
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold md:text-4xl">{getPage("/kontakt")!.h1}</h1>
      <p className="mt-4 text-lg text-foreground/80">
        Vill du boka en genomgång eller har frågor om bedömningen? Skicka ett meddelande så
        återkommer vi.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-foreground/80">
          E-post: <a
            className="text-primary underline"
            href="mailto:kontakt@cybersakerhetslagen.nu"
            onClick={() => track("consultant_contact", { kalla: "kontakt_mailto" })}
          >kontakt@cybersakerhetslagen.nu</a>
        </p>
        <p className="mt-2 text-sm text-foreground/80">
          Vill du börja med en preliminär bedömning? <a href="/bedomning" className="text-primary underline">Starta här</a>.
        </p>
      </div>
    </section>
  );
}
