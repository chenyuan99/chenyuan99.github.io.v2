import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const html = readFileSync("dist/index.html","utf8");
test("resume content and accessible section links",()=>{
  for (const section of ["experience","skills","education","projects","research","credentials","contact"]) assert.ok(html.includes('id="'+section+'"'));
  for (const value of ["Yuan Chen","Barclays Investment Bank","Amazon Web Services","Rice University","StageLight","OpenRisk","linkedin.com/in/yuancc"]) assert.ok(html.includes(value),value);
  assert.ok(!html.includes("chenyuancareer@gmail.com"));
  assert.ok(!html.includes("astro-island"),"React components must render statically");
});
test("downloadable PDF",()=>{
  const pdf = readFileSync("dist/resume.pdf"); assert.equal(pdf.subarray(0,5).toString(),"%PDF-");assert.ok(pdf.length>1500);assert.ok(html.includes('href="/resume.pdf"'));
});
test("SEO assets",()=>{
  for (const value of ['rel="canonical"','property="og:image"','application/ld+json','summary_large_image']) assert.ok(html.includes(value),value);
  for (const path of ["dist/og.png","dist/sitemap-index.xml","dist/robots.txt","dist/favicon.svg"]) assert.ok(existsSync(path),path);
  assert.ok(readFileSync("dist/robots.txt","utf8").includes("sitemap-index.xml"));
});

test("editorial design keeps core actions and section navigation", () => {
  for (const value of ['class="hero-title"', 'class="experience-row"', 'data-nav-section="experience"', 'data-nav-section="contact"', 'id="theme-toggle"', 'id="print-resume"']) assert.ok(html.includes(value), value);
  assert.equal((html.match(/<button\b[^>]*\sdata-email-action(?:=|\s|>)/g) ?? []).length, 2);
  assert.ok(html.includes('Backend &amp; distributed systems') || html.includes('Backend & distributed systems'));
});

test("featured projects have narrative, local responsive media, and real links", () => {
  const featured = ["StageLight", "TaxFront", "BenchmarkLLM"];
  for (const name of featured) assert.ok(html.includes('data-featured-project="'+name+'"'), name);
  assert.equal((html.match(/data-featured-project="/g) ?? []).length, featured.length);
  for (const heading of ["Problem", "Approach", "Outcome"]) assert.equal((html.match(new RegExp("<dt>"+heading+"</dt>", "g")) ?? []).length, featured.length);
  for (const [asset, url] of [
    ["stagelight-memory-card.jpg", "https://yuanchen.io/StageLight/"],
    ["taxfront-architecture.svg", "https://github.com/chenyuan99/TaxFront"],
    ["benchmarkllm-architecture.svg", "https://github.com/chenyuan99/benchmarkLLM"],
  ]) {
    const path = "/projects/" + asset;
    assert.ok(existsSync("dist" + path), path);
    assert.ok(readFileSync("dist"+path).length < 120_000, "keep visuals lightweight");
    const image = [...html.matchAll(/<img\b[^>]*>/g)].map(match=>match[0]).find(tag=>tag.includes('src="'+path+'"'));
    assert.ok(image, path);
    for (const attr of [/alt="[^"]{20,}"/, /width="\d+"/, /height="\d+"/, /loading="lazy"/, /decoding="async"/]) assert.match(image, attr);
    assert.ok(html.includes('href="'+url+'"'), url);
  }
});

test("complete project archive retains all previous projects and TaxFront", () => {
  const names = ["StageLight", "TaxFront", "OpenRisk", "BenchmarkLLM", "Card Art Studio", "openPark", "OwlSavesCats", "PaperHub", "Petti.vip", "PolyPredict"];
  for (const name of names) assert.ok(html.includes('data-archive-project="'+name+'"'), name);
  assert.equal((html.match(/data-archive-project="/g) ?? []).length, names.length);
});
