import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";

export async function processImage({ inputPath, outputPath }) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath);
}