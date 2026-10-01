import express from "express";
import {
  getAllVerification,
  createVerification,
  getVerificationStatus,
} from "../controllers/verification.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import verifyApikey from "../middlewares/api.middleware.js";

const route = express.Router();

route.get("/verification", authenticate, getAllVerification);

route.post("/verification", verifyApikey, createVerification);

route.post("/verification/status", verifyApikey, getVerificationStatus);

export default route;
