import express from "express";
import { createApiKey } from "../controllers/api.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import Validate from "../middlewares/validate.middleware.js";
import apiSchema from "../schemas/api.schema.js";

const route = express.Router();

route.post(
  "/api-key",
  authenticate,
  Validate(apiSchema.apiKeyName),
  createApiKey,
);

export default route;
