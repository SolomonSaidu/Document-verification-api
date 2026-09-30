import { success } from "zod";
import prisma from "../config/prisma.js";
import apiService from "../services/api.service.js";

const verifyApikey = async (req, res, next) => {
  const api_key = req.headers["x-api-key"];

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
};

//continue here
export default verifyApikey;
