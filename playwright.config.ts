import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright end-to-end configuration.
 *
 * Tests run against the production static export served locally, mirroring how
 * the site is hosted on GitHub Pages. If browsers cannot be installed in the
 * environment, these tests are skipped (see README troubleshooting).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npx --yes serve@latest out -l 4173 --no-clipboard",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
