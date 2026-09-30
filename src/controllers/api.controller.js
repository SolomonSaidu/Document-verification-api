import prisma from "../config/prisma.js";
import apiKeyServices from "../services/api.service.js";

const createApiKey = async (req, res) => {
  const user_id = req.user.id;
  const { api_name } = req.body;

  const result = await apiKeyServices.createApi(api_name, user_id);

  res.status(201).json(result);
};

export { createApiKey };
