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
  const date = new Date(issueDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return date >= threeMonthsAgo;
};

// Analyze a verification document and update its status based on the result.
const verify = async (verification_id) => {
  const verification_doc = await prisma.verification.findUnique({
    where: {
      id: verification_id,
    },
  });

  if (!verification_doc)
    throw new Error(`Verification with the id ${verification_id} not found`);

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
  if (!isWithinThreeMonths(result.issueDate)) {
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
    },
  });

  return {
    success: true,
    message: "You have been verified successfully.",
    verification: doc,
  };

  //check if the docType match and also check if the date is grater than three months
  //return the specific error eg INVALID_DOCMENT, UNKNOWN_DOCUMENT

  //if all is well then save to the verificcation table, and update status to "success"

  //get doc context using the crm tool
  //then send the context to gemini api to return the res in json then we covert to json
  //gemini response inclueds: {success:true, status:"SUCCESS"}, {success:fales, status:"OUTDATED_DOC"}, {success:fales, status:"INVALID_DOCUMENT"}, {success:false, status:"PENDING_REVIEW"}
  //then we check each status here then return either error or success.
};

export default { createVerification, getAllVerification, verify };
