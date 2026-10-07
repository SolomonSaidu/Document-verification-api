import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../index.js";

// Register new user
describe("POST /api/v1/user/register", () => {
  it("Create new user", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      email: "example@gmail.com",
      password: "mypass",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should reject invalid password", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      email: "example10@gmail.com",
      password: "m",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid email", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      email: "example10gmail.com",
      password: "mypass",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

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

  it("should reject user already exist.", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      email: "example8@gmail.com",
      password: "mypass",
    });

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(409);
  });
});

// Login Test
describe("POST /api/v1/user/login", () => {
  it("should login user", async () => {
    const response = await request(app).post("/api/v1/user/login").send({
      email: "example1@gmail.com",
      password: "mypass",
    });

    expect(response.status).toBe(200);
    console.log(response.body.message);

    expect(response.body.success).toBe(true);
  });

  it("should reject missing field", async () => {
    const response = await request(app).post("/api/v1/user/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing email", async () => {
    const response = await request(app).post("/api/v1/user/login").send({
      password: "mypass",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing password", async () => {
    const response = await request(app).post("/api/v1/user/login").send({
      email: "example1@gmail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject user not found", async () => {
    const response = await request(app).post("/api/v1/user/login").send({
      email: "unknown@gmail.com",
      password: "mypass",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject incorrect password", async () => {
    const response = await request(app).post("/api/v1/user/login").send({
      email: "example1@gmail.com",
      password: "wrongpass",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
