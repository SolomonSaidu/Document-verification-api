import verificationService from "../services/verification.service.js";
import { verificationQueue } from "../queue/verification.queue.js";

const getAllVerification = async (req, res) => {
  const result = await verificationService.getAllVerification();

  res.status(200).json({ success: true, result });
};

const createVerification = async (req, res) => {
  const result = await verificationService.createVerification(
    req.body,
    req.user_id,
  );

  await verificationQueue.add("verification", {
    verification_id: result.id,
  });

  res.status(201).json({
    success: true,
    message: "Your document has been submited successfuly.",
    verification_id: result.id,
  });
};

const testVerify = async (req, res) => {
  const id = req.params.id;
  const verification_id = parseInt(id);

  try {
    const result = await verificationService.verify(verification_id);

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVerificationStatus = async (req, res) => {
  try {
    const { verification_id } = req.body;

    const result =
      await verificationService.getVerificationById(verification_id);

    res.status(200).json({
      id: result.id,
      status: result.status,
      message: result.reason,
      document_type: result.documentType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getAllVerification,
  createVerification,
  testVerify,
  getVerificationStatus,
};
