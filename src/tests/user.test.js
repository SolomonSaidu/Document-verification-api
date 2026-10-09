import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../index.js";
import userHelper from "./helper/user.helper.js";

// Register new user
describe("POST /api/v1/user/register", () => {
  it("Create new user", async () => {
    const response = await userHelper.createUser("exaple4@gmail.com", "mypass");

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should reject invalid password", async () => {
    const response = await userHelper.createUser("exaple5@gmail.com", "my");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid email", async () => {
    const response = await userHelper.createUser(
      "example10gmail.com",
      "mypass",
    );

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing field.", async () => {
    const response = await userHelper.createUser();

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(400);
  });

  it("should reject missing email.", async () => {
    const response = await userHelper.createUser("", "mypass");

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(400);
  });

  it("should reject missing password.", async () => {
    const response = await userHelper.createUser("example@gmail.com", "");

    expect(response.body.success).toBe(false);
    expect(response.status).toBe(400);
  });

  it("should reject user already exist.", async () => {
    const response = await userHelper.createUser(
      "example100@gmail.com",
      "mypass",
    );

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });
});

// Login Test
describe("POST /api/v1/user/login", () => {
  it("should login user", async () => {
    const response = await userHelper.loginUser("example1@gmail.com", "mypass");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should reject missing field", async () => {
    const response = await userHelper.loginUser("", "");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing email", async () => {
    const response = await userHelper.loginUser("", "mypass");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing password", async () => {
    const response = await userHelper.loginUser("example1@gmail.com");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject user not found", async () => {
    const response = await userHelper.loginUser("unknown@gmail.com", "mypass");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject incorrect password", async () => {
    const response = await userHelper.loginUser(
      "example1@gmail.com",
      "wrongpass",
    );

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
