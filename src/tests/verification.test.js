import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../index.js";

// Create verification
describe("POST /api/v1/verification", () => {
  it("should create verification", async () => {
    const userResponse = await request(app).post("/api/v1/user/login").send({
      email: "example@gmail.com",
      password: "mypass",
    });

    const token = userResponse.body.token;

    const apiKeyResponse = await request(app)
      .post("/api/v1/api-key")
      .set("Authorization", `Bearer ${token}`)
      .send({
        api_name: "first test api",
      });

    const api_key = apiKeyResponse.body.api_key;

    const response = await request(app)
      .post("/api/v1/verification")
      .set("x-api-key", api_key)
      .field("document_type", "ELECTRICITY_BILL")
      .attach("document", "./doc/document5.jpg");

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  }, 30000);

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

  it("should reject missing document type", async () => {
    const userResponse = await request(app).post("/api/v1/user/login").send({
      email: "example@gmail.com",
      password: "mypass",
    });

    const token = userResponse.body.token;

    const apiKeyResponse = await request(app)
      .post("/api/v1/api-key")
      .set("Authorization", `Bearer ${token}`)
      .send({
        api_name: "first test api",
      });

    const api_key = apiKeyResponse.body.api_key;

    const response = await request(app)
      .post("/api/v1/verification")
      .set("x-api-key", api_key)
      .field("document_type", "")
      .attach("document", "./doc/document5.jpg");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  }, 30000);
});

//dva_live_ebeb8565232ee36a11cf63c34f4c6045cec2280da33767bde93f9acd5ebd043c
