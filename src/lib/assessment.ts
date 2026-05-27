export type OrgType =
  | "privat"
  | "myndighet"
  | "kommun"
  | "region"
  | "kommunalforbund"
  | "utbildningsanordnare"
  | "annan_offentlig";

export const ORG_TYPES: { value: OrgType; label: string }[] = [
  { value: "privat", label: "Privat verksamhetsutövare" },
  { value: "myndighet", label: "Statlig myndighet" },
  { value: "kommun", label: "Kommun" },
  { value: "region", label: "Region" },
  { value: "kommunalforbund", label: "Kommunalförbund" },
  { value: "utbildningsanordnare", label: "Enskild utbildningsanordnare" },
  { value: "annan_offentlig", label: "Annan offentlig aktör" },
];

export const ANNEX_I = [
  "Energi",
  "Transporter",
  "Bankverksamhet",
  "Finansmarknadsinfrastruktur",
  "Hälso- och sjukvård",
  "Dricksvatten",
  "Avloppsvatten",
  "Digital infrastruktur",
  "Förvaltning av IKT-tjänster B2B",
  "Offentlig förvaltning",
  "Rymden",
];

export const ANNEX_II = [
  "Post- och budtjänster",
  "Avfallshantering",
  "Kemikalier",
  "Livsmedel",
  "Tillverkning",
  "Digitala leverantörer",
  "Forskning",
];

export const SECTORS = [...ANNEX_I, ...ANNEX_II, "Osäker / flera områden"];

export const SPECIAL_FLAGS = [
  { id: "multi", label: "Flera NIS2-sektorer/branscher passar in på vår verksamhet" },
  { id: "dora", label: "Vi omfattas, eller kan omfattas, av DORA-regelverket för finansiella verksamheter" },
  { id: "dns", label: "Vi erbjuder DNS-tjänster" },
  { id: "tld", label: "Vi är registreringsenhet för toppdomäner" },
  { id: "trust", label: "Vi tillhandahåller kvalificerade betrodda tjänster" },
  { id: "ecomm", label: "Vi tillhandahåller allmänna elektroniska kommunikationsnät eller tjänster" },
  { id: "sole", label: "Vi kan vara enda leverantör av en kritisk tjänst" },
  { id: "impact", label: "En störning kan påverka liv, hälsa, allmän säkerhet eller systemrisker" },
  { id: "national", label: "Organisationen kan ha särskild nationell eller regional betydelse" },
  { id: "uncertain", label: "Vi är osäkra och vill att en NIS2-konsult granskar bedömningen" },
] as const;

export type FlagId = typeof SPECIAL_FLAGS[number]["id"];

export type AssessmentInput = {
  orgType: OrgType | "";
  sector: string;
  employees: number | null;
  turnover: number | null;
  balance: number | null;
  flags: FlagId[];
};

export type ResultLabel =
  | "vasentlig"
  | "viktig"
  | "ej_omfattas"
  | "behover_granskas";

export type AssessmentResult = {
  label: ResultLabel;
  title: string;
  rationale: string;
  nextStep: string;
};

const RESULT_TITLES: Record<ResultLabel, string> = {
  vasentlig: "Preliminär indikation: kan omfattas som väsentlig verksamhetsutövare",
  viktig: "Preliminär indikation: kan omfattas som viktig verksamhetsutövare",
  ej_omfattas: "Preliminär indikation: verksamheten ser inte ut att omfattas utifrån angivna svar",
  behover_granskas: "Behöver granskas",
};

