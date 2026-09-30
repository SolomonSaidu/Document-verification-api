import prisma from "../config/prisma.js";
import geminiService from "./gemini.service.js";

// Retrieve all verification records belonging to a user.
const getAllVerification = async (user_id) => {
  const verification = await prisma.verification.findMany({
    where: {
      userId: user_id,
    },
  });

  return verification;
};

// Create a verification record using the submitted document details.
const createVerification = async (body, user_id) => {
  const verification = await prisma.verification.create({
    data: {
      userId: user_id,
      documentType: body.document_type,
      documentUrl: body.document_url,
    },
  });

  return verification;
};

// Check whether the document was issued within the last three months.
const isWithinThreeMonths = (issueDate) => {
  if (issueDate === null) return null;

  const [day, month, year] = issueDate.split("-");

  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getDate() !== Number(day) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getFullYear() !== Number(year)
  ) {
    return null;
  }

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 3);

  return date > cutoffDate;
};

// Analyze a verification document and update its status based on the result.
const verify = async (verification_id) => {
  const verification_doc = await prisma.verification.findUnique({
    where: {
      id: verification_id,
      status: "PENDING",
    },
  });

  if (!verification_doc)
    throw new Error(
      `Verification with the id ${verification_id} not found or already processed.`,
    );

  const gemini_result = await geminiService.analyzeDocument(
    verification_doc.documentUrl,
  );

  // Convert the Gemini response from JSON text into an object.
  const result = JSON.parse(gemini_result);
  console.log(result);

  // Reject the document when its detected type does not match the requested type.
  if (result.documentType !== verification_doc.documentType) {
    const doc = await prisma.verification.update({
      where: {
        id: verification_id,
      },
      data: {
        status: "INVALID_DOCUMENT",
        reason: "Invalid document",
      },
    });

    return { success: false, message: "Invalid document", verification: doc };
  }

  // Reject the document when its issue date is invalid or older than three months.
  const checkMonth = isWithinThreeMonths(result.issueDate);
  if (checkMonth === null) {
    const doc = await prisma.verification.update({
      where: {
        id: verification_id,
      },
      data: {
        status: "PENDING_REVIEW",
        reason: "Your document is under review.",
        extractedData: result,
      },
    });
    return {
      success: false,
      message: "Your document is under review.",
      verification: doc,
    };
  } else if (checkMonth === false) {
    const doc = await prisma.verification.update({
      where: {
        id: verification_id,
      },
      data: {
        status: "EXPIRED",
        reason: "The document provided has expired.",
      },
    });
    return {
      success: false,
      message: "The document provided has expired.",
      verification: doc,
    };
  }

  // Mark the document as verified when all checks pass.
  const doc = await prisma.verification.update({
    where: {
      id: verification_id,
    },
    data: {
      status: "VERIFIED",
      reason: "You have been verified successfully.",
      extractedData: result,
    },
  });

  return {
    success: true,
    message: "You have been verified successfully.",
    verification: doc,
  };
};

const getVerificationById = async (verification_id) => {
  const verification_doc = await prisma.verification.findUnique({
    where: {
      id: verification_id,
    },
  });

  return verification_doc;
};

export default {
  createVerification,
  getAllVerification,
  verify,
  getVerificationById,
};
