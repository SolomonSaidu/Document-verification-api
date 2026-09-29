import verificationService from "../services/verification.service.js";

const getAllVerification = async (req, res) => {
  const result = await verificationService.getAllVerification();

  res.status(200).json({ success: true, result });
};

const createVerification = async (req, res) => {
  const result = await verificationService.createVerification(
    req.body,
    req.user.id,
  );

  res.status(201).json({ message: "Verification...", result });
};

const testVerify = async (req, res) => {
  const id = req.params.id;
  const verification_id = parseInt(id);

  const result = await verificationService.verify(verification_id);

  res.status(200).json(result);
};

export { getAllVerification, createVerification, testVerify };
