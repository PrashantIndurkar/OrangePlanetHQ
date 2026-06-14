import { describe, expect, it } from "vitest";
import { comparePassword, generateToken, hashPassword, verifyToken } from "./auth.utils.js";

describe("Auth Utilities Unit Tests", () => {
	describe("Password Cryptography", () => {
		it("should hash a password and confirm matching passwords successfully", async () => {
			const plainText = "mySecurePassword123";
			const hashed = await hashPassword(plainText);

			// Hash should not equal plain text
			expect(hashed).not.toBe(plainText);
			expect(hashed.length).toBeGreaterThan(10);

			// Hashed password matches original password
			const isMatch = await comparePassword(plainText, hashed);
			expect(isMatch).toBe(true);

			// Hashed password does not match a different password
			const isWrongMatch = await comparePassword("wrongPassword", hashed);
			expect(isWrongMatch).toBe(false);
		});
	});

	describe("JWT Handling", () => {
		it("should sign and verify JWT tokens successfully", () => {
			const payload = { id: "user-123", email: "test@example.com", role: "admin" };
			const token = generateToken(payload);

			expect(token).toBeTypeOf("string");
			expect(token.length).toBeGreaterThan(10);

			// Verify and decode token
			const decoded = verifyToken(token);
			expect(decoded).toHaveProperty("id", "user-123");
			expect(decoded).toHaveProperty("email", "test@example.com");
			expect(decoded).toHaveProperty("role", "admin");
			expect(decoded).toHaveProperty("exp"); // Expiration field added by jwt.sign
		});

		it("should fail validation on malformed tokens", () => {
			expect(() => verifyToken("invalid-malformed-jwt-token")).toThrow();
		});
	});
});
