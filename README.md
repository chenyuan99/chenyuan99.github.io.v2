# Yuan Chen — Portfolio v2

A static, code-first resume and contact site built with Astro, React, Tailwind CSS 4, and source-owned shadcn/ui components.

## Develop

Node.js 22 or later is recommended.

```sh
npm ci
npm run dev
npm run check
npm run build
npm test
```

Edit `src/data/resume.ts` to update the website and generated PDF together. The site uses static rendering, with small progressively enhanced scripts for theme, print, and email. No React hydration or backend is required.

## Deploy on Vercel

Import this repository in Vercel, select the Astro framework preset, use Node.js 22, and deploy. Builds produce `dist/`. Vercel will deploy subsequent pushes to the production branch automatically after the project is connected.

Set the optional `SITE_URL` environment variable to your intended canonical URL. The configuration uses Vercel's production deployment URL when available, otherwise `https://yuanchen.io`. No custom domain or DNS change is needed for previews.

Before switching yuanchen.io to v2, preserve legacy destinations, particularly the independently hosted StageLight pages; the original repository remains unchanged. Connect the final domain only after verifying the preview. 

## Content migration

Migrated the real education, professional experience, and the portfolio entries from [v1](https://github.com/chenyuan99/chenyuan99.github.io), with verified public profile links and research records. AcademicPages sample publications, sample skills, and old personal address/phone are intentionally excluded. The resume PDF is generated at build time at `/resume.pdf`. Use the email button for a mailto link, or LinkedIn as an alternative. Email obfuscation discourages basic HTML scrapers but is not a guarantee against automated harvesting.

## Quality checks

GitHub Actions installs the committed lockfile with `npm ci`, checks types, builds the static site, and runs Node regression tests, Playwright desktop/mobile tests, axe WCAG A/AA checks, visual comparisons and Lighthouse budgets.

```sh
npm ci
npm run check
npm run build
npm test
npm run test:budget
npx playwright install --with-deps chromium
npm run test:e2e
npm run test:lighthouse
```

### Review and update visual baselines

CI uses Ubuntu 24.04 and the locked Playwright Chromium version. Baselines live in `tests/e2e/__screenshots__` (desktop/mobile, light/dark, and printable résumé). For intentional design changes, run `npm run test:visual:update` in a matching Linux environment, review the before/after screenshots, and commit only expected changes. Never refresh baselines merely to make a failing test pass. The CI artifact contains Playwright HTML reports, axe results, screenshot diffs, a browser-generated print PDF and Lighthouse reports. Inspect desktop/mobile previews and print output before merging.

The built-asset script caps raw JavaScript, CSS, fonts, images, document size and overall output, and rejects unexpected hydration. Lighthouse enforces mobile performance, accessibility, best practices, SEO, LCP, CLS, blocking time and transferred-resource budgets using three runs per page. Automated axe checks complement, not replace, keyboard and manual accessibility review. Dependabot checks npm and workflow dependencies weekly.

## Featured project sources

The curated showcase narratives derive from public, project-owned material. No adoption or performance claims are inferred.

- [StageLight product site](https://yuanchen.io/StageLight/) and its [published English page](https://github.com/chenyuan99/chenyuan99.github.io/blob/master/StageLight/en.html). The memory-card image is derived from the site's real [product artwork](https://github.com/chenyuan99/chenyuan99.github.io/blob/master/StageLight/memory-card-share.jpg), resized and compressed for the portfolio.
- [TaxFront source and architecture](https://github.com/chenyuan99/TaxFront#current-architecture). The SVG is an original simplified architectural illustration, not a screenshot.
- [BenchmarkLLM source](https://github.com/chenyuan99/benchmarkLLM/blob/main/lmstudio_benchmark/lmstudio_benchmark/main.py). The SVG is an original measurement-pipeline illustration, not reported benchmark results.

All project cards remain represented in the archive. See `AGENTS.md` for repository guidance.

## Engineering notes

`src/data/engineering-notes.ts` is the typed, dated source for both external articles and internal case studies. The homepage lists published articles (titles, dates, languages and links verified against Medium) separately from source-based case studies. Keep summaries original, cite the public project sources, and avoid employer-confidential details or unverified claims.

Case studies are prerendered at `/notes/<slug>/` with their own canonical URLs, Article JSON-LD, Open Graph metadata and sitemap entries. No client-side hydration is needed to discover or read them.

## Contact icons

The GitHub, LinkedIn, Medium and Google Scholar SVG marks in `ContactIcon.astro` are sourced from [Simple Icons 13.0.0](https://github.com/simple-icons/simple-icons/tree/13.0.0/icons) ([CC0 license](https://github.com/simple-icons/simple-icons/blob/13.0.0/LICENSE.md)). Brand marks identify the linked services and are not an indication of endorsement. The email envelope is a generic icon. All SVGs are local, use theme colors, and are decorative within accessible labeled controls.
