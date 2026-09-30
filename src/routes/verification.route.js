import express from "express";
import {
  getAllVerification,
  createVerification,
  testVerify,
  getVerificationStatus,
} from "../controllers/verification.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const route = express.Router();

route.get("/verification", authenticate, getAllVerification);

route.post("/verification", authenticate, createVerification);

route.post("/verification/test/:id", testVerify);

route.post("/verification/status", getVerificationStatus);

export default route;
