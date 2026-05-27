export type Industry = {
  slug: string;
  name: string;
  annex: "I" | "II";
  intro: string;
  why: string;
  oneLine?: string;
  examples?: string[];
  manualReview?: string;
  related?: string[];
  questions: { q: string; a: string }[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "energi",
    name: "Energi",
    annex: "I",
    intro:
      "El, gas, fjärrvärme, olja och vätgas räknas till de mest kritiska sektorerna i NIS2 och svenska Cybersäkerhetslagen. Aktörer i värdekedjan – från produktion och distribution till handel och balansansvar – kan omfattas på olika grunder.",
    oneLine: "Produktion, distribution och handel inom el, gas, fjärrvärme, olja och vätgas.",
    why: "Sektorn är listad i Bilaga I, vilket innebär att medelstora och större aktörer typiskt sett kan omfattas som väsentliga verksamhetsutövare. Mindre bolag kan också omfattas om de har en särskild roll i försörjningskedjan.",
    examples: [
      "SCADA- och styrsystem för produktion och distribution",
      "Mätvärdes- och avräkningssystem",
      "Handelsplattformar och balansansvarssystem",
      "Fjärrkontroll av ställverk, pumpstationer och värmecentraler",
    ],
    manualReview:
      "Roll i värdekedjan, ägarstrukturer och beroenden till andra operatörer gör att klassificeringen sällan är självklar. En preliminär bedömning behöver granskas mot lagtext, sektorföreskrifter och Energimyndighetens vägledning.",
    related: ["digital-infrastruktur", "ikt-tjanster"],
    questions: [
      { q: "Räknas vi som väsentlig verksamhetsutövare automatiskt?", a: "Storlek och roll i värdekedjan styr. Resultatet från bedömningen är en vägledande indikation som behöver granskas vidare." },
      { q: "Hur påverkas mindre energibolag?", a: "Mikro- och småföretag undantas i regel, men särskilda flaggor kan ändra bedömningen. Verifiera mot lagtext, myndighetsinformation eller rådgivare." },
      { q: "Gäller andra regelverk parallellt?", a: "Sektorspecifika regler från Energimyndigheten och Svenska kraftnät kan tillkomma. Bedömningen ersätter inte juridisk granskning." },
    ],
  },
  {
    slug: "transporter",
    name: "Transporter",
    annex: "I",
    intro: "Luft-, sjö-, järnvägs- och vägtransport ingår i Bilaga I. Förutom transportörer kan terminal- och infrastrukturbolag omfattas, liksom aktörer som driver trafikledning eller bokningssystem.",
    oneLine: "Luft-, sjö-, järnvägs- och vägtransport samt tillhörande infrastruktur.",
    why: "Operatörer av kritisk infrastruktur i transportsektorn kan utgöra väsentliga verksamhetsutövare. Beroenden mot IT-system för bokning, trafikledning och säkerhet gör cyberrisken hög.",
    examples: [
      "Trafikledning och dispatchsystem",
      "Boknings- och biljettplattformar",
      "Hamn-, flygplats- och terminalstyrsystem",
      "Telematik och fordonsuppkoppling",
    ],
    manualReview:
      "Rollen som operatör, terminalägare eller IT-leverantör avgör vilken kategori som kan bli aktuell. Storleksregler och nationella tillägg behöver granskas särskilt.",
    related: ["digital-infrastruktur", "tillverkning"],
    questions: [
      { q: "Räknas mindre transportbolag in?", a: "Storleksregler styr. Mikro- och småföretag undantas i regel om inte särskilda flaggor är uppfyllda." },
      { q: "Gäller det åkerier och budbolag?", a: "Det beror på roll i kedjan, storlek och om verksamheten utgör kritisk infrastruktur. Granskas individuellt." },
      { q: "Vad händer om vi är underleverantör till en operatör?", a: "Underleverantörer kan beröras indirekt via leveranskedjekrav. Resultatet är en vägledande indikation." },
    ],
  },
  {
    slug: "halso-och-sjukvard",
    name: "Hälso- och sjukvård",
    annex: "I",
    intro: "Vårdgivare, laboratorier, EU-referenslaboratorier och vissa kritiska medicinska leverantörer kan omfattas. Både offentliga och privata aktörer behöver göra en bedömning.",
    oneLine: "Vårdgivare, laboratorier och kritiska medicinska leverantörer.",
    why: "Sektorn är listad i Bilaga I på grund av samhällsviktig funktion och risker för liv och hälsa. Avbrott i journalsystem, medicinteknik eller laboratorier kan få allvarliga konsekvenser.",
    examples: [
      "Journal- och vårdadministrativa system",
      "Medicintekniska produkter med nätverksanslutning",
      "Laboratorieinformationssystem (LIS)",
      "Bokning, triage och e-tjänster för patienter",
    ],
    manualReview:
      "Vårdgivarbegreppet, regional tillsyn och patientdatalagen samverkar med Cybersäkerhetslagen. Klassificeringen behöver granskas av jurist med vårderfarenhet.",
    related: ["digital-infrastruktur", "ikt-tjanster"],
    questions: [
      { q: "Gäller det privata vårdgivare?", a: "Ja, om storlek och verksamhetsområde uppfylls. Granskas individuellt mot lagtext och sektorföreskrifter." },
      { q: "Hur påverkas regioner och kommuner?", a: "Offentlig vård kan omfattas både via vårdgivarrollen och via offentlig förvaltning. Båda spåren behöver granskas." },
      { q: "Räknas leverantörer av medicinteknik?", a: "Vissa leverantörer kan omfattas som viktig verksamhetsutövare beroende på produkt och storlek." },
    ],
  },
  {
    slug: "digital-infrastruktur",
    name: "Digital infrastruktur",
    annex: "I",
    intro: "DNS-leverantörer, registreringsenheter för toppdomäner, datacenter, molntjänster, CDN och kvalificerade betrodda tjänster ingår i Bilaga I. Vissa roller kan triggas oberoende av storlek.",
    oneLine: "DNS, TLD-register, datacenter, molntjänster, CDN och betrodda tjänster.",
    why: "Funktionerna är grundläggande för internets stabilitet. Vissa roller (TLD-register, DNS, kvalificerade betrodda tjänster) kan klassas som väsentliga oavsett storlek.",
    examples: [
      "Auktoritativa och rekursiva DNS-tjänster",
      "Datacenter och colocation",
      "Publika moln- och plattformstjänster (IaaS/PaaS)",
      "CDN och edge-nätverk",
    ],
    manualReview:
      "Tjänstedefinitioner i lagtexten är detaljerade och rollen som leverantör behöver granskas exakt. Flera roller kan vara aktuella samtidigt.",
    related: ["ikt-tjanster", "energi"],
    questions: [
      { q: "Spelar storlek alltid roll?", a: "Nej, vissa roller kan klassas som väsentliga oavsett storlek. Resultatet är en vägledande indikation." },
      { q: "Räknas vi som molntjänsteleverantör?", a: "Det beror på tjänstemodell och kundavtal. Definitionen behöver granskas mot lagtexten." },
      { q: "Hur hanteras gränsöverskridande tjänster?", a: "Etableringsort och huvudsaklig verksamhet styr jurisdiktionen. Granskas särskilt." },
    ],
  },
  {
    slug: "ikt-tjanster",
    name: "Förvaltning av IKT-tjänster (B2B)",
    annex: "I",
    intro: "Hanterade IT-tjänster (MSP) och hanterade säkerhetstjänster (MSSP) som levereras till andra organisationer ingår i Bilaga I på grund av leveranskedjerisk.",
    oneLine: "MSP- och MSSP-tjänster som driftar IT eller säkerhet åt andra organisationer.",
    why: "Eftersom kunderna kan vara väsentliga eller viktiga verksamhetsutövare påverkar leverantörens säkerhetsnivå hela värdekedjan.",
    examples: [
      "Drift och övervakning av kunders IT-miljö",
      "SOC- och MDR-tjänster",
      "Hanterad backup, identitet och nätverk",
      "Helpdesk och fjärradministration med privilegierad åtkomst",
    ],
    manualReview:
      "Definitionen av MSP och MSSP är central. Tjänsteinnehåll, åtkomstnivå och kundberoende avgör – inte bara titeln på erbjudandet.",
    related: ["digital-infrastruktur", "halso-och-sjukvard"],
    questions: [
      { q: "Räknas vi som MSP?", a: "Det beror på tjänsteinnehåll och kundens beroende av tjänsten. Granskas separat." },
      { q: "Påverkas vi av kundens klassificering?", a: "Ja, krav i leveranskedjan kan göra att kunder ställer NIS2-relaterade krav även om ni inte själva omfattas direkt." },
      { q: "Vad gäller för konsulter utan driftansvar?", a: "Rena rådgivande uppdrag faller normalt utanför, men gränsdragningen behöver granskas." },
    ],
  },
  {
    slug: "tillverkning",
    name: "Tillverkning",
    annex: "II",
    intro: "Tillverkning av medicintekniska produkter, fordon, elektronik, maskiner med flera områden listas i Bilaga II. Sektorn är bred och bedömningen behöver göras per undersektor.",
    oneLine: "Tillverkning av medicinteknik, fordon, elektronik, maskiner och liknande.",
    why: "Sektorn är listad i Bilaga II som viktig verksamhetsutövare för medelstora och större aktörer. OT-miljöer och leveranskedjor är typiska riskområden.",
    examples: [
      "MES- och produktionsstyrsystem",
      "Industriella styrsystem (ICS/SCADA, PLC)",
      "PLM- och konstruktionsdata",
      "Lager-, logistik- och spårbarhetssystem",
    ],
    manualReview:
      "Många tillverkare har blandade verksamheter och leveranser till kritiska sektorer. Undersektor och storlek behöver granskas mot lagtextens definitioner.",
    related: ["transporter", "ikt-tjanster"],
    questions: [
      { q: "Vilken tillverkning omfattas?", a: "Specifika undersektorer pekas ut i Bilaga II. Verifiera mot lagtext, myndighetsinformation eller rådgivare." },
      { q: "Påverkas underleverantörer?", a: "Indirekt via krav från kunder i kritiska sektorer. Direkt påverkan beror på egen klassificering." },
      { q: "Räknas OT-miljöer separat?", a: "OT är inte en egen kategori men utgör en viktig riskyta vid bedömning av åtgärder." },
    ],
  },
  {
    slug: "bankverksamhet",
    name: "Bankverksamhet",
    annex: "I",
    intro: "Kreditinstitut enligt EU:s definition omfattas som väsentliga verksamhetsutövare i Bilaga I.",
    oneLine: "Kreditinstitut och banker som omfattas av EU:s banklagstiftning.",
    why: "Bilaga I pekar ut bankverksamhet som högkritisk sektor. Parallellt gäller DORA för digital operativ motståndskraft.",
    questions: [{ q: "Gäller DORA i stället?", a: "DORA är specialreglering för finanssektorn och kan ha företräde inom sitt område. Båda regelverken behöver granskas." }],
  },
  {
    slug: "finansmarknadsinfrastruktur",
    name: "Finansmarknadsinfrastruktur",
    annex: "I",
    intro: "Operatörer av handelsplatser och centrala motparter (CCP) ingår i Bilaga I.",
    oneLine: "Handelsplatser, centrala motparter och liknande infrastruktur på finansmarknaden.",
    why: "Funktionerna är kritiska för finansiell stabilitet och listas som väsentliga i Bilaga I.",
    questions: [{ q: "Räknas vi som finansmarknadsinfrastruktur?", a: "Definitionen följer EU:s finanslagstiftning. Granskas mot lagtext och Finansinspektionens vägledning." }],
  },
  {
    slug: "dricksvatten",
    name: "Dricksvatten",
    annex: "I",
    intro: "Leverantörer och distributörer av dricksvatten avsett för mänsklig konsumtion ingår i Bilaga I.",
    oneLine: "Produktion och distribution av dricksvatten.",
    why: "Försörjning av dricksvatten är samhällskritisk och listas som väsentlig sektor i Bilaga I.",
    questions: [{ q: "Gäller det kommunala vattenverk?", a: "Ja, kommunala VA-aktörer kan omfattas. Storlek och roll styr klassificeringen." }],
  },
  {
    slug: "avloppsvatten",
    name: "Avloppsvatten",
    annex: "I",
    intro: "Företag som samlar in, bortskaffar eller behandlar avloppsvatten kan omfattas av Bilaga I.",
    oneLine: "Insamling, bortskaffande och behandling av avloppsvatten.",
    why: "Avloppshantering är kritisk för folkhälsa och miljö och listas i Bilaga I när det utgör en väsentlig del av verksamheten.",
    questions: [{ q: "Gäller det alla VA-bolag?", a: "Bedömning behöver göras utifrån verksamhetens omfattning och om avloppshantering är en väsentlig del." }],
  },
  {
    slug: "rymden",
    name: "Rymden",
    annex: "I",
    intro: "Operatörer av markbaserad rymdinfrastruktur som stödjer rymdbaserade tjänster ingår i Bilaga I.",
    oneLine: "Operatörer av markbaserad infrastruktur som stödjer rymdtjänster.",
    why: "Rymdbaserade tjänster är beroende av kritisk markinfrastruktur, vilket motiverar klassificeringen som väsentlig sektor.",
    questions: [{ q: "Vilka aktörer omfattas?", a: "Operatörer som äger, förvaltar eller driver markstationer och liknande infrastruktur. Granskas individuellt." }],
  },
  {
    slug: "offentlig-forvaltning",
    name: "Offentlig förvaltning",
    annex: "I",
    intro: "Statliga myndigheter, kommuner och regioner kan omfattas.",
    oneLine: "Statliga myndigheter, kommuner och regioner.",
    why: "Offentlig förvaltning ingår i Bilaga I i Cybersäkerhetslagen.",
    questions: [{ q: "Omfattas alla kommuner?", a: "Storleksregler tillämpas men särskilda nationella tillägg kan gälla." }],
  },
  {
    slug: "post-och-budtjanster",
    name: "Post- och budtjänster",
    annex: "II",
    intro: "Postoperatörer och bud- och kurirföretag ingår i Bilaga II som viktiga verksamhetsutövare.",
    oneLine: "Postoperatörer samt bud- och kurirföretag.",
    why: "Sektorn listas i Bilaga II för medelstora och större aktörer.",
    questions: [{ q: "Räknas mindre budbolag?", a: "Mikro- och småföretag undantas i regel om inte särskilda flaggor är uppfyllda." }],
  },
  {
    slug: "avfallshantering",
    name: "Avfallshantering",
    annex: "II",
    intro: "Företag som hanterar avfall som huvudsaklig ekonomisk verksamhet ingår i Bilaga II.",
    oneLine: "Insamling, transport och behandling av avfall.",
    why: "Avfallshantering är listad som viktig sektor i Bilaga II.",
    questions: [{ q: "Gäller det återvinningscentraler?", a: "Det beror på roll och storlek. Granskas individuellt." }],
  },
  {
    slug: "kemikalier",
    name: "Tillverkning, produktion och distribution av kemikalier",
    annex: "II",
    intro: "Tillverkning, produktion och distribution av kemikalier.",
    oneLine: "Tillverkning, produktion och distribution av kemikalier.",
    why: "Bilaga II viktig sektor med hänsyn till leveranskedja och risker.",
    questions: [{ q: "Gäller det handlare?", a: "Distribution kan omfattas beroende på roll och storlek." }],
  },
  {
    slug: "livsmedel",
    name: "Produktion, bearbetning och distribution av livsmedel",
    annex: "II",
    intro: "Företag som arbetar med produktion, bearbetning och distribution av livsmedel kan omfattas.",
    oneLine: "Produktion, bearbetning och distribution av livsmedel.",
    why: "Bilaga II inkluderar stora aktörer i livsmedelskedjan.",
    questions: [{ q: "Gäller det restauranger?", a: "I regel inte. Fokus ligger på produktion, bearbetning och grossistled." }],
  },
  {
    slug: "digitala-leverantorer",
    name: "Digitala leverantörer",
    annex: "II",
    intro: "Leverantörer av onlinemarknadsplatser, sökmotorer och plattformar för sociala nätverkstjänster ingår i Bilaga II.",
    oneLine: "Onlinemarknadsplatser, sökmotorer och plattformar för sociala nätverkstjänster.",
    why: "Digitala leverantörer listas som viktig sektor i Bilaga II.",
    questions: [{ q: "Räknas mindre plattformar?", a: "Storleksregler tillämpas. Mikro- och småföretag undantas i regel." }],
  },
  {
    slug: "forskning",
    name: "Forskning",
    annex: "II",
    intro: "Forskningsorganisationer som inte är högskolor kan omfattas.",
    oneLine: "Forskningsorganisationer utanför högskolesektorn.",
    why: "Bilaga II viktig sektor i särskilda fall.",
    questions: [{ q: "Gäller det universitet?", a: "Lärosäten har ofta separata regler. Granskas särskilt." }],
  },
];


export const HOMEPAGE_INDUSTRIES = ["energi","transporter","halso-och-sjukvard","digital-infrastruktur","ikt-tjanster","tillverkning"];

export const CITIES = [
  { slug: "stockholm", name: "Stockholm" },
  { slug: "goteborg", name: "Göteborg" },
  { slug: "malmo", name: "Malmö" },
  { slug: "uppsala", name: "Uppsala" },
  { slug: "vasteras", name: "Västerås" },
  { slug: "orebro", name: "Örebro" },
  { slug: "linkoping", name: "Linköping" },
  { slug: "helsingborg", name: "Helsingborg" },
  { slug: "jonkoping", name: "Jönköping" },
  { slug: "umea", name: "Umeå" },
];
