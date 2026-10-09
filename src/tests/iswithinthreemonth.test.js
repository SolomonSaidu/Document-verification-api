import { describe, it, expect } from "vitest";
import verificationService from "../services/verification.service.js";

describe("FUNC: isWithInThreeMonth", () => {
  const referenceDate = new Date(2026, 5, 9);
  it("should return false data is more than three months", () => {
    const response = verificationService.isWithinThreeMonths(
      "01-09-2026",
      referenceDate,
    );

    expect(response).toBe(false);
  });

  it("should return true date is within three months", () => {
    const response = verificationService.isWithinThreeMonths(
      "01-08-2026",
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
