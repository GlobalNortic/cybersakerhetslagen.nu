import { mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const srcDir = resolve(rootDir, "src");
const tempDir = resolve(rootDir, ".tmp-metadata-qa");
const bundledRegistry = resolve(tempDir, "pageRegistry.mjs");
const sitemapPath = resolve(rootDir, "public", "sitemap.xml");

const TITLE_MIN = 30;
const TITLE_IDEAL_MIN = 45;
const TITLE_IDEAL_MAX = 60;
const TITLE_MAX = 65;

const DESCRIPTION_MIN = 80;
const DESCRIPTION_IDEAL_MIN = 120;
const DESCRIPTION_IDEAL_MAX = 155;
const DESCRIPTION_MAX = 165;

const SITE_URL = "https://cybersakerhetslagen.nu";

function textLength(value) {
  return [...String(value).trim()].length;
}

function normalizeUrl(value) {
  return String(value).trim();
}

function routePathFromCanonical(canonical) {
  const url = new URL(canonical);
  return url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
}

function collectDuplicates(pages, field) {
  const groups = new Map();

  for (const page of pages) {
    const value = normalizeUrl(page[field]);
    const current = groups.get(value) ?? [];
    current.push(page.path);
    groups.set(value, current);
  }

  return [...groups.entries()].filter(([, paths]) => paths.length > 1);
}

function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1]
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&apos;", "'")
      .trim(),
  );
}

function addLengthCheck({ errors, warnings, page, field, label, min, idealMin, idealMax, max }) {
  const length = textLength(page[field]);

  if (length < min || length > max) {
    errors.push(
      `${page.path}: ${label} is ${length} characters, expected ${min}-${max}.`,
    );
    return;
  }

  if (length < idealMin || length > idealMax) {
    warnings.push(
      `${page.path}: ${label} is ${length} characters. Ideal range is ${idealMin}-${idealMax}.`,
    );
  }
}

const aliasPlugin = {
  name: "workspace-alias",
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^@\// }, (args) => {
      const basePath = resolve(srcDir, args.path.slice(2));
      const resolvedPath = [basePath, `${basePath}.ts`, `${basePath}.tsx`].find((path) =>
        existsSync(path),
      );

      if (!resolvedPath) {
        return { errors: [{ text: `Could not resolve ${args.path}` }] };
      }

      return { path: resolvedPath };
    });
  },
};

const errors = [];
const warnings = [];

try {
  await mkdir(tempDir, { recursive: true });

  await build({
    entryPoints: [resolve(rootDir, "src", "seo", "pageRegistry.ts")],
    outfile: bundledRegistry,
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node20",
    plugins: [aliasPlugin],
    logLevel: "silent",
  });

  const { getSitemapPages } = await import(pathToFileURL(bundledRegistry).href);
  const pages = getSitemapPages().filter((page) => page.sitemap);
  const sitemapXml = await readFile(sitemapPath, "utf8");
  const sitemapLocs = extractSitemapLocs(sitemapXml);
  const sitemapSet = new Set(sitemapLocs);
  const registryCanonicalSet = new Set(pages.map((page) => normalizeUrl(page.canonical)));

  for (const page of pages) {
    addLengthCheck({
      errors,
      warnings,
      page,
      field: "title",
      label: "title",
      min: TITLE_MIN,
      idealMin: TITLE_IDEAL_MIN,
      idealMax: TITLE_IDEAL_MAX,
      max: TITLE_MAX,
    });

    addLengthCheck({
      errors,
      warnings,
      page,
      field: "description",
      label: "meta description",
      min: DESCRIPTION_MIN,
      idealMin: DESCRIPTION_IDEAL_MIN,
      idealMax: DESCRIPTION_IDEAL_MAX,
      max: DESCRIPTION_MAX,
    });

    if (!page.canonical.startsWith(`${SITE_URL}/`)) {
      errors.push(`${page.path}: canonical must start with ${SITE_URL}.`);
      continue;
    }

    const canonicalPath = routePathFromCanonical(page.canonical);
    if (canonicalPath !== page.path) {
      errors.push(`${page.path}: canonical path is ${canonicalPath}.`);
    }

    if (!sitemapSet.has(page.canonical)) {
      errors.push(`${page.path}: canonical is missing from sitemap.xml.`);
    }
  }

  for (const [value, paths] of collectDuplicates(pages, "title")) {
    errors.push(`Duplicate title "${value}" on ${paths.join(", ")}.`);
  }

  for (const [value, paths] of collectDuplicates(pages, "description")) {
    errors.push(`Duplicate meta description "${value}" on ${paths.join(", ")}.`);
  }

  for (const [value, paths] of collectDuplicates(pages, "canonical")) {
    errors.push(`Duplicate canonical "${value}" on ${paths.join(", ")}.`);
  }

  for (const loc of sitemapLocs) {
    if (!registryCanonicalSet.has(loc)) {
      errors.push(`sitemap.xml contains URL that is missing from pageRegistry: ${loc}.`);
    }
  }

  console.log(`Metadata QA checked ${pages.length} sitemap pages.`);
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
    console.log("\nMetadata QA passed.");
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
