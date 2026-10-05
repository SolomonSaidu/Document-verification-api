import z from "zod";

const apiKeySchema = z
  .string("API key must be a string")
  .min(1, "API key is required")
  .trim();

export default apiKeySchema;
