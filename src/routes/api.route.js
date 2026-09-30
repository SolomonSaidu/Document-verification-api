import express from "express";
import { createApiKey } from "../controllers/api.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/api-key", authenticate, createApiKey);

export default route;
