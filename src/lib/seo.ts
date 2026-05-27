export const SITE_URL = "https://cybersakerhetslagen.nu";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
};

export function seo(i: SeoInput) {
  const url = `${SITE_URL}${i.path}`;
  const ogTitle = i.ogTitle ?? i.title;
  const ogDescription = i.ogDescription ?? i.description;
  const image = i.image ?? DEFAULT_OG_IMAGE;
  return {
    meta: [
      { title: i.title },
      { name: "description", content: i.description },
      { name: "robots", content: "index,follow" },
      { property: "og:site_name", content: "cybersakerhetslagen.nu" },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: ogTitle },
      { property: "og:locale", content: "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: ogTitle },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

type RegistryLike = {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
};

export function seoFromEntry(e: RegistryLike) {
  return {
    meta: [
      { title: e.title },
      { name: "description", content: e.description },
      { name: "robots", content: e.robots },
      { property: "og:site_name", content: "cybersakerhetslagen.nu" },
      { property: "og:title", content: e.ogTitle },
      { property: "og:description", content: e.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: e.canonical },
      { property: "og:image", content: e.ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: e.ogTitle },
      { property: "og:locale", content: "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: e.twitterTitle },
      { name: "twitter:description", content: e.twitterDescription },
      { name: "twitter:image", content: e.twitterImage },
      { name: "twitter:image:alt", content: e.twitterTitle },
    ],
    links: [{ rel: "canonical", href: e.canonical }],
  };
}

export function jsonLd(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}
