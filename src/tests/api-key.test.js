import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../index.js";

describe("POST /api/v1/api-key", () => {
  it("should create an api-key", async () => {
    const userResponse = await request(app).post("/api/v1/user/login").send({
      email: "example@gmail.com",
      password: "mypass",
    });

    const token = userResponse.body.token;

    const response = await request(app)
      .post("/api/v1/api-key")
      .set("Authorization", `Bearer ${token}`)
      .send({
        api_name: "first api key",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should reject not authenticated", async () => {
    const response = await request(app).post("/api/v1/api-key").send({
      api_name: "create new api",
    });

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(401);
  });

  it("should reject invalid jwt", async () => {
    const token = "Faketokens";
    const response = await request(app)
      .post("/api/v1/api-key")
      .send({
        api_name: "create new api",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing api-key name", async () => {
    const userResponse = await request(app).post("/api/v1/user/login").send({
      email: "example@gmail.com",
      password: "mypass",
    });

    const token = userResponse.body.token;

    const response = await request(app)
      .post("/api/v1/api-key")
      .set("Authorization", `Bearer ${token}`)
      .send({
        api_name: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid api-key name", async () => {
    const userResponse = await request(app).post("/api/v1/user/login").send({
      email: "example@gmail.com",
      password: "mypass",
    });

    const token = userResponse.body.token;

    const response = await request(app)
      .post("/api/v1/api-key")
      .set("Authorization", `Bearer ${token}`)
      .send({
        api_name: "a",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
