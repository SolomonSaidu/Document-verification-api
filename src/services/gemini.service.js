import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeDocument = async (filePath) => {
  const file = await ai.files.upload({
    file: filePath,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",

    contents: [
      {
        text: `
        Analyze this electricity bill.

        Extract only information that is actually visible/readable
        in the document.

        Do NOT guess or infer missing information.
        Return null for any field that cannot be found or reliably read.
      `,
      },
      {
        fileData: {
          fileUri: file.uri,
          mimeType: file.mimeType,
        },
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          // status: {
          //   type: "string",
          //   enum: ["PENDING_REVIEW", "SUCCESS", "INVALID_DOC"],
          // },

          documentType: {
            type: "string",
            enum: [
              "ELECTRICITY_BILL",
              "WATER_BILL",
              "BANK_STATMENT",
              "UNKNOWN_DOCUMENT",
            ],
          },

          customerName: {
            type: "string",
            nullable: true,
          },

          accountNumber: {
            type: "string",
            nullable: true,
          },

          meterNumber: {
            type: "string",
            nullable: true,
          },

          address: {
            type: "string",
            nullable: true,
          },

          issueDate: {
            type: "string",
            nullable: true,
          },

          amountDue: {
            type: "number",
            nullable: true,
          },
        },

        required: [
          "documentType",
          "customerName",
          "accountNumber",
          "meterNumber",
          "address",
          "issueDate",
          "amountDue",
        ],
      },
    },
  });

  return response.text;
};

export default { analyzeDocument };
