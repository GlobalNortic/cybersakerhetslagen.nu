import { useEffect, useRef, useState } from "react";
import {
  ORG_TYPES,
  SECTORS,
  SPECIAL_FLAGS,
  assess,
  type AssessmentInput,
  type AssessmentResult,
  type FlagId,
  type OrgType,
} from "@/lib/assessment";
import { Disclaimer } from "./Disclaimer";
import { track } from "@/lib/analytics";

// Ungefärlig växelkurs för att omvandla användarens SEK-belopp till EUR
// som NIS2:s storlekströsklar är uttryckta i. Avrundas medvetet generöst.
const SEK_PER_EUR = 11.5;
const sekToEur = (sek: number | null) => (sek === null ? null : Math.round(sek / SEK_PER_EUR));

type LeadKind = "boka" | "rapport";

export function AssessmentWidget() {
  const startedRef = useRef(false);
  const [input, setInput] = useState<AssessmentInput>({
    orgType: "",
    sector: "",
    employees: null,
    turnover: null,
    balance: null,
    flags: [],
  });
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitted, setSubmitted] = useState<LeadKind | null>(null);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("assessment_started");
  };

  const toggleFlag = (id: FlagId) => {
    markStarted();
    setInput((s) => ({
      ...s,
      flags: s.flags.includes(id) ? s.flags.filter((f) => f !== id) : [...s.flags, id],
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Användaren anger SEK i UI; bedömningen utgår från EUR-trösklar.
    const r = assess({
      ...input,
      turnover: sekToEur(input.turnover),
      balance: sekToEur(input.balance),
    });
    setResult(r);
    track("assessment_completed", { resultat: r.label, sektor: input.sector || "" });
    queueMicrotask(() => {
      track("report_viewed", { resultat: r.label });
      document.getElementById("bedomning-resultat")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (!startedRef.current && (input.orgType || input.sector || input.employees !== null)) {
      markStarted();
    }
  }, [input.orgType, input.sector, input.employees]);

  return (
    <div className="grid w-full max-w-[calc(100vw-2rem)] min-w-0 gap-8 box-border md:max-w-full">
      <form onSubmit={onSubmit} className="grid w-full max-w-[calc(100vw-2rem)] min-w-0 gap-6 box-border rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6 md:max-w-full">
        <Field label="1. Vilken typ av organisation är ni?">
          <select
            required
            value={input.orgType}
            onChange={(e) => setInput({ ...input, orgType: e.target.value as OrgType })}
            className={selectCls}
          >
            <option value="">Välj…</option>
            {ORG_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field label="2. Vilken NIS2-sektor eller bransch passar bäst?">
          <select
            required
            value={input.sector}
            onChange={(e) => setInput({ ...input, sector: e.target.value })}
            className={selectCls}
          >
            <option value="">Välj…</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="3. Hur många anställda har organisationen?">
          <input
            type="number"
            min={0}
            required
            value={input.employees ?? ""}
            onChange={(e) => setInput({ ...input, employees: e.target.value === "" ? null : Number(e.target.value) })}
            className={inputCls}
            placeholder="t.ex. 75"
          />
        </Field>

        <Field
          label="4. Vet ni ungefärlig årsomsättning och balansomslutning?"
          hint="Ange belopp för senaste räkenskapsåret. Ni kan skriva hela beloppet eller välja ett ungefärligt belopp nedan. Om ni är osäkra kan ni lämna fälten tomma."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SekAmountInput
              label="Årsomsättning, cirka"
              value={input.turnover}
              onChange={(v) => setInput({ ...input, turnover: v })}
            />
            <SekAmountInput
              label="Balansomslutning, cirka"
              value={input.balance}
              onChange={(v) => setInput({ ...input, balance: v })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            NIS2 anger trösklarna i EUR. Vi räknar om era SEK-belopp automatiskt med en ungefärlig kurs ({SEK_PER_EUR} SEK/EUR).
          </p>
        </Field>

        <Field
          label="5. Finns det något särskilt som gäller för er verksamhet?"
          hint="Markera bara det som stämmer. Om inget passar kan ni lämna detta tomt."
        >
          <div className="grid gap-2">
            {SPECIAL_FLAGS.map((f) => (
              <div key={f.id} className="grid gap-1">
                <label className="flex items-start gap-2 text-sm min-w-0 max-w-full">
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0"
                    checked={input.flags.includes(f.id)}
                    onChange={() => toggleFlag(f.id)}
                  />
                  <span className="min-w-0 break-words [hyphens:auto]" lang="sv">{f.label}</span>
                </label>
                {FLAG_INFO[f.id] && (
                  <details className="ml-0 pl-6 text-xs text-muted-foreground min-w-0 max-w-full break-words [hyphens:auto]" lang="sv">
                    <summary className="cursor-pointer text-primary/80 hover:text-primary">
                      <span className="inline-flex items-center gap-1">
                        <InfoIcon /> Vad betyder detta?
                      </span>
                    </summary>
                    <p className="mt-1 leading-relaxed max-w-full break-words whitespace-normal">{FLAG_INFO[f.id]}</p>
                  </details>
                )}
              </div>
            ))}
          </div>
        </Field>

        <button type="submit" className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Visa preliminär indikation
        </button>
        <Disclaimer />
      </form>

      {result && (
        <div id="bedomning-resultat" className="grid w-full max-w-[calc(100vw-2rem)] min-w-0 gap-6 box-border rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6 md:max-w-full">
          <div>
            <div className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
              result.label === "vasentlig" ? "bg-primary/10 text-primary"
              : result.label === "viktig" ? "bg-accent/15 text-accent-foreground"
              : result.label === "behover_granskas" ? "bg-warning/15 text-foreground"
              : "bg-muted text-muted-foreground"
            }`}>Preliminär indikation</div>
            <h3 className="mt-3 text-xl font-semibold">{result.title}</h3>
            <p className="mt-3 text-sm text-foreground/80">{result.rationale}</p>
            <p className="mt-3 text-sm"><span className="font-medium">Förslag på nästa steg: </span>{result.nextStep}</p>
          </div>
          <Disclaimer />

          {!submitted ? (
            <LeadSection
              result={result}
              sector={input.sector}
              turnoverSek={input.turnover}
              balanceSek={input.balance}
              onSuccess={(kind) => setSubmitted(kind)}
            />
          ) : (
            <div className="rounded-md border border-success/40 bg-success/10 p-4 text-sm">
              {submitted === "boka"
                ? "Tack! Vi har tagit emot din bedömning och kontaktar dig för att boka en kostnadsfri 30-minuters genomgång."
                : "Tack! Vi skickar din preliminära NIS2-rapport till din e-post."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LeadSection({ result, sector, turnoverSek, balanceSek, onSuccess }: {
  result: AssessmentResult;
  sector: string;
  turnoverSek: number | null;
  balanceSek: number | null;
  onSuccess: (kind: LeadKind) => void;
}) {
  const [kind, setKind] = useState<LeadKind>("boka");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const copy = kind === "boka"
    ? {
        heading: "Boka en kostnadsfri 30-minuters genomgång av din bedömning",
        body: "Under genomgången går vi igenom din preliminära NIS2-bedömning, förklarar resultatet och pekar ut frågor som kan behöva utredas vidare. Första 30 minuterna är kostnadsfria. Eventuell rådgivning, dokumentation eller vidare analys offereras separat.",
        submit: "Boka kostnadsfri 30-minuters genomgång",
      }
    : {
        heading: "Skicka preliminär NIS2-rapport till min e-post",
        body: "Fyll i dina kontaktuppgifter så skickar vi din preliminära NIS2-rapport till din e-post. Rapporten bygger på dina svar och är en vägledande indikation, inte ett juridiskt besked.",
        submit: "Skicka rapporten till min e-post",
      };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    setSubmitting(true);
    setError(null);
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      ...data,
      resultat: result.label,
      titel: result.title,
      onskemal: kind,
      omsattning_sek: turnoverSek,
      balans_sek: balanceSek,
      omsattning_eur: sekToEur(turnoverSek),
      balans_eur: sekToEur(balanceSek),
    };
    let ok = false;
    let serverMessage: string | null = null;
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      ok = res.ok;
      if (!ok) {
        try {
          const body = await res.json();
          if (body && typeof body.message === "string") serverMessage = body.message;
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      console.error("Lead submit failed", err);
    }
    setSubmitting(false);
    if (!ok) {
      setError(
        serverMessage ??
          "Vi kunde inte skicka formuläret just nu. Försök igen om en stund eller kontakta oss på"
      );
      return;
    }
    track("consultant_contact", {
      kalla: kind === "boka" ? "lead_form_boka" : "lead_form_rapport",
      resultat: result.label,
    });
    onSuccess(kind);
  };

  const tabCls = (active: boolean) =>
    `rounded-md border px-3 py-2 text-sm font-medium transition ${
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-background text-foreground hover:bg-muted"
    }`;

  return (
    <div className="grid w-full max-w-full min-w-0 gap-4 border-t border-border pt-6 box-border">
      <div className="flex w-full max-w-full min-w-0 flex-wrap gap-2" role="tablist" aria-label="Vad vill du göra?">
        <button type="button" role="tab" aria-selected={kind === "boka"} onClick={() => setKind("boka")} className={tabCls(kind === "boka")}>
          Boka genomgång
        </button>
        <button type="button" role="tab" aria-selected={kind === "rapport"} onClick={() => setKind("rapport")} className={tabCls(kind === "rapport")}>
          Få rapporten via e-post
        </button>
      </div>
      <div className="w-full max-w-full min-w-0">
        <h4 className="text-base font-semibold">{copy.heading}</h4>
        <p className="mt-1 text-sm text-foreground/75">{copy.body}</p>
      </div>
      <form ref={formRef} onSubmit={onSubmit} className="grid w-full max-w-full min-w-0 gap-3">
        <div className="grid w-full max-w-full min-w-0 gap-3 md:grid-cols-2">
          <input required name="namn" placeholder="Namn" className={inputCls} />
          <input required name="foretag" placeholder="Företag" className={inputCls} />
          <input required type="email" name="epost" placeholder="E-post" className={inputCls} />
          <input name="telefon" placeholder="Telefonnummer (valfritt)" className={inputCls} />
          <input required name="roll" placeholder="Roll" className={inputCls} />
          <input name="sektor" defaultValue={sector} placeholder="Sektor" className={inputCls} />
        </div>
        <textarea name="kommentar" placeholder="Kommentar (valfritt)" className={`${inputCls} min-h-24`} />
        <p className="text-xs text-muted-foreground">
          Genom att skicka formuläret godkänner ni att vi kontaktar er om er förfrågan.
          Läs mer i vår <a href="/integritet" className="underline">integritetspolicy</a>.
        </p>
        {error && (
          <div
            className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm [&_a]:underline"
            dangerouslySetInnerHTML={{
              __html: /<a\s/i.test(error)
                ? error
                : `${error} <a href="mailto:hej@cybersakerhetslagen.nu">hej@cybersakerhetslagen.nu</a>`,
            }}
          />
        )}
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Skickar…" : copy.submit}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full min-w-0 max-w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-ring";
const selectCls = inputCls;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid w-full max-w-full min-w-0 gap-2 box-border">
      <div className="w-full max-w-full min-w-0">
        <div className="w-full max-w-full min-w-0 break-words text-sm font-medium">{label}</div>
        {hint && <div className="w-full max-w-full min-w-0 break-words text-xs text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

const FLAG_INFO: Partial<Record<FlagId, string>> = {
  multi: "NIS2 omfattar bland annat energi, transporter, bank och finans, hälso- och sjukvård, dricksvatten, avloppsvatten, digital infrastruktur, offentlig förvaltning, post- och budtjänster, avfallshantering, kemikalier, livsmedel, tillverkning, digitala tjänster och forskning. Välj detta om er verksamhet passar in i flera av dessa områden, till exempel både transport och digital infrastruktur.",
  dora: "DORA är ett EU-regelverk för digital operativ motståndskraft i finanssektorn. Det kan gälla exempelvis banker, betalningsinstitut, försäkringsaktörer och vissa IT-leverantörer till finansiella verksamheter.",
  trust: "Kvalificerade betrodda tjänster är särskilda digitala tjänster som används för att skapa förtroende i elektroniska transaktioner, till exempel kvalificerade elektroniska signaturer, elektroniska sigill, tidsstämplingar eller certifikat. Det gäller främst företag som är registrerade som kvalificerade tillhandahållare av sådana tjänster enligt eIDAS.",
  ecomm: "Detta kan gälla verksamheter som tillhandahåller nät eller tjänster för elektronisk kommunikation, till exempel internetaccess, telefoni, meddelandetjänster eller annan kommunikationsinfrastruktur.",
  sole: "Välj detta om ni är en av få, eller den enda, leverantören av en tjänst som kunder eller samhällsviktiga funktioner är starkt beroende av.",
  impact: "Välj detta om ett längre avbrott hos er kan få allvarliga följder för människor, samhällsviktiga funktioner eller större delar av marknaden. Exempel är påverkan på sjukvård, transporter, betalningar, kommunikation, energi eller annan kritisk infrastruktur.",
  national: "Välj detta om organisationen har en viktig roll för samhället nationellt eller regionalt, även om verksamheten inte är stor. Det kan till exempel gälla en tjänst som många invånare, företag eller myndigheter är beroende av.",
};

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

const QUICK_AMOUNTS: { label: string; value: number }[] = [
  { label: "1 miljon", value: 1_000_000 },
  { label: "10 miljoner", value: 10_000_000 },
  { label: "50 miljoner", value: 50_000_000 },
  { label: "100 miljoner", value: 100_000_000 },
  { label: "500 miljoner", value: 500_000_000 },
  { label: "1 miljard", value: 1_000_000_000 },
];

// Tolka fritext: "10 miljoner", "1,5 mdr", "20 000 000", "10m", "1.2bn"
function parseSekInput(raw: string): number | null {
  if (!raw) return null;
  const s = raw.toLowerCase().replace(/\s|kr|sek/g, "").replace(",", ".");
  if (!s) return null;
  const m = s.match(/^([0-9]*\.?[0-9]+)\s*(.*)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!isFinite(n)) return null;
  const unit = m[2];
  let mult = 1;
  if (/^(mdr|miljard|mrd|bn|b)/.test(unit)) mult = 1_000_000_000;
  else if (/^(mn|mln|miljon|m)/.test(unit)) mult = 1_000_000;
  else if (/^(tkr|tusen|k)/.test(unit)) mult = 1_000;
  return Math.round(n * mult);
}

function formatSekDisplay(n: number): string {
  return n.toLocaleString("sv-SE").replace(/\u00a0/g, " ");
}

function formatHumanSek(n: number): string {
  if (n >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return `${v.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} miljarder SEK`;
  }
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} miljoner SEK`;
  }
  return `${formatSekDisplay(n)} SEK`;
}

function formatHumanEur(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} miljoner EUR`;
  }
  return `${n.toLocaleString("sv-SE")} EUR`;
}

function SekAmountInput({ label, value, onChange }: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const [text, setText] = useState<string>(value === null ? "" : formatSekDisplay(value));

  // Håll text synkad om värdet sätts utifrån (t.ex. snabbval)
  useEffect(() => {
    const parsed = parseSekInput(text);
    if (parsed !== value) {
      setText(value === null ? "" : formatSekDisplay(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (raw: string) => {
    setText(raw);
    onChange(parseSekInput(raw));
  };

  const handleBlur = () => {
    if (value !== null) setText(formatSekDisplay(value));
  };

  const eur = sekToEur(value);

  return (
    <div className="grid w-full max-w-full min-w-0 gap-2 box-border">
      <div className="relative w-full max-w-full min-w-0">
        <input
          type="text"
          inputMode="decimal"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`${inputCls} w-full pr-10`}
          placeholder={`${label} (t.ex. 10 miljoner)`}
          aria-label={label}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kr</span>
      </div>
      <div className="flex w-full max-w-full min-w-0 flex-wrap gap-1.5">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q.value}
            type="button"
            onClick={() => { onChange(q.value); setText(formatSekDisplay(q.value)); }}
            className={`rounded-full border px-2.5 py-1 text-xs transition ${
              value === q.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>
      {value !== null && value > 0 && (
        <div className="w-full max-w-full min-w-0 text-xs leading-relaxed text-muted-foreground">
          <div>Tolkat som: <span className="text-foreground">{formatHumanSek(value)}</span></div>
          {eur !== null && <div>≈ {formatHumanEur(eur)}</div>}
        </div>
      )}
    </div>
  );
}
