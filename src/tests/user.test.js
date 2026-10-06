import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../index.js";

describe("POST /api/v1/user/register", () => {
  //   it("Create new user", async () => {
  //     const response = await request(app).post("/api/v1/user/register").send({
  //       email: "example10@gmail.com",
  //       password: "mypass",
  //     });

  //     expect(response.status).toBe(201);
  //     expect(response.body.success).toBe(true);
  //   });

  it("should reject missing field.", async () => {
    const response = await request(app).post("/api/v1/user/register").send({});

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(400);
  });

  it("should reject missing email.", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      password: "mypass",
    });

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(400);
  });

  it("should reject missing password.", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      email: "example9@gmail.com",
    });

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(400);
  });

  it("should reject, if user already exist.", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      email: "example8@gmail.com",
      password: "mypass",
    });

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(409);
  });
});
