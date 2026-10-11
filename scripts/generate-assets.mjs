/**
 * One-off asset generator.
 *
 * Renders the vector source in `public/` to the raster formats required for
 * broad favicon and social-preview support, using the project's own Playwright
 * Chromium build. Self-hosted fonts are embedded so the Open Graph image text
 * renders identically everywhere.
 *
 * Run with:  node scripts/generate-assets.mjs
 *
 * Outputs (into public/):
 *   - og-image.png        1200x630 social preview
 *   - favicon-16.png      favicon-32.png      favicon-48.png
 *   - apple-touch-icon.png  (180x180)
 *   - icon-192.png        icon-512.png
 *   - favicon.ico         (16 + 32 + 48 embedded PNG)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const fontsDir = path.join(root, "node_modules");

const INTER = path.join(
  fontsDir,
  "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
);
const MONO_400 = path.join(
  fontsDir,
  "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
);
const MONO_700 = path.join(
  fontsDir,
  "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2",
);

const toFileUrl = (p) => `file:///${p.replace(/\\/g, "/")}`;

async function readSvg(name) {
  return readFile(path.join(publicDir, name), "utf8");
}

function fontFaceHtml() {
  return `
  @font-face {
    font-family: "Inter";
    src: url("${toFileUrl(INTER)}") format("woff2");
    font-weight: 100 900;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "JetBrains Mono";
    src: url("${toFileUrl(MONO_400)}") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "JetBrains Mono";
    src: url("${toFileUrl(MONO_700)}") format("woff2");
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }`;
}

async function renderSvgToPng(page, svg, width, height) {
  const html = `<!doctype html><html><head><meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    ${fontFaceHtml()}
  </style></head>
  <body>${svg.replace(
    /<svg /,
    `<svg width="${width}" height="${height}" `,
  )}</body></html>`;
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  return page.screenshot({ clip: { x: 0, y: 0, width, height } });
}

/** Pack one or more PNG buffers into a single .ico file. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(images.length, 4);

  const entrySize = 16;
  const dirSize = header.length + entrySize * images.length;
  let offset = dirSize;
  const dirEntries = [];
  const dataChunks = [];
  for (const { size, png } of images) {
    const dir = Buffer.alloc(entrySize);
    dir.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    dir.writeUInt8(size >= 256 ? 0 : size, 1); // height
    dir.writeUInt8(0, 2); // palette
    dir.writeUInt8(0, 3); // reserved
    dir.writeUInt16LE(1, 4); // colour planes
    dir.writeUInt16LE(32, 6); // bits per pixel
    dir.writeUInt32LE(png.length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += png.length;
    dirEntries.push(dir);
    dataChunks.push(png);
  }
  return Buffer.concat([header, ...dirEntries, ...dataChunks]);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  const faviconSvg = await readSvg("favicon.svg");
  const ogSvg = await readSvg("og-image.svg");

  // 1. Social preview (raster, fonts embedded).
  const ogPng = await renderSvgToPng(page, ogSvg, 1200, 630);
  await writeFile(path.join(publicDir, "og-image.png"), ogPng);
  console.log("✓ og-image.png (1200x630)");

  // 2. Favicon PNGs.
  const faviconPngs = {};
  for (const size of [16, 32, 48]) {
    const png = await renderSvgToPng(page, faviconSvg, size, size);
    faviconPngs[size] = png;
    await writeFile(path.join(publicDir, `favicon-${size}.png`), png);
    console.log(`✓ favicon-${size}.png`);
  }

  // 3. Apple touch icon.
  const apple = await renderSvgToPng(page, faviconSvg, 180, 180);
  await writeFile(path.join(publicDir, "apple-touch-icon.png"), apple);
  console.log("✓ apple-touch-icon.png (180x180)");

  // 4. PWA icons.
  for (const size of [192, 512]) {
    const png = await renderSvgToPng(page, faviconSvg, size, size);
    await writeFile(path.join(publicDir, `icon-${size}.png`), png);
    console.log(`✓ icon-${size}.png`);
  }

  // 5. Multi-size favicon.ico.
  const ico = buildIco([
    { size: 16, png: faviconPngs[16] },
    { size: 32, png: faviconPngs[32] },
    { size: 48, png: faviconPngs[48] },
  ]);
  await writeFile(path.join(publicDir, "favicon.ico"), ico);
  console.log("✓ favicon.ico (16 + 32 + 48)");

  await browser.close();
  await mkdir(path.join(root, "out"), { recursive: true }).catch(() => {});
  console.log("\nAll assets generated successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
