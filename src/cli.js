import { Command } from "commander";
import path from "node:path";
import fs from "node:fs/promises";
import { addImageJob } from "./queue.js";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

async function findImages(folderPath) {
  const entries = await fs.readdir(folderPath);
  return entries.filter((entry) =>
    IMAGE_EXTENSIONS.includes(path.extname(entry).toLowerCase())
  );
}

async function processFolder(folderPath) {
  const stat = await fs.stat(folderPath).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.error(`Folder not found: ${folderPath}`);
    process.exitCode = 1;
    return;
  }

  const images = await findImages(folderPath);
  console.log(`Found ${images.length} images.`);

  for (const image of images) {
    const inputPath = path.join(folderPath, image);
    const outputPath = path.join(
      "output",
      `${path.parse(image).name}.webp`
    );
    await addImageJob({ inputPath, outputPath });
  }

  console.log(`Queued ${images.length} jobs.`);
  process.exit(0);
}

const program = new Command();

program
  .name("image-worker")
  .description("Queue images from a folder for WebP conversion");

program
  .command("process <folder>")
  .description("Find images in a folder and queue them for processing")
  .action(processFolder);

program.parse();