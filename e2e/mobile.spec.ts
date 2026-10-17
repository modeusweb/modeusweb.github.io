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

    const skip = page.locator('body > a[href="#main"]');
    await expect(skip).toBeFocused();
    await expect(skip).toHaveText(/skip to content/i);

    // The bypass link must actually become visible, not merely be the focused
    // element. `toBeVisible()` alone is not enough: the `sr-only` base state
    // still has a non-empty 1x1 box, so assert the real position, size and
    // surface. This is the regression guard for the unlayered
    // `body > :not(...)` rule overriding the `focus:*` positioning utilities.
    await expect(skip).toHaveCSS("position", "fixed");
    await expect(skip).toHaveCSS("overflow", "visible");

    const box = await skip.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(40);
    expect(box!.height).toBeGreaterThan(20);
    expect(Math.round(box!.x)).toBeGreaterThanOrEqual(0);
    expect(Math.round(box!.y)).toBeGreaterThanOrEqual(0);
  });

  test("project demo links are reachable by keyboard", async ({ page }) => {
    await page.goto("/#work");

    const firstDemo = page.locator('#work a:has-text("Live demo")').first();
    await firstDemo.focus();
    await expect(firstDemo).toBeFocused();
  });
});
