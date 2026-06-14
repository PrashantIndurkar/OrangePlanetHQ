import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";

describe("Auth Integration - Signup Success", () => {
	it("should successfully register a user, hash password, and prevent duplicate signups", async () => {
		const uniqueEmail = `success-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
		const password = "password123";

		// 1. Perform Signup request
		const signupRes = await request(app).post("/api/v1/auth/signup").send({
			email: uniqueEmail,
			password: password,
			name: "Successful User",
			skipSeed: true,
		});

		expect(signupRes.status).toBe(201);
		expect(signupRes.body).toHaveProperty("token");
		expect(signupRes.body.user).toHaveProperty("email", uniqueEmail);
		expect(signupRes.body.user).not.toHaveProperty("passwordHash");

		// 2. Verify existence in the database directly using Prisma
		const dbUser = await prisma.user.findUnique({
			where: { email: uniqueEmail },
		});

		expect(dbUser).not.toBeNull();
		expect(dbUser?.email).toBe(uniqueEmail);
		expect(dbUser?.name).toBe("Successful User");

		// 3. Verify that password is hashed (not plain text)
		expect(dbUser?.passwordHash).not.toBe(password);
		expect(dbUser?.passwordHash.length).toBeGreaterThan(20); // standard bcrypt hashes are long

		// 4. Verify duplicate signup fails with a 400 error
		const duplicateRes = await request(app).post("/api/v1/auth/signup").send({
			email: uniqueEmail,
			password: password,
			name: "Successful User",
			skipSeed: true,
		});

		expect(duplicateRes.status).toBe(400);
		expect(duplicateRes.body).toHaveProperty("error");
		expect(duplicateRes.body.error.message.toLowerCase()).toContain("already registered");
	});
});
