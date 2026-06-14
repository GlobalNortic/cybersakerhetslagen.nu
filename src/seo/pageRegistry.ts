/**
 * Central page registry för publika sidor på cybersakerhetslagen.nu.
 *
 * Publika sidor ska läggas till här först. Sitemap, metadata och framtida
 * prerender ska utgå från denna lista. API-routes ska aldrig hanteras här.
 *
 * OBS: Detta registry är en strukturell källa-av-sanning. Det ändrar inte
 * runtime-beteende på egen hand – route-komponenter och sitemap kan koppla
 * upp sig mot det här i ett senare steg.
 */

import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { INDUSTRIES } from "@/lib/industries";

export type PageEntry = {
  path: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
  sitemap: boolean;
  lastmod: string;
  prerenderReady: boolean;
  /** Markeras true för dynamiska mönster som /branscher/[slug]. */
  dynamic?: boolean;
};

const OG_IMAGE = DEFAULT_OG_IMAGE; // https://cybersakerhetslagen.nu/og-default.png
const ROBOTS_DEFAULT = "index,follow";
const DEFAULT_LASTMOD = "2026-06-14";
const SEO_INDUSTRY_NAMES: Record<string, string> = {
  "ikt-tjanster": "IKT-tjänster",
  finansmarknadsinfrastruktur: "Finansinfrastruktur",
  kemikalier: "Kemikalier",
  livsmedel: "Livsmedel",
};

function entry(p: Omit<PageEntry, "canonical" | "ogImage" | "twitterImage" | "twitterTitle" | "twitterDescription" | "robots" | "lastmod"> & Partial<Pick<PageEntry, "canonical" | "ogImage" | "twitterImage" | "twitterTitle" | "twitterDescription" | "robots" | "lastmod">>): PageEntry {
  return {
    canonical: p.canonical ?? `${SITE_URL}${p.path === "/" ? "/" : p.path}`,
    ogImage: p.ogImage ?? OG_IMAGE,
    twitterImage: p.twitterImage ?? OG_IMAGE,
    twitterTitle: p.twitterTitle ?? p.ogTitle,
    twitterDescription: p.twitterDescription ?? p.ogDescription,
    robots: p.robots ?? ROBOTS_DEFAULT,
    lastmod: p.lastmod ?? DEFAULT_LASTMOD,
    ...p,
  };
}

