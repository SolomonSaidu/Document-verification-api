import { describe, it, expect } from "vitest";
import verificationService from "../services/verification.service.js";

describe("FUNC: isWithInThreeMonth", () => {
  const referenceDate = new Date(2026, 5, 9); // Format: yyyy mm - 1 dd
  it("should accept date within three months ago", () => {
    const response = verificationService.isWithinThreeMonths(
      "09-03-2026",
      referenceDate,
    );

    expect(response).toBe(true);
  });
  it("should return false data is more than three months", () => {
    const response = verificationService.isWithinThreeMonths(
      "01-02-2026", // Format: dd-mm-yyyy
      referenceDate,
    );

    expect(response).toBe(false);
  });

  it("should return true date is within three months", () => {
    const response = verificationService.isWithinThreeMonths(
      "1-06-2026",
      referenceDate,
    );

    expect(response).toBe(true);
  });

  it("should return null date is null", () => {
    const response = verificationService.isWithinThreeMonths("");

    expect(response).toBe(null);
  });

  it("should return null date is invalid", () => {
    const response = verificationService.isWithinThreeMonths(
      "01-13-2026",
      referenceDate,
    );

    expect(response).toBe(null);
  });

  it("should return null if date is greater than current date", () => {
    const response = verificationService.isWithinThreeMonths(
      "01-11-2027",
      referenceDate,
    );

    expect(response).toBe(null);
  });
});
