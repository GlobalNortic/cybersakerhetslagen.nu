import { createFileRoute } from "@tanstack/react-router";
import { seoFromEntry } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";

export const Route = createFileRoute("/integritet")({
  head: () => seoFromEntry(getPage("/integritet")!),
  component: Page,
});

function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-slate max-w-none">
      <h1 className="text-3xl font-semibold">{getPage("/integritet")!.h1}</h1>
      <p className="mt-4 text-foreground/80">Senast uppdaterad: 2026-05-11</p>

      <h2 className="mt-8 text-xl font-semibold">Personuppgiftsansvarig</h2>
      <p>cybersakerhetslagen.nu (kontaktuppgifter på <a href="/kontakt" className="underline">kontaktsidan</a>).</p>

      <h2 className="mt-6 text-xl font-semibold">Vilka uppgifter samlar vi in?</h2>
      <ul className="list-disc pl-5">
        <li>Namn, företag, e-post, telefon, roll och eventuella kommentarer du anger i formulär.</li>
        <li>Sammanfattning av de svar du gett i den preliminära bedömningen.</li>
        <li>Teknisk basinformation (t.ex. anonym trafikstatistik) om sådana verktyg används.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">Varför behandlar vi uppgifterna?</h2>
      <ul className="list-disc pl-5">
        <li>För att svara på din förfrågan.</li>
        <li>För att kvalificera leads och föreslå relevant nästa steg.</li>
        <li>För att förbättra tjänsten och innehållet.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">Rättslig grund</h2>
      <p>Berättigat intresse eller samtycke beroende på sammanhang. För direktmarknadsföring används samtycke.</p>

      <h2 className="mt-6 text-xl font-semibold">Lagringstid</h2>
      <p>Vi sparar uppgifterna så länge det behövs för att hantera din förfrågan, dock som utgångspunkt högst 24 månader om inget annat avtalas.</p>

      <h2 className="mt-6 text-xl font-semibold">Delning med partner</h2>
      <p>Leads delas inte med partner utan ditt uttryckliga samtycke. Om matchning sker informeras du innan dina uppgifter delas.</p>

      <h2 className="mt-6 text-xl font-semibold">Cookies och analys</h2>
      <p>
        Om vi i framtiden använder analysverktyg kan cookies förekomma. Beroende på verktyg och konfiguration kan
        samtycke krävas, och vi kommer i så fall att be om det innan icke-nödvändiga cookies sätts.
      </p>

      <h2 className="mt-6 text-xl font-semibold">Dina rättigheter</h2>
      <p>Du har rätt att begära tillgång, rättelse, radering, begränsning och invändning. Du har även rätt att klaga till Integritetsskyddsmyndigheten (IMY).</p>

      <h2 className="mt-6 text-xl font-semibold">Kontakt</h2>
      <p>
        Skicka frågor om personuppgifter via vår <a href="/kontakt" className="underline">kontaktsida</a> eller
        e-post: <a className="underline" href="mailto:kontakt@cybersakerhetslagen.nu">kontakt@cybersakerhetslagen.nu</a>.
      </p>
    </article>
  );
}
