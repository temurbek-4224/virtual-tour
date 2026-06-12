// @ts-check
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "../public/images/tashkent");
const OUTPUT_DIR = path.join(__dirname, "../public/images/tashkent-optimized");
const MAX_WIDTH = 5000;
const QUALITY = 78;
const SUPPORTED_EXT = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]);

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error("Input directory not found:", INPUT_DIR);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log("Created:", OUTPUT_DIR);
  }

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => SUPPORTED_EXT.has(path.extname(f)))
    .sort();

  if (files.length === 0) {
    console.log("No images found in", INPUT_DIR);
    return;
  }

  console.log(`\nOptimizing ${files.length} panorama image(s)...\n`);
  console.log("─".repeat(65));

  let totalIn = 0;
  let totalOut = 0;

  for (let i = 0; i < files.length; i++) {
    const inputPath = path.join(INPUT_DIR, files[i]);
    const outName = `tashkent-${i + 1}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, outName);

    const sizeIn = fs.statSync(inputPath).size;
    totalIn += sizeIn;

    const meta = await sharp(inputPath).metadata();
    const willResize = (meta.width ?? 0) > MAX_WIDTH;

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY })
      .toFile(outputPath);

    const sizeOut = fs.statSync(outputPath).size;
    totalOut += sizeOut;

    const saved = (((sizeIn - sizeOut) / sizeIn) * 100).toFixed(1);
    const dims = willResize
      ? `${meta.width}×${meta.height} → ${MAX_WIDTH}×auto`
      : `${meta.width}×${meta.height} (no resize)`;

    console.log(`[${i + 1}/${files.length}] ${files[i]}`);
    console.log(`  → ${outName}   ${dims}`);
    console.log(
      `     ${formatBytes(sizeIn)} → ${formatBytes(sizeOut)}  (${saved}% smaller)\n`
    );
  }

  const totalSaved = (((totalIn - totalOut) / totalIn) * 100).toFixed(1);
  console.log("─".repeat(65));
  console.log(`Total original : ${formatBytes(totalIn)}`);
  console.log(`Total optimized: ${formatBytes(totalOut)}  (${totalSaved}% saved)`);
  console.log(`\nDone! Files saved to: ${OUTPUT_DIR}`);
  console.log(
    "\nNext: restart your dev server and the panorama viewer should load correctly.\n"
  );
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
