import { test, expect } from "@playwright/test";

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 720 } });

  test("opens and closes the mobile menu with the keyboard", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle).toBeVisible();

    await toggle.click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    // Focus returns to the toggle button.
    await expect(page.getByRole("button", { name: /open menu/i })).toBeFocused();
  });

  test("navigates from the mobile menu to a section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });
});

test.describe("Keyboard accessibility", () => {
  test("skip link is the first focusable element and reveals on focus", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveText(/skip to content/i);
  });

  test("project demo links are reachable by keyboard", async ({ page }) => {
    await page.goto("/#work");
    const firstDemo = page.locator('#work a:has-text("Live demo")').first();
    await firstDemo.focus();
    await expect(firstDemo).toBeFocused();
  });
});
