# AGENTS.md

## Project
- Portfolio v2 is a static Astro 5, TypeScript, React and Tailwind CSS 4 site. Reuse the source-owned UI components and CSS theme tokens; avoid adding runtime services or client hydration for static content.
- `src/data/resume.ts` holds resume and project metadata. `src/data/showcases.ts` holds the featured project narratives; keep the project list and features consistent. `src/pages/resume.pdf.ts` generates the downloadable resume. `src/data/engineering-notes.ts` is the typed source of dated external articles and source-based static case studies.
- Use semantic HTML, descriptive alternative text, visible focus, responsive layouts, dark/light themes, and reduced-motion support. Preserve the compact print résumé.

## Development and validation
- Use Node.js 22.12+ and npm. Run `npm install`, `npm run check`, `npm run build`, then `npm test`; the tests read static output in `dist/`.
- Add static regression coverage for new content, links, assets, and navigation. Review Vercel previews at mobile and desktop sizes before merging.
- Use verified public sources for career facts and projects. Never invent results, usage, benchmarks, screenshots, or production capabilities. Clearly label original architecture illustrations; use only real, appropriately optimized product artwork.
- Keep changes scoped to the relevant issue; use a feature branch and PR, and link the issue. Follow conventional commit messages where practical.

## Deployment
- Keep the existing `yuanchen.io` GitHub Pages production site and legacy paths (especially `/StageLight/`) unchanged until an explicit production migration.
- Vercel is for development previews. Keep the site compatible with static GitHub Pages hosting; avoid platform-specific server dependencies.
- Do not commit secrets, private contact details, unrelated files, or credentials.
