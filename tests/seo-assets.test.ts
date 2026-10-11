import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Guards the favicon / social / manifest asset set. These files are committed
 * to `public/` and referenced from `app/layout.tsx`; if one is missing the
 * build still succeeds but the corresponding platform icon silently breaks.
 */
const publicDir = path.resolve(__dirname, "..", "public");

const requiredAssets = [
  "favicon.svg",
  "favicon.ico",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-48.png",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "mask-icon.svg",
  "og-image.png",
  "site.webmanifest",
];

describe("favicon & social assets", () => {
  it.each(requiredAssets)("%s exists in public/", (file) => {
    expect(existsSync(path.join(publicDir, file))).toBe(true);
  });

  it("has a valid PNG signature for the raster icons", () => {
    for (const file of [
      "favicon-16.png",
      "favicon-32.png",
      "apple-touch-icon.png",
      "icon-192.png",
      "icon-512.png",
      "og-image.png",
    ]) {
      const buf = readFileSync(path.join(publicDir, file));
      // PNG magic number: 137 80 78 71 13 10 26 10
      expect(buf.subarray(0, 8)).toEqual(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
    }
  });

  it("has a valid ICO header", () => {
    const buf = readFileSync(path.join(publicDir, "favicon.ico"));
    expect(buf.readUInt16LE(0)).toBe(0); // reserved
    expect(buf.readUInt16LE(2)).toBe(1); // type: icon
    expect(buf.readUInt16LE(4)).toBeGreaterThanOrEqual(1); // image count
  });
});

describe("web app manifest", () => {
  it("is valid JSON with required PWA fields", () => {
    const raw = readFileSync(path.join(publicDir, "site.webmanifest"), "utf8");
    const manifest = JSON.parse(raw);
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe("/");
    expect(manifest.background_color).toBe("#07090c");
    expect(manifest.theme_color).toBe("#07090c");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(
      manifest.icons.some((i: { sizes: string }) => i.sizes === "192x192"),
    ).toBe(true);
    expect(
      manifest.icons.some((i: { sizes: string }) => i.sizes === "512x512"),
    ).toBe(true);
  });
});

describe("favicon.svg source", () => {
  it("uses the acid accent and a scalable viewBox", () => {
    const svg = readFileSync(path.join(publicDir, "favicon.svg"), "utf8");
    expect(svg).toContain("viewBox=\"0 0 64 64\"");
    expect(svg.toLowerCase()).toContain("#c2f04a");
  });
});
