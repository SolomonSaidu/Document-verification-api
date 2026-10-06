import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../index.js";

describe("API", () => {
  it("Should respond...", async () => {
    const response = await request(app).get("/api");

    expect(response.status).toBe(200);
  });
});
