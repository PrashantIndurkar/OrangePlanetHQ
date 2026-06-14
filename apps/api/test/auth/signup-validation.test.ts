import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";

describe("Auth Integration - Signup Validation Errors", () => {
	it("should return a 400 error when email is empty", async () => {
		const res = await request(app).post("/api/v1/auth/signup").send({
			email: "",
			password: "password123",
			name: "Test User",
			skipSeed: true,
		});

		expect(res.status).toBe(400);
		// Check that the error response structure matches validate.middleware.ts output format
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toHaveProperty("message");
		expect(res.body.error.message.toLowerCase()).toContain("email");
	});

	it("should return a 400 error when email format is invalid", async () => {
		const res = await request(app).post("/api/v1/auth/signup").send({
			email: "invalid-email-format",
			password: "password123",
			name: "Test User",
			skipSeed: true,
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error.message.toLowerCase()).toContain("email");
	});

	it("should return a 400 error when password is too short", async () => {
		const res = await request(app).post("/api/v1/auth/signup").send({
			email: `valid-${Date.now()}@example.com`,
			password: "123",
			name: "Test User",
			skipSeed: true,
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error.message.toLowerCase()).toContain("password");
	});
});
