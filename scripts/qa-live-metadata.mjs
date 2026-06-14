const SITE_URL = "https://cybersakerhetslagen.nu";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

const TITLE_MIN = 30;
const TITLE_IDEAL_MIN = 45;
const TITLE_IDEAL_MAX = 60;
const TITLE_MAX = 65;

const DESCRIPTION_MIN = 80;
const DESCRIPTION_IDEAL_MIN = 120;
const DESCRIPTION_IDEAL_MAX = 155;
const DESCRIPTION_MAX = 165;

function textLength(value) {
  return [...String(value).trim()].length;
}

function decodeHtml(value) {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#34;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'");
}

function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    decodeHtml(match[1]).trim(),
  );
}

function extractTag(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeHtml(match[1]).trim() : "";
}

function collectDuplicates(rows, field) {
  const groups = new Map();

  for (const row of rows) {
    const value = row[field];
    const current = groups.get(value) ?? [];
    current.push(row.url);
    groups.set(value, current);
  }

  return [...groups.entries()].filter(
    ([value, urls]) => value && urls.length > 1,
  );
}

function addLengthCheck({ errors, warnings, url, value, label, min, idealMin, idealMax, max }) {
  const length = textLength(value);

  if (!value) {
    errors.push(`${url}: missing ${label}.`);
    return;
  }

  if (length < min || length > max) {
    errors.push(`${url}: ${label} is ${length} characters, expected ${min}-${max}.`);
    return;
  }

  if (length < idealMin || length > idealMax) {
    warnings.push(`${url}: ${label} is ${length} characters. Ideal range is ${idealMin}-${idealMax}.`);
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache",
      "User-Agent": "cybersakerhetslagen-live-metadata-qa/1.0",
    },
    redirect: "manual",
  });
  const body = await response.text();
  return { response, body };
}

const errors = [];
const warnings = [];
const rows = [];

const { response: sitemapResponse, body: sitemapXml } = await fetchText(SITEMAP_URL);

if (sitemapResponse.status !== 200) {
  console.error(`${SITEMAP_URL}: expected status 200, got ${sitemapResponse.status}.`);
  process.exit(1);
}

const urls = extractSitemapLocs(sitemapXml);

if (urls.length === 0) {
  console.error(`${SITEMAP_URL}: no <loc> URLs found.`);
  process.exit(1);
}

for (const url of urls) {
  try {
    const { response, body } = await fetchText(url);
    const title = extractTag(body, /<title>([\s\S]*?)<\/title>/i);
    const description = extractTag(
      body,
      /<meta\s+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
    );
    const canonical = extractTag(
      body,
      /<link\s+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i,
    );

    rows.push({
      url,
      status: response.status,
      title,
      description,
      canonical,
    });

    if (response.status !== 200) {
      errors.push(`${url}: expected status 200, got ${response.status}.`);
    }

    addLengthCheck({
      errors,
      warnings,
      url,
      value: title,
      label: "title",
      min: TITLE_MIN,
      idealMin: TITLE_IDEAL_MIN,
      idealMax: TITLE_IDEAL_MAX,
      max: TITLE_MAX,
    });

    addLengthCheck({
      errors,
      warnings,
      url,
      value: description,
      label: "meta description",
      min: DESCRIPTION_MIN,
      idealMin: DESCRIPTION_IDEAL_MIN,
      idealMax: DESCRIPTION_IDEAL_MAX,
      max: DESCRIPTION_MAX,
    });

    if (!canonical) {
      errors.push(`${url}: missing canonical.`);
    } else if (canonical !== url) {
      errors.push(`${url}: canonical is ${canonical}.`);
    }
  } catch (error) {
    errors.push(`${url}: request failed: ${error.message}`);
  }
}

for (const [value, urlsWithTitle] of collectDuplicates(rows, "title")) {
  errors.push(`Duplicate title "${value}" on ${urlsWithTitle.join(", ")}.`);
}

for (const [value, urlsWithDescription] of collectDuplicates(rows, "description")) {
  errors.push(
    `Duplicate meta description "${value}" on ${urlsWithDescription.join(", ")}.`,
  );
}

for (const [value, urlsWithCanonical] of collectDuplicates(rows, "canonical")) {
  errors.push(`Duplicate canonical "${value}" on ${urlsWithCanonical.join(", ")}.`);
}

console.log(`Live metadata QA checked ${rows.length} URLs from ${SITEMAP_URL}.`);
console.log(
  `Rules: title ${TITLE_MIN}-${TITLE_MAX} chars (ideal ${TITLE_IDEAL_MIN}-${TITLE_IDEAL_MAX}), description ${DESCRIPTION_MIN}-${DESCRIPTION_MAX} chars (ideal ${DESCRIPTION_IDEAL_MIN}-${DESCRIPTION_IDEAL_MAX}).`,
);

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length > 0) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nLive metadata QA passed.");
}
