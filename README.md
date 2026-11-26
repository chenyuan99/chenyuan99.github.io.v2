# Yuan Chen — Portfolio v2

A static, code-first resume and contact site built with Astro, React, Tailwind CSS 4, and source-owned shadcn/ui components.

## Develop

Node.js 22 or later is recommended.

```sh
npm install
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

Migrated the real education, professional experience, and all eight portfolio entries from [v1](https://github.com/chenyuan99/chenyuan99.github.io), with verified public profile links and research records. AcademicPages sample publications, sample skills, and old personal address/phone are intentionally excluded. The resume PDF is generated at build time at `/resume.pdf`. Use the email button for a mailto link, or LinkedIn as an alternative. Email obfuscation discourages basic HTML scrapers but is not a guarantee against automated harvesting.

## Quality checks

GitHub Actions checks types, builds the site, and tests the static output (PDF, metadata, sitemap and content).
