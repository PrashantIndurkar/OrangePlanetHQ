import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";

describe("Auth Integration - Login and Profile", () => {
	it("should authenticate valid users, reject invalid credentials, and retrieve user profiles", async () => {
		const email = `login-${Date.now()}@example.com`;
		const password = "password123";

		// 1. Create a user first
		const signupRes = await request(app).post("/api/v1/auth/signup").send({
			email,
			password,
			name: "Login User",
			skipSeed: true,
		});
		expect(signupRes.status).toBe(201);

		// 2. Login with correct credentials
		const loginRes = await request(app).post("/api/v1/auth/login").send({
			email,
			password,
		});

		expect(loginRes.status).toBe(200);
		expect(loginRes.body).toHaveProperty("token");
		expect(loginRes.body.user).toHaveProperty("email", email);
		expect(loginRes.body.user).toHaveProperty("name", "Login User");
		expect(loginRes.body.user).toHaveProperty("role", "user");
		expect(loginRes.body.user).not.toHaveProperty("passwordHash");

		const token = loginRes.body.token;

		// 3. Login with wrong password should fail
		const wrongPassRes = await request(app).post("/api/v1/auth/login").send({
			email,
			password: "wrongpassword",
		});
		expect(wrongPassRes.status).toBe(401);
		expect(wrongPassRes.body).toHaveProperty("error");
		expect(wrongPassRes.body.error.message.toLowerCase()).toContain("invalid");

		// 4. Login with non-existent email should fail
		const nonExistentRes = await request(app).post("/api/v1/auth/login").send({
			email: "non-existent@example.com",
			password,
		});
		expect(nonExistentRes.status).toBe(401);

		// 5. Access /me endpoint with correct token
		const meRes = await request(app)
			.get("/api/v1/auth/me")
			.set("Authorization", `Bearer ${token}`);

		expect(meRes.status).toBe(200);
		expect(meRes.body.user).toHaveProperty("email", email);
		expect(meRes.body.user).toHaveProperty("name", "Login User");

		// 6. Access /me endpoint without token should fail
		const meNoTokenRes = await request(app).get("/api/v1/auth/me");
		expect(meNoTokenRes.status).toBe(401);
	});
});
