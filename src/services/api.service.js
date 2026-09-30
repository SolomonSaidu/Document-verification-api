import prisma from "../config/prisma.js";
import crypto from "crypto";

const generateApiKey = () => {
  const secret = crypto.randomBytes(32).toString("hex");

  return `dva_live_${secret}`;
};

const hashApiKey = (api_key) => {
  return crypto.createHash("sha256").update(api_key).digest("hex");
};

const createApi = async (api_name, user_id) => {
  const generated_key = generateApiKey();
  const hashed_key = hashApiKey(generated_key);

  const api_key = await prisma.apiKey.create({
    data: {
      userId: user_id,
      name: api_name,
      keyHash: hashed_key,
    },
  });

  return {
    success: true,
    id: api_key.id,
    api_key: generated_key,
    key_hash: api_key.keyHash,
    created_at: api_key.createdAt,
  };
};

export default { createApi, hashApiKey };
