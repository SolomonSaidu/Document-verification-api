import express from "express";
import {
  getAllVerification,
  createVerification,
  getVerificationStatus,
} from "../controllers/verification.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import verifyApikey from "../middlewares/api.middleware.js";
import upload from "../middlewares/upload.js";
import Validate from "../middlewares/validate.middleware.js";
import verificationSchema from "../schemas/verification.schema.js";

const route = express.Router();

route.get("/verification", authenticate, getAllVerification);

route.post(
  "/verification",
  verifyApikey,
  upload.single("document"),
  Validate(verificationSchema),
  createVerification,
);

route.post("/verification/status", verifyApikey, getVerificationStatus);

export default route;
