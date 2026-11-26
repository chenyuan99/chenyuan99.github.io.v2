import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of ["/", "/notes/taxfront-document-semantics/", "/notes/benchmarkllm-measurement-boundaries/"]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`WCAG checks: ${route} (${colorScheme})`, async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const report = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      await testInfo.attach("axe-report.json", { body: JSON.stringify(report, null, 2), contentType: "application/json" });
      expect(report.violations.map(({ id, impact, description, nodes }) => ({
        id, impact, description, elements: nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
      }))).toEqual([]);
    });
  }
}
