// @ts-check
/**
 * Optimizes equirectangular 360° panorama images for web use.
 * Input  : public/images/360/
 * Output : public/images/360-optimized/
 * Usage  : npm run optimize:360
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "../public/images/360");
const OUTPUT_DIR = path.join(__dirname, "../public/images/360-optimized");
const MAX_WIDTH = 4096;
const QUALITY = 80;
const SUPPORTED_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".webp",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
]);

function fmtBytes(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1048576).toFixed(2) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error("❌  Input folder not found:", INPUT_DIR);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log("📁  Created:", OUTPUT_DIR);
  }

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => SUPPORTED_EXT.has(path.extname(f)))
    .sort();

  if (!files.length) {
    console.log("⚠️   No image files found in", INPUT_DIR);
    return;
  }

  console.log(`\n🌐  Found ${files.length} image(s) to optimize\n`);
  console.log("─".repeat(70));

  let totalIn = 0;
  let totalOut = 0;

  for (let i = 0; i < files.length; i++) {
    const inputPath = path.join(INPUT_DIR, files[i]);
    const outName = `panorama-${i + 1}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, outName);

    const sizeIn = fs.statSync(inputPath).size;
    totalIn += sizeIn;

    const meta = await sharp(inputPath).metadata();
    const ratio = (meta.width / meta.height).toFixed(3);
    const is2to1 = Math.abs(meta.width / meta.height - 2.0) < 0.15;
    const needsResize = (meta.width ?? 0) > MAX_WIDTH;
    const outW = needsResize ? MAX_WIDTH : meta.width;
    const outH = needsResize ? Math.round(meta.height * (MAX_WIDTH / meta.width)) : meta.height;

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY })
      .toFile(outputPath);

    const sizeOut = fs.statSync(outputPath).size;
    totalOut += sizeOut;

    const pct = (((sizeIn - sizeOut) / sizeIn) * 100).toFixed(1);
    const ratioNote = is2to1 ? "✅ 2:1 equirectangular" : `⚠️  ratio ${ratio}:1 (not 2:1)`;

    console.log(`[${i + 1}/${files.length}] ${files[i]}`);
    console.log(`   → ${outName}   ${outW}×${outH}   ${ratioNote}`);
    console.log(`      ${fmtBytes(sizeIn)} → ${fmtBytes(sizeOut)}  (${pct}% smaller)\n`);
  }

  const totalPct = (((totalIn - totalOut) / totalIn) * 100).toFixed(1);
  console.log("─".repeat(70));
  console.log(`Total original : ${fmtBytes(totalIn)}`);
  console.log(`Total optimized: ${fmtBytes(totalOut)}  (${totalPct}% saved)`);
  console.log(`\n✅  Done! Files in: ${OUTPUT_DIR}`);
  console.log(
    "   Now run:  npm run dev  →  open  /uz/panorama\n"
  );
}

main().catch((err) => {
  console.error("❌  Failed:", err.message);
  process.exit(1);
});
