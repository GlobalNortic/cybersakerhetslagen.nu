import { mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const srcDir = resolve(rootDir, "src");
const distDir = resolve(rootDir, "dist");
const tempDir = resolve(rootDir, ".tmp-html-heads");
const bundledRegistry = resolve(tempDir, "pageRegistry.mjs");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function routeOutputPath(path) {
  if (path === "/") return resolve(distDir, "index.html");
  return resolve(distDir, path.slice(1), "index.html");
}

function stripExistingSeoHead(head) {
  return head
    .replace(/^[ \t]*<title>[\s\S]*?<\/title>\r?\n?/gim, "")
    .replace(/^[ \t]*<meta\s+name=["']description["'][^>]*>\r?\n?/gim, "")
    .replace(/^[ \t]*<meta\s+name=["']robots["'][^>]*>\r?\n?/gim, "")
    .replace(/^[ \t]*<meta\s+property=["']og:[^"']+["'][^>]*>\r?\n?/gim, "")
    .replace(/^[ \t]*<meta\s+name=["']twitter:[^"']+["'][^>]*>\r?\n?/gim, "")
    .replace(/^[ \t]*<link\s+rel=["']canonical["'][^>]*>\r?\n?/gim, "");
}

function seoTags(page) {
  return [
    `    <title>${escapeHtml(page.title)}</title>`,
    `    <meta name="description" content="${escapeHtml(page.description)}" />`,
    `    <meta name="robots" content="${escapeHtml(page.robots)}" />`,
    `    <link rel="canonical" href="${escapeHtml(page.canonical)}" />`,
    `    <meta property="og:site_name" content="cybersakerhetslagen.nu" />`,
    `    <meta property="og:title" content="${escapeHtml(page.ogTitle)}" />`,
    `    <meta property="og:description" content="${escapeHtml(page.ogDescription)}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:url" content="${escapeHtml(page.canonical)}" />`,
    `    <meta property="og:image" content="${escapeHtml(page.ogImage)}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:type" content="image/png" />`,
    `    <meta property="og:image:alt" content="${escapeHtml(page.ogTitle)}" />`,
    `    <meta property="og:locale" content="sv_SE" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeHtml(page.twitterTitle)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(page.twitterDescription)}" />`,
    `    <meta name="twitter:image" content="${escapeHtml(page.twitterImage)}" />`,
    `    <meta name="twitter:image:alt" content="${escapeHtml(page.twitterTitle)}" />`,
  ].join("\n");
}

function applySeoHead(html, page) {
  const match = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (!match) throw new Error("Could not find <head> in dist/index.html");

  const head = stripExistingSeoHead(match[1]);
  const insertion = seoTags(page);
  const marker = /(<meta\s+name=["']theme-color["'][^>]*>\s*)/i;
  const updatedHead = marker.test(head)
    ? head.replace(marker, `$1\n${insertion}\n`)
    : `\n${insertion}\n${head}`;

  return html.replace(match[0], `<head>${updatedHead}</head>`);
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

const { PAGE_REGISTRY } = await import(pathToFileURL(bundledRegistry).href);
const pagesToPrerender = PAGE_REGISTRY.filter(
  (page) => page.sitemap && page.prerenderReady && !page.dynamic,
);
const baseHtml = await readFile(resolve(distDir, "index.html"), "utf8");

for (const page of pagesToPrerender) {
  const outputPath = routeOutputPath(page.path);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, applySeoHead(baseHtml, page), "utf8");
}

await rm(tempDir, { recursive: true, force: true });

console.log(`Generated metadata HTML for ${pagesToPrerender.length} routes.`);
