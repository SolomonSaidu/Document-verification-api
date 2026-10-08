import prisma from "../config/prisma.js";
import apiService from "../services/api.service.js";
import apiKeySchema from "../schemas/api.schema.js";

const verifyApikey = async (req, res, next) => {
  const key = req.headers["x-api-key"];

  if (!key)
    res.status(401).json({ success: false, message: "Api-key is missing." });

  const result = apiKeySchema.apiKey.safeParse(key);
  if (!result.success) {
    throw new Error("Invalid Api key.");
  }
  const api_key = result.data;

  const hashed_key = apiService.hashApiKey(api_key);

  const get_key = await prisma.apiKey.findUnique({
    where: {
      keyHash: hashed_key,
    },
  });

  if (!get_key) {
    res.status(401).json({
      success: false,
      message: "Invalid Api key",
    });
  }

  req.user_id = get_key.userId;

  next();
};

//continue here
export default verifyApikey;
