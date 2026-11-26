import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

test("theme follows system preference, toggles, persists and supports keyboard", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const theme = page.getByRole("button", { name: "Toggle dark mode" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  await theme.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(theme).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(theme).toHaveAttribute("aria-pressed", "false");
  await theme.focus();
  await page.keyboard.press("Space");
  await expect(theme).toHaveAttribute("aria-pressed", "true");
});

test("keyboard skip link and hash navigation stay accessible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();

  const nav = page.getByRole("navigation", { name: "Main navigation" });
  for (const section of ["experience", "projects", "notes", "research"]) {
    const link = nav.locator(`a[href="#${section}"]`);
    await link.click();
    await expect(page).toHaveURL(new RegExp("#" + section + "$"));
    await expect(link).toHaveAttribute("aria-current", "location");
    await expect.poll(() => page.locator(`#${section}`).evaluate(element => {
      const header = document.querySelector(".site-header");
      return element.getBoundingClientRect().top >= (header?.getBoundingClientRect().bottom ?? 0) - 2;
    })).toBe(true);
  }

  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/#contact$/);
  const group = page.getByRole("group", { name: "Contact and social profiles" });
  await expect(group.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/chenyuan99");
  await expect(group.getByRole("button", { name: "Email me" })).toBeVisible();
  await group.getByRole("link", { name: "GitHub" }).focus();
  await page.keyboard.press("Tab");
  await expect(group.getByRole("link", { name: "LinkedIn" })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("PDF is valid and the download action works", async ({ page, request }) => {
  const response = await request.get("/resume.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const bytes = await response.body();
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  const pdf = await PDFDocument.load(bytes);
  expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1);
  expect(pdf.getPageCount()).toBeLessThanOrEqual(2);
  await page.goto("/");
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download résumé" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("Yuan_Chen_Resume.pdf");
  expect(await download.failure()).toBeNull();
});

test("engineering case study is navigable and fits the viewport", async ({ page }) => {
  await page.goto("/#notes");
  await page.getByRole("link", { name: /TaxFront: A shared semantic layer/ }).click();
  await expect(page).toHaveURL(/\/notes\/taxfront-document-semantics\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("TaxFront");
  await expect(page.getByRole("heading", { name: "Public sources" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("link", { name: "All engineering notes" }).click();
  await expect(page).toHaveURL(/#notes$/);
});

test("brand artwork is visible, accessible and theme-aware", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const heading = page.getByRole("heading", { name: "Yuan Chen", level: 1 });
  const wordmark = heading.locator(".hero-wordmark");
  const mark = page.locator(".site-brand-mark");
  await expect(heading).toBeVisible();
  await expect(wordmark).toBeVisible();
  await expect(mark).toHaveCSS("filter", "invert(1)");
  await expect(wordmark).toHaveCSS("filter", "invert(1)");
  const size = await wordmark.evaluate((image: HTMLImageElement) => ({ ready: image.complete && image.naturalWidth > 0, width: image.getBoundingClientRect().width }));
  expect(size.ready).toBe(true);
  expect(size.width).toBeGreaterThan(100);
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(wordmark).toHaveCSS("filter", "none");
  await expect(mark).toHaveCSS("filter", "none");
  await expect(page.getByRole("link", { name: "Yuan Chen, home" })).toBeVisible();
});
