import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the API key from environment variables.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Analyze a document buffer and extract only the readable fields from the bill.
const analyzeDocument = async (buffer, mimeType) => {
  // Send the bill image and extraction instructions to the AI model.
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",

    contents: [
      {
        // Instruction prompt for the model to read the document and return structured JSON.
        text: `
        Analyze this electricity bill.

        Extract only information that is actually visible/readable
        in the document. The date format should be: 25-10-2026 i.e date-month-year.

        Do NOT guess or infer missing information.
        Return null for any field that cannot be found or reliably read.
      `,
      },
      {
        // Include the uploaded document content as base64-encoded inline data.
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
    ],

    config: {
      responseMimeType: "application/json",

      // Define the expected JSON schema for the extracted document data.
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

  // Return the model response as raw text.
  return response.text;
};

// Export the document analysis function for use elsewhere in the app.
export default { analyzeDocument };
