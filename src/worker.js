import { Worker } from "bullmq";
import { processImage } from "./processor.js";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
};

const worker = new Worker(
  "image-processing",
  async (job) => {
    const { inputPath, outputPath } = job.data;
    console.log(`Processing: ${inputPath}`);
    await processImage({ inputPath, outputPath });
    console.log(`Saved: ${outputPath}`);
  },
  { connection,
    concurrency: 4
   }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

console.log("Worker started, waiting for jobs...");