import { useState } from "react";
import { track } from "@/lib/analytics";

const inputCls = "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-ring";
const CONTACT_EMAIL = "hej@cybersakerhetslagen.nu";

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="rounded-md border border-success/40 bg-success/10 p-4 text-sm">
        Tack. Vi återkommer om partnerupplägg och leadmatchning.
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    let ok = false;
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      ok = res.ok;
    } catch (err) {
      console.error("Partner submit failed", err);
    }
    setSubmitting(false);
    if (!ok) {
      setError("Formuläret är inte aktiverat just nu. Kontakta oss via e-post istället.");
      return;
    }
    track("consultant_contact", { kalla: "partner_form" });
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-border bg-card p-6">
      <div className="grid gap-3 md:grid-cols-2">
        <input required name="namn" placeholder="Namn" className={inputCls} />
        <input required name="foretag" placeholder="Företag" className={inputCls} />
        <input required type="email" name="epost" placeholder="E-post" className={inputCls} />
        <input name="telefon" placeholder="Telefon (valfritt)" className={inputCls} />
        <input required name="tjansteomrade" placeholder="Tjänsteområde" className={inputCls} />
        <input required name="geografi" placeholder="Geografiskt område" className={inputCls} />
      </div>
      <textarea required name="beskrivning" placeholder="Kort beskrivning" className={`${inputCls} min-h-28`} />
      <p className="text-xs text-muted-foreground">
        Genom att skicka formuläret godkänner du att vi kontaktar dig om partnerupplägg.
        Läs mer i vår <a href="/integritet" className="underline">integritetspolicy</a>.
      </p>
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      )}
      <button disabled={submitting} className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
        {submitting ? "Skickar…" : "Anmäl intresse som partner"}
      </button>
    </form>
  );
}

