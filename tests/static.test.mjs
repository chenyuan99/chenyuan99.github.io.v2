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

test("engineering notes are discoverable, dated, linked and static", () => {
  assert.ok(html.includes('id="notes"'));
  assert.ok(html.includes('data-nav-section="notes"'));
  assert.ok(html.includes('href="#notes"'));
  const articles = [
    ["spark-driver-akka-vs-connect", "2026-07-27", "https://yuanchentech.medium.com/reusing-a-spark-driver-from-akka-vs-spark-connect-820049582362"],
    ["apache-gravitino-metadata", "2024-11-28", "https://yuanchentech.medium.com/apache-gravitino-a-groundbreaking-metadata-management-component-6a5337574ec2"],
    ["apache-ignite", "2024-11-17", "https://medium.com/yuans-blog/apache-ignite-%E5%88%86%E5%B8%83%E5%BC%8F%E8%AE%A1%E7%AE%97%E4%B8%8E%E5%AD%98%E5%82%A8%E7%9A%84%E5%BC%BA%E5%A4%A7%E5%88%A9%E5%99%A8-924d3df43007"],
    ["openpark-detection", "2024-05-19", "https://yuanchentech.medium.com/openpark-exploring-various-methods-of-parking-space-detection-in-image-ff30f1f3ee81"],
  ];
  assert.equal((html.match(/data-note-kind="article"/g) ?? []).length, articles.length);
  let previous = -1;
  for (const [slug, date, url] of articles) {
    const start = html.indexOf('data-note-slug="'+slug+'"');
    assert.ok(start > previous, slug);
    const end = html.indexOf("</article>", start);
    const item = html.slice(start, end);
    assert.ok(item.includes('datetime="'+date+'"'), date);
    assert.ok(item.includes('href="'+url+'"'), url);
    previous = start;
  }
  assert.ok(html.includes('lang="zh"'));
  for (const url of ["https://arxiv.org/abs/2410.19211", "https://ieeexplore.ieee.org/document/10808129/", "https://doi.org/10.1007/s40192-019-00162-3"]) assert.ok(html.includes('href="'+url+'"'), url);
});

test("case study routes have unique SEO, public sources and a return link", () => {
  const cases = [
    ["taxfront-document-semantics", "TaxFront: A shared semantic layer", "https://github.com/chenyuan99/TaxFront/blob/main/functions/src/semantic/taxFields.ts"],
    ["benchmarkllm-measurement-boundaries", "BenchmarkLLM: What a local inference benchmark", "https://github.com/chenyuan99/benchmarkLLM/blob/main/lmstudio_benchmark/lmstudio_benchmark/main.py"],
  ];
  assert.equal((html.match(/data-note-kind="case-study"/g) ?? []).length, cases.length);
  const jsonLd = document => JSON.parse(document.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const home = jsonLd(html);
  assert.equal(home["@type"], "Person");
  const sitemap = readFileSync("dist/sitemap-0.xml", "utf8");
  for (const [slug, title, source] of cases) {
    const route = "/notes/"+slug+"/";
    assert.ok(html.includes('href="'+route+'"'), route);
    const page = readFileSync("dist"+route+"index.html", "utf8");
    assert.ok(page.includes(title), title);
    assert.ok(page.includes('href="'+source+'"'), source);
    assert.ok(page.includes('href="/#notes"'));
    assert.ok(page.includes('datetime="2026-11-26"'));
    assert.ok(page.includes('property="og:type" content="article"'));
    const structured = jsonLd(page);
    assert.equal(structured["@type"], "Article");
    assert.equal(structured.datePublished, "2026-11-26");
    assert.equal(structured.author.name, "Yuan Chen");
    assert.ok(structured.url.endsWith(route));
    assert.ok(page.includes('rel="canonical" href="'+structured.url+'"'));
    assert.ok(sitemap.includes(structured.url), "case study in sitemap");
    assert.ok(!page.includes("astro-island"), "no hydration on case-study pages");
  }
});
