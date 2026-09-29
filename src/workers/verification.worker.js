import { Worker } from "bullmq";
import redis from "../lib/redis.js";
import verificationService from "../services/verification.service.js";

const worker = new Worker(
  "verification",
  async (job) => {
    console.log(`Job ${job?.id} is been processed.`);

    const verification_id = job.data.verification_id;

    const verification_data = await verificationService.verify(verification_id);
    console.log(verification_data);
  },
  {
    connection: redis,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed.`);
});

worker.on("failed", (job, error) => {
  console.log(`Job ${job?.id} failed:`, error);
});

worker.on("error", (error) => {
  console.log("Worker/Redis error:", error);
});
