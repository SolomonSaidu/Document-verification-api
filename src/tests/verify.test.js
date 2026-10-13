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

  it("should reject invalid document", async () => {
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

  it("should verify the document", async () => {
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
        documentType: "ELECTRICITY_BILL",
        issueDate: "01-10-2026",
      }),
    );

    prisma.verification.update.mockResolvedValue({
      id: 123,
      status: "VERIFIED",
      reason: "You have been verified successfully.",
    });

    const response = await verificationService.verify(123);

    expect(response.success).toBe(true);
    expect(response.message).toBe("You have been verified successfully.");
    expect(response.verification.status).toBe("VERIFIED");

    expect(prisma.verification.update).toHaveBeenCalled();
  });

  it("should reject expired verifications", async () => {
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
        documentType: "ELECTRICITY_BILL",
        issueDate: "01-05-2026",
      }),
    );

    prisma.verification.update.mockResolvedValue({
      id: 123,
      status: "EXPIRED",
      reason: "The document provided has expired.",
    });

    const response = await verificationService.verify(123);

    expect(response.success).toBe(false);
    expect(response.message).toBe("The document provided has expired.");
    expect(response.verification.status).toBe("EXPIRED");

    expect(prisma.verification.update).toHaveBeenCalled();
  });

  it("should set to pending review for invalid date", async () => {
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
        documentType: "ELECTRICITY_BILL",
        issueDate: "01-50-2026",
      }),
    );

    prisma.verification.update.mockResolvedValue({
      id: 123,
      status: "PENDING_REVIEW",
      reason: "Your document is under review.",
    });

    const response = await verificationService.verify(123);

    expect(response.success).toBe(false);
    expect(response.message).toBe("Your document is under review.");
    expect(response.verification.status).toBe("PENDING_REVIEW");

    expect(prisma.verification.update).toHaveBeenCalled();
  });
});
