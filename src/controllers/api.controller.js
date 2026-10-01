import prisma from "../config/prisma.js";
import apiKeyServices from "../services/api.service.js";

const createApiKey = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { api_name } = req.body;

    const result = await apiKeyServices.createApi(api_name, user_id);

    res.status(201).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createApiKey };
