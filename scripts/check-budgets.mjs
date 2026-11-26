import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = "dist";
const collect = path => readdirSync(path, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? collect(join(path, entry.name)) : [join(path, entry.name)]);
const files = collect(root);
const limits = [
  { label: "JavaScript", extensions: [".js", ".mjs"], max: 30 * 1024 },
  { label: "CSS", extensions: [".css"], max: 100 * 1024 },
  { label: "Fonts", extensions: [".woff2", ".woff", ".ttf", ".otf"], max: 700 * 1024 },
  { label: "Images", extensions: [".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif"], max: 200 * 1024 },
];
const size = paths => paths.reduce((sum, path) => sum + statSync(path).size, 0);
let failed = false;
for (const { label, extensions, max } of limits) {
  const matches = files.filter(path => extensions.includes(extname(path).toLowerCase()));
  const bytes = size(matches);
  console.log(`${label}: ${(bytes / 1024).toFixed(1)} KiB / ${(max / 1024).toFixed(0)} KiB (${matches.length} files)`);
  if (bytes > max || (label === "Fonts" && !matches.length)) {
    console.error(`::error::${label} exceeds its budget or required font files are missing`);
    failed = true;
  }
}
for (const path of files.filter(path => path.endsWith(".html"))) {
  const html = readFileSync(path, "utf8");
  if (html.includes("astro-island")) {
    console.error(`::error file=${path}::Unexpected client-side hydration`);
    failed = true;
  }
  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs]) => !attrs.includes("application/ld+json"))
    .reduce((sum, [, , source]) => sum + Buffer.byteLength(source), 0);
  if (inlineScripts > 10 * 1024) {
    console.error(`::error file=${path}::Inline JS exceeds 10 KiB`);
    failed = true;
  }
  if (Buffer.byteLength(html) > 100 * 1024) {
    console.error(`::error file=${path}::HTML exceeds 100 KiB`);
    failed = true;
  }
}
console.log(`Total build: ${(size(files) / 1024).toFixed(1)} KiB`);
if (size(files) > 1200 * 1024) {
  console.error("::error::Total build exceeds 1,200 KiB");
  failed = true;
}
if (failed) process.exitCode = 1;
