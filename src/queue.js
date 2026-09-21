import { Queue } from "bullmq";

const connection = {
  host: "localhost",
  port: 6379,
};

export const imageQueue = new Queue("image-processing", { connection });

export async function addImageJob({ inputPath, outputPath }) {
  const job = await imageQueue.add("convert-image", {
    inputPath,
    outputPath,
  });

  return job;
}