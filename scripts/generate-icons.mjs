/**
 * Rasterize the SVG logos into the PNG sizes browsers expect.
 * Run with `npm run icons` whenever the SVGs change.
 *
 *   public/favicon.svg          -> icon-192.png, icon-512.png, apple-touch-icon.png
 *   public/icon-maskable.svg    -> icon-maskable-512.png
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");

async function rasterize(svgPath, outPath, size) {
  const svg = await readFile(svgPath);
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`  ✓ ${outPath.replace(PUBLIC, "public")} (${size}px)`);
}

const FAVICON = resolve(PUBLIC, "favicon.svg");
const MASKABLE = resolve(PUBLIC, "icon-maskable.svg");

console.log("Generating PNG icons…");
await rasterize(FAVICON, resolve(PUBLIC, "icon-192.png"), 192);
await rasterize(FAVICON, resolve(PUBLIC, "icon-512.png"), 512);
await rasterize(FAVICON, resolve(PUBLIC, "apple-touch-icon.png"), 180);
await rasterize(MASKABLE, resolve(PUBLIC, "icon-maskable-512.png"), 512);
console.log("Done.");
