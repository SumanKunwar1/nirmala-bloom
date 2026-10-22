import { test, expect } from "@playwright/test";

const pages = ["/", "/about", "/programs", "/news", "/gallery", "/partners", "/resources", "/contact", "/donate"];

test.describe("smoke", () => {
  for (const path of pages) {
    test(`${path} loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator("body")).not.toContainText("This page didn't load");
      expect(errors).toEqual([]);
    });
  }

  test("unknown route shows 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("home page links to donate", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Nirmala Foundation/);
    await page.getByRole("link", { name: /donate/i }).first().click();
    await expect(page).toHaveURL(/\/donate/);
  });
});