export const PAGE_REGISTRY: PageEntry[] = [
  entry({
    path: "/",
    title: "Cybersäkerhetslagen & NIS2 | Preliminär bedömning",
    description:
      "Få en vägledande indikation på om ditt företag kan omfattas av Cybersäkerhetslagen och NIS2. Gör en preliminär bedömning och få arbetsunderlag.",
    h1: "Ta reda på om ditt företag kan omfattas av Cybersäkerhetslagen",
    ogTitle: "Cybersäkerhetslagen & NIS2 för företag",
    ogDescription:
      "Gör en preliminär bedömning av om din organisation kan omfattas av Cybersäkerhetslagen och NIS2. Vägledande indikation, inte juridisk rådgivning.",
    sitemap: true,
    prerenderReady: true,
  }),
  entry({
    path: "/ikrafttradandedatum",
    title: "När trädde cybersäkerhetslagen i kraft? | 15 januari 2026",
    description:
      "Cybersäkerhetslagen (2025:1506) trädde i kraft den 15 januari 2026. Se kort svar, källor och nästa steg för NIS2-bedömning.",
    h1: "När trädde cybersäkerhetslagen i kraft?",
    ogTitle: "Cybersäkerhetslagen trädde i kraft den 15 januari 2026",
    ogDescription:
      "Kort svar om ikraftträdandedatum för Cybersäkerhetslagen (2025:1506), med källor och praktiskt nästa steg.",
    sitemap: true,
    prerenderReady: true,
  }),
  entry({
    path: "/bedomning",
    title: "Preliminär NIS2-bedömning | Cybersäkerhetslagen",
    description:
      "Svara på frågor om organisation, sektor och storlek och få en vägledande indikation på om ni kan omfattas av Cybersäkerhetslagen.",
    h1: "Gör en preliminär NIS2-bedömning",
    ogTitle: "Gör en preliminär NIS2-bedömning",
    ogDescription:
      "Få ett praktiskt arbetsunderlag inför juridisk eller teknisk granskning. Bedömningen är vägledande och ersätter inte juridisk rådgivning.",
    sitemap: true,
    prerenderReady: true,
  }),
  entry({
    path: "/branscher",
    title: "Branscher som kan omfattas av NIS2 | Cybersäkerhetslagen",
    description:
      "Se vilka sektorer och branscher som kan beröras av Cybersäkerhetslagen och NIS2. Få en praktisk översikt inför vidare granskning.",
    h1: "Branscher och sektorer som kan beröras av NIS2",
    ogTitle: "Branscher som kan omfattas av NIS2",
    ogDescription:
      "Utforska sektorer och branscher som kan beröras av Cybersäkerhetslagen. Informationen är vägledande och behöver verifieras vid osäkerhet.",
    sitemap: true,
    prerenderReady: true,
  }),
  entry({
    path: "/nis2-konsult",
    title: "NIS2-konsult för företag | Cybersäkerhetslagen",
    description:
      "Behöver ni hjälp att tolka NIS2 och Cybersäkerhetslagen? Få stöd med preliminär bedömning, gap-analys, dokumentation och nästa steg.",
    h1: "Hitta stöd för NIS2 och Cybersäkerhetslagen",
    ogTitle: "NIS2-konsult för företag",
    ogDescription:
      "Få hjälp att gå från preliminär bedömning till praktiskt arbetsunderlag, juridisk granskning eller teknisk gap-analys.",
    sitemap: true,
    prerenderReady: true,
  }),
  entry({
    path: "/for-konsulter",
    title: "För NIS2-konsulter och leverantörer | cybersakerhetslagen.nu",
    description:
      "Arbetar du med NIS2, cybersäkerhet eller juridisk granskning? Anmäl intresse för relevanta förfrågningar från svenska organisationer.",
    h1: "För konsulter och leverantörer inom NIS2",
    ogTitle: "För konsulter och leverantörer inom NIS2",
    ogDescription:
      "Anmäl intresse för att ta emot relevanta förfrågningar från organisationer som behöver stöd kring Cybersäkerhetslagen och NIS2.",
    sitemap: true,
    prerenderReady: true,
  }),
  entry({
    path: "/kontakt",
    title: "Kontakt för NIS2-bedömning | Cybersäkerhetslagen",
    description:
      "Kontakta cybersakerhetslagen.nu om preliminär NIS2-bedömning, vägledning kring Cybersäkerhetslagen eller partnerförfrågningar.",
    h1: "Kontakta cybersakerhetslagen.nu",
    ogTitle: "Kontakta cybersakerhetslagen.nu",
    ogDescription:
      "Har du frågor om preliminär NIS2-bedömning, Cybersäkerhetslagen eller partnerflödet? Kontakta oss för nästa steg.",
    sitemap: true,
    prerenderReady: true,
  }),
  entry({
    path: "/integritet",
    title: "Integritet och personuppgifter | Cybersäkerhetslagen",
    description:
      "Läs hur cybersakerhetslagen.nu hanterar personuppgifter när du använder bedömningen, skickar en förfrågan eller kontaktar oss.",
    h1: "Integritetspolicy",
    ogTitle: "Integritetspolicy för cybersakerhetslagen.nu",
    ogDescription:
      "Information om hur personuppgifter hanteras vid användning av cybersakerhetslagen.nu och våra formulär.",
    sitemap: true,
    prerenderReady: true,
  }),
  // Dynamiskt mönster – konkreta sidor genereras via getIndustryPage(slug).
  entry({
    path: "/branscher/[slug]",
    title: "[Bransch] och NIS2 | Cybersäkerhetslagen",
    description:
      "Få en vägledande översikt av hur [bransch] kan beröras av Cybersäkerhetslagen och NIS2. Informationen är ett arbetsunderlag inför vidare granskning.",
    h1: "[Bransch] och Cybersäkerhetslagen",
    canonical: `${SITE_URL}/branscher/[slug]`,
    ogTitle: "[Bransch] och NIS2",
    ogDescription:
      "Se hur [Bransch] kan beröras av Cybersäkerhetslagen. Vägledande information, inte juridisk rådgivning.",
    sitemap: false,
    prerenderReady: true,
    dynamic: true,
  }),
];

/** Slå upp en statisk sida i registryt. */
export function getPage(path: string): PageEntry | undefined {
  return PAGE_REGISTRY.find((p) => p.path === path && !p.dynamic);
}

/** Generera en konkret PageEntry för en branschsida utifrån slug. */
export function getIndustryPage(slug: string): PageEntry | undefined {
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  if (!industry) return undefined;
  const name = industry.name;
  const seoName = SEO_INDUSTRY_NAMES[slug] ?? name;
  const baseTitle = `${seoName} och NIS2 | Cybersäkerhetslagen`;
  const expandedTitle = `${seoName} och NIS2 för företag | Cybersäkerhetslagen`;
  return entry({
    path: `/branscher/${slug}`,
    title: baseTitle.length < 45 ? expandedTitle : baseTitle,
    description: `Se hur ${seoName.toLowerCase()} kan beröras av Cybersäkerhetslagen och NIS2. Få en vägledande översikt för företag inför vidare granskning.`,
    h1: `${name} och Cybersäkerhetslagen`,
    ogTitle: `${seoName} och NIS2`,
    ogDescription: `Se hur ${seoName} kan beröras av Cybersäkerhetslagen. Vägledande information, inte juridisk rådgivning.`,
    sitemap: true,
    prerenderReady: true,
  });
}

/** Alla konkreta sidor som ska finnas i sitemap (statiska + dynamiska branschsidor). */
export function getSitemapPages(): PageEntry[] {
  const statics = PAGE_REGISTRY.filter((p) => p.sitemap && !p.dynamic);
  const industries = INDUSTRIES
    .map((i) => getIndustryPage(i.slug))
    .filter((p): p is PageEntry => Boolean(p));
  return [...statics, ...industries];
}
