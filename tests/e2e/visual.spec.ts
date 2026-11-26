import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

for (const colorScheme of ["light", "dark"] as const) {
  test(`@visual complete portfolio (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await page.evaluate(async () => {
      document.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach(image => { image.loading = "eager"; });
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(image => image.decode()));
    });
    await expect(page).toHaveScreenshot(`portfolio-${colorScheme}.png`, { fullPage: true });
  });
}

test("@visual printed résumé hides screen-only content and produces Letter PDF", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Chromium desktop print baseline");
  await page.goto("/");
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  for (const section of ["#projects", "#notes", "#research", "#contact"]) await expect(page.locator(section)).toBeHidden();
  const output = testInfo.outputPath("printed-resume.pdf");
  const bytes = await page.pdf({ path: output, printBackground: true, preferCSSPageSize: true });
  const pdf = await PDFDocument.load(bytes);
  expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1);
  expect(pdf.getPageCount()).toBeLessThanOrEqual(2);
  expect(pdf.getPage(0).getSize()).toEqual({ width: 612, height: 792 });
  await testInfo.attach("printed-resume.pdf", { path: output, contentType: "application/pdf" });
  await expect(page).toHaveScreenshot("print-resume.png", { fullPage: true });
});
