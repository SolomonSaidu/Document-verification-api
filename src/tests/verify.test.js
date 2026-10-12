import prisma from "../config/prisma.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import verificationService from "../services/verification.service.js";
import storageService from "../services/storage.service.js";
import geminiService from "../services/gemini.service.js";

vi.mock("../services/storage.service.js", () => ({
  default: {
    downloadDocument: vi.fn(),
  },
}));

vi.mock("../services/gemini.service.js", () => ({
  default: {
    analyzeDocument: vi.fn(),
  },
}));

vi.mock("../config/prisma.js", () => ({
  default: {
    verification: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("verify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error when verification is not found", async () => {
    prisma.verification.findUnique.mockResolvedValue(null);

    await expect(verificationService.verify(123)).rejects.toThrow(
      "Verification with the id 123 not found or already processed.",
    );
  });

  it("should verify document successfuly", async () => {
    prisma.verification.findUnique.mockResolvedValue({
      id: 123,
      status: "PENDING",
      documentType: "ELECTRICITY_BILL",
      documentUrl: "fake-document-url",
    });

    storageService.downloadDocument.mockResolvedValue({
      buffer: Buffer.from("fake document"),
      mimeType: "image/jpeg",
    });

    geminiService.analyzeDocument.mockResolvedValue(
      JSON.stringify({
        documentType: "WATER_BILL",
        issueDate: "01-10-2026",
      }),
    );

    prisma.verification.update.mockResolvedValue({
      id: 123,
      status: "INVALID_DOCUMENT",
      reason: "Invalid document",
    });

    const response = await verificationService.verify(123);

    expect(response.success).toBe(false);
    expect(response.message).toBe("Invalid document");
    expect(response.verification.status).toBe("INVALID_DOCUMENT");

    expect(prisma.verification.update).toHaveBeenCalled();
  });
});