export function assess(input: AssessmentInput): AssessmentResult {
  const { orgType, sector, employees, turnover, balance, flags } = input;

  const has = (id: FlagId) => flags.includes(id);

  // Auto-väsentlig oavsett storlek (NIS2 art. som omfattar dessa typer av aktörer
  // oberoende av storlek): DNS, TLD-registreringsenhet, kvalificerade betrodda tjänster.
  const sizeIndependentVasentlig: string[] = [];
  if (has("dns")) sizeIndependentVasentlig.push("DNS-tjänster");
  if (has("tld")) sizeIndependentVasentlig.push("registreringsenhet för toppdomäner");
  if (has("trust")) sizeIndependentVasentlig.push("kvalificerade betrodda tjänster");

  // Manuella granskningstriggers (1 kap. 5 §-liknande särdrag, DORA-överlapp, osäkerhet).
  const manualTriggers: string[] = [];
  if (sector === "Osäker / flera områden") manualTriggers.push("flera/oklara sektorer");
  if (has("multi")) manualTriggers.push("verksamhet i flera sektorer");
  if (has("dora")) manualTriggers.push("DORA kan vara tillämpligt");
  if (has("sole")) manualTriggers.push("möjlig enda leverantör av kritisk tjänst");
  if (has("impact")) manualTriggers.push("störning kan påverka liv/hälsa/säkerhet");
  if (has("national")) manualTriggers.push("särskild nationell/regional betydelse");
  if (has("uncertain")) manualTriggers.push("uttryckt osäkerhet");
  if (orgType === "annan_offentlig") manualTriggers.push("annan offentlig aktör – oklart omfång");

  // Storleksoberoende väsentlig vinner över manuell granskning, men eventuella
  // manuella triggers listas som ytterligare punkter att granska.
  if (sizeIndependentVasentlig.length > 0) {
    return makeResult(
      "vasentlig",
      "Verksamhetstyp som kan omfattas oberoende av storlek: " + sizeIndependentVasentlig.join(", ") + ".",
      manualTriggers,
    );
  }

  if (manualTriggers.length > 0) {
    return {
      label: "behover_granskas",
      title: RESULT_TITLES.behover_granskas,
      rationale:
        "Verksamheten har särdrag som behöver granskas manuellt innan klassificering kan göras: " +
        manualTriggers.join(", ") + ".",
      nextStep: nextStepFor("behover_granskas"),
    };
  }

  if (employees === null) {
    return {
      label: "behover_granskas",
      title: RESULT_TITLES.behover_granskas,
      rationale: "Antal anställda saknas, vilket gör det inte möjligt att tillämpa storleksreglerna.",
      nextStep: nextStepFor("behover_granskas"),
    };
  }

  const bothFinancials = (turnover ?? 0) > 10_000_000 && (balance ?? 0) > 10_000_000;
  const bothLargeFinancials = (turnover ?? 0) > 50_000_000 && (balance ?? 0) > 43_000_000;
  const mediumOrLarger = employees >= 50 || bothFinancials;
  const largerThanMedium = employees >= 250 || bothLargeFinancials;

  const isAnnexI = ANNEX_I.includes(sector);
  const isAnnexII = ANNEX_II.includes(sector);
  const isPublicSizeable = (orgType === "kommun" || orgType === "region" || orgType === "myndighet" || orgType === "kommunalforbund");

  // Allmänna elektroniska kommunikationsnät/-tjänster: väsentlig vid medel-eller-större,
  // annars ingen automatisk klassificering (faller till storleksbaserad/övrig logik).
  if (has("ecomm") && mediumOrLarger) {
    return makeResult(
      "vasentlig",
      "Allmänna elektroniska kommunikationsnät/-tjänster på medel eller större nivå – indikation på väsentlig verksamhetsutövare.",
      manualTriggers,
    );
  }

  if (isAnnexI && largerThanMedium) {
    return makeResult("vasentlig", "Bilaga I-sektor och större än medelstor – indikation på väsentlig verksamhetsutövare.", manualTriggers);
  }
  if (isPublicSizeable && largerThanMedium) {
    return makeResult("vasentlig", "Offentlig aktör med betydande storlek – indikation på väsentlig verksamhetsutövare.", manualTriggers);
  }
  if (isAnnexI && mediumOrLarger) {
    return makeResult("viktig", "Bilaga I-sektor på medelstor nivå – indikation på viktig verksamhetsutövare.", manualTriggers);
  }
  if (isAnnexII && mediumOrLarger) {
    return makeResult("viktig", "Bilaga II-sektor på medel eller större nivå – indikation på viktig verksamhetsutövare.", manualTriggers);
  }
  if (isPublicSizeable && mediumOrLarger) {
    return makeResult("viktig", "Offentlig aktör i tillämplig storlek – indikation på viktig verksamhetsutövare.", manualTriggers);
  }

  return makeResult("ej_omfattas",
    "Utifrån angivna svar är verksamheten under storlekströskeln och saknar särskilda flaggor som annars kunde utlösa omfattning.",
    []);
}

function makeResult(label: ResultLabel, rationale: string, manualTriggers: string[]): AssessmentResult {
  const extra = manualTriggers.length
    ? ` Ytterligare punkter att granska manuellt: ${manualTriggers.join(", ")}.`
    : "";
  return {
    label,
    title: RESULT_TITLES[label],
    rationale: rationale + extra,
    nextStep: nextStepFor(label),
  };
}

function nextStepFor(label: ResultLabel): string {
  switch (label) {
    case "vasentlig":
      return "Boka en genomgång eller skicka in dina uppgifter för att få hjälp att verifiera bedömningen mot lagtext och tillsynsmyndighet.";
    case "viktig":
      return "Skicka in dina uppgifter för fortsatt dialog med jurist eller cybersäkerhetskonsult som kan verifiera bedömningen.";
    case "behover_granskas":
      return "Komplettera uppgifterna och låt en jurist eller cybersäkerhetskonsult granska underlaget.";
    case "ej_omfattas":
      return "Spara underlaget som dokumentation. Vid förändringar i verksamheten – gör om bedömningen.";
  }
}
