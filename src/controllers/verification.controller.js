import verificationService from "../services/verification.service.js";
import { verificationQueue } from "../queue/verification.queue.js";
import { file, success } from "zod";

const getAllVerification = async (req, res) => {
  const user_id = req.user.id;
  const result = await verificationService.getAllVerification(user_id);

  res.status(200).json({ success: true, result });
};

const createVerification = async (req, res) => {
  const result = await verificationService.createVerification(
    req.body,
    req.user_id,
    req.file,
  );
  console.log("File", req.file);
  console.log("Body", req.body);

  console.time("redis");
  await verificationQueue.add("verification", {
    verification_id: result.id,
  });
  console.timeEnd("redis");

  res.status(201).json({
    success: true,
    message: "Your document has been submited successfuly.",
    verification_id: result.id,
  });
};

const getVerificationStatus = async (req, res) => {
  try {
    const { verification_id } = req.body;

    const result = await verificationService.getVerificationById(
      verification_id,
      req.user_id,
    );

    res.status(200).json({
      id: result.id,
      status: result.status,
      message: result.reason,
      document_type: result.documentType,
    });
  } catch (error) {
    if (error.message == "NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Verification not found." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllVerification, createVerification, getVerificationStatus };
