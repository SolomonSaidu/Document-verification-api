import { Queue } from "bullmq";
import redis from "../lib/redis.js";

export const verificationQueue = new Queue("verification", {
  connection: redis,
});
