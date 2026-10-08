import z from "zod";

const apiKey = z
  .string("API key must be a string")
  .min(1, "API key is required")
  .trim();

const apiKeyName = z.object({
  api_name: z
    .string("Name must be a string")
    .min(2, "Name must be two character")
    .max(20, "Name must not be 20 character long"),
});

export default { apiKey, apiKeyName };
