import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("Auth Endpoints", () => {
	const uniqueEmail = `test-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;

	it("should sign up a user successfully", async () => {
		const res = await request(app).post("/api/v1/auth/signup").send({
			email: uniqueEmail,
			password: "password123",
			name: "Test User",
		});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("token");
		expect(res.body.user).toHaveProperty("email", uniqueEmail);
		expect(res.body.user).not.toHaveProperty("passwordHash");
	});

	it("should not sign up an already registered email", async () => {
		const res = await request(app).post("/api/v1/auth/signup").send({
			email: uniqueEmail,
			password: "password123",
			name: "Test User",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toContain("registered");
	});

	it("should log in successfully with correct credentials", async () => {
		const res = await request(app).post("/api/v1/auth/login").send({
			email: uniqueEmail,
			password: "password123",
		});

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("token");
		expect(res.body.user.email).toBe(uniqueEmail);
	});

	it("should fail to log in with incorrect credentials", async () => {
		const res = await request(app).post("/api/v1/auth/login").send({
			email: uniqueEmail,
			password: "wrongpassword",
		});

		expect(res.status).toBe(401);
	});

	it("should fetch active user details from /me", async () => {
		const loginRes = await request(app).post("/api/v1/auth/login").send({
			email: uniqueEmail,
			password: "password123",
		});

		const token = loginRes.body.token;

		const res = await request(app)
			.get("/api/v1/auth/me")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.user).toHaveProperty("email", uniqueEmail);
	});
});
