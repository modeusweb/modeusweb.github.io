import { test, expect } from "@playwright/test";

/**
 * End-to-end coverage for the critical single-page portfolio: loading, section
 * presence, anchor navigation, project links, mobile menu, and keyboard access.
 */

test.describe("Portfolio", () => {
  test("loads with the main sections present and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");

    await expect(page).toHaveTitle(/Anton Nikonorov|MODEUSWEB/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    for (const id of ["top", "work", "about", "capabilities", "github", "contact"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.getByRole("heading", { name: /selected work/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /let’s build something useful/i })).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("renders four project cards with valid demo and source links", async ({ page }) => {
    await page.goto("/#work");

    const cards = page.locator("#work article");
    await expect(cards).toHaveCount(4);

    const demoLinks = page.locator('#work a:has-text("Live demo")');
    await expect(demoLinks).toHaveCount(4);
    for (const link of await demoLinks.all()) {
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^https:\/\/modeusweb\.github\.io\//);
      expect(await link.getAttribute("rel")).toContain("noopener");
    }

    const sourceLinks = page.locator('#work a:has-text("Source")');
    await expect(sourceLinks).toHaveCount(4);
    for (const link of await sourceLinks.all()) {
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^https:\/\/github\.com\/modeusweb\//);
    }
  });

  test("blocks reveal with a gentle scale-in from the bottom when scrolled into view", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.locator("#work article").first();

    // Below the fold, the reveal system holds blocks in their hidden state:
    // faded out and gently scaled down (not a drift).
    await expect(firstCard).toHaveCSS("opacity", "0");
    await expect(firstCard).toHaveCSS("transform", "matrix(0.94, 0, 0, 0.94, 0, 0)");

    // The same scale-from-bottom entrance applies to every block on the page.
    const principle = page.locator("#about ol li").first();
    await expect(principle).toHaveCSS("opacity", "0");
    await expect(principle).toHaveCSS("transform", "matrix(0.94, 0, 0, 0.94, 0, 0)");

    // Scrolling into view plays the scale-in and settles at full scale.
    await firstCard.scrollIntoViewIfNeeded();
    await expect(firstCard).toHaveCSS("opacity", "1");
    await expect(firstCard).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  });

  test("anchor navigation scrolls to the work section", async ({ page }, testInfo) => {
    await page.goto("/");

    const isMobile = testInfo.project.name.startsWith("mobile");
    if (isMobile) {
      await page.getByRole("button", { name: /open menu/i }).click();
      await page.locator("#mobile-menu").getByRole("link", { name: "Work" }).click();
    } else {
      await page.getByRole("link", { name: "Work", exact: true }).first().click();
    }

    await expect(page).toHaveURL(/#work$/);
    // The work heading should be within the viewport after scrolling.
    const heading = page.getByRole("heading", { name: /selected work/i });
    await expect(heading).toBeInViewport();
  });

  test("back-to-top anchors land on a real 0, not the first section offset", async ({
    page,
  }) => {
    // The first section begins below the sticky header, so aligning *it* to the
    // top of the viewport would stop short of the document start. Both
    // back-to-top controls must reach a true zero instead.
    await page.goto("/#contact");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

    await page.locator('nav a[href="#top"]').first().click();
    await expect(page).toHaveURL(/#top$/);

    // Polled rather than a fixed wait: the scroll is smooth.
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 8000 })
      .toBe(0);

    // And the hero must sit flush under the header — no gap, no overlap.
    const alignment = await page.evaluate(() => {
      const hero = document.getElementById("top").getBoundingClientRect();
      const header = document.querySelector("header").getBoundingClientRect();
      return Math.round(hero.top - header.bottom);
    });
    expect(Math.abs(alignment)).toBeLessThanOrEqual(1);

    // Footer control behaves the same way. Note the footer also renders a
    // wordmark link to #top, so target the control by its accessible name.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("link", { name: "Back to top" }).click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 8000 })
      .toBe(0);
  });
});
