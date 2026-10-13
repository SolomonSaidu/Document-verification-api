// Load verification service and queue.
import verificationService from "../services/verification.service.js";
import { verificationQueue } from "../queue/verification.queue.js";

// Fetch all verifications for the logged-in user.
const getAllVerification = async (req, res) => {
  // Get the current user ID.
  const user_id = req.user.id;
  // Retrieve verifications from the service.
  const result = await verificationService.getAllVerification(user_id);

  // Return the verification list.
  res.status(200).json({ success: true, result });
};

// Create a new verification request and queue processing.
const createVerification = async (req, res) => {
  // Submit the document with user and file details.
  const result = await verificationService.createVerification(
    req.body,
    req.user_id,
    req.file,
  );

  // Add the verification task to the queue.
  await verificationQueue.add("verification", {
    verification_id: result.id,
  });

  // Return the created verification response.
  res.status(201).json({
    success: true,
    message: "Your document has been submited successfuly.",
    verification_id: result.id,
  });
};

// Check the status of a verification.
const getVerificationStatus = async (req, res) => {
  try {
    // Get the verification ID from the request body.
    const { verification_id } = req.body;

    // Fetch the verification by ID for the current user.
    const result = await verificationService.getVerificationById(
      verification_id,
      req.user_id,
    );

    // Send the verification status response.
    res.status(200).json({
      id: result.id,
      status: result.status,
      message: result.reason,
      document_type: result.documentType,
    });
  } catch (error) {
    // Handle missing verification cases.
    if (error.message == "NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Verification not found." });
    }
    // Return a server error response.
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllVerification, createVerification, getVerificationStatus };
