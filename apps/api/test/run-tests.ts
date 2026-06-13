import request from "supertest";
import app from "../src/app.js";

async function run() {
	console.log("🏃 Running Custom Auth Integration Tests...");
	const uniqueEmail = `test-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;

	try {
		// Test 1: Sign up
		console.log("➡️ Test 1: Signup User...");
		const signupRes = await request(app).post("/api/v1/auth/signup").send({
			email: uniqueEmail,
			password: "password123",
			name: "Test User",
		});

		if (signupRes.status !== 201) {
			throw new Error(
				`Signup failed with status ${signupRes.status}: ${JSON.stringify(signupRes.body)}`,
			);
		}
		if (!signupRes.body.token) {
			throw new Error("Signup did not return token");
		}
		console.log("✅ Signup passed");

		// Test 2: Double signup failure
		console.log("➡️ Test 2: Duplicate Signup Preventions...");
		const doubleSignupRes = await request(app)
			.post("/api/v1/auth/signup")
			.send({
				email: uniqueEmail,
				password: "password123",
				name: "Test User",
			});

		if (doubleSignupRes.status !== 400) {
			throw new Error(
				`Expected 400 for duplicate signup, got ${doubleSignupRes.status}`,
			);
		}
		console.log("✅ Duplicate signup check passed");

		// Test 3: Log in
		console.log("➡️ Test 3: Login User...");
		const loginRes = await request(app).post("/api/v1/auth/login").send({
			email: uniqueEmail,
			password: "password123",
		});

		if (loginRes.status !== 200) {
			throw new Error(`Login failed with status ${loginRes.status}`);
		}
		if (!loginRes.body.token) {
			throw new Error("Login did not return token");
		}
		console.log("✅ Login passed");

		// Test 4: Wrong password
		console.log("➡️ Test 4: Invalid Password Guard...");
		const wrongLoginRes = await request(app).post("/api/v1/auth/login").send({
			email: uniqueEmail,
			password: "wrongpassword",
		});

		if (wrongLoginRes.status !== 401) {
			throw new Error(
				`Expected 401 for wrong password, got ${wrongLoginRes.status}`,
			);
		}
		console.log("✅ Invalid password check passed");

		// Test 5: Me endpoint
		console.log("➡️ Test 5: Get Profile with Bearer Token...");
		const token = loginRes.body.token;
		const meRes = await request(app)
			.get("/api/v1/auth/me")
			.set("Authorization", `Bearer ${token}`);

		if (meRes.status !== 200) {
			throw new Error(`GET /me failed with status ${meRes.status}`);
		}
		if (meRes.body.user.email !== uniqueEmail) {
			throw new Error(
				`Expected email ${uniqueEmail}, got ${meRes.body.user.email}`,
			);
		}
		console.log("✅ GET /me authorization check passed");

		console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
		process.exit(0);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		console.error("\n❌ TEST FAILED:", message);
		process.exit(1);
	}
}

run();
