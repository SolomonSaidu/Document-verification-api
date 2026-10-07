import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../index.js";

// Create verification
describe("POST /api/v1/verification", () => {
  it("should create verification", async () => {
    const response = await request(app)
      .post("/api/v1/verification")
      .set(
        "x-api-key",
        "dva_live_ebeb8565232ee36a11cf63c34f4c6045cec2280da33767bde93f9acd5ebd043c",
      )
      .field("document_type", "ELECTRICITY_BILL")
      .attach("document", "./doc/document5.jpg");

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should reject missing api-key", async () => {
    const response = await request(app).post("/api/v1/verification");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid api-key", async () => {
    const response = await request(app)
      .post("/api/v1/verification")
      .set("x-api-key", "dva_****");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

//dva_live_ebeb8565232ee36a11cf63c34f4c6045cec2280da33767bde93f9acd5ebd043c
