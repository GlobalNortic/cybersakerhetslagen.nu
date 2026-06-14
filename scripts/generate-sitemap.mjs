import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const tempDir = resolve(rootDir, ".tmp-sitemap");
const bundledRegistry = resolve(tempDir, "pageRegistry.mjs");
const sitemapPath = resolve(rootDir, "public", "sitemap.xml");
const srcDir = resolve(rootDir, "src");

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
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
const pages = getSitemapPages();
const seen = new Set();

const urls = pages
  .filter((page) => {
    if (!page.sitemap || seen.has(page.canonical)) return false;
    seen.add(page.canonical);
    return true;
  })
  .map(
    (page) =>
      `  <url><loc>${escapeXml(page.canonical)}</loc><lastmod>${escapeXml(page.lastmod)}</lastmod></url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(sitemapPath, sitemap, "utf8");
await rm(tempDir, { recursive: true, force: true });

console.log(`Generated ${sitemapPath} with ${pages.length} URLs.`);
