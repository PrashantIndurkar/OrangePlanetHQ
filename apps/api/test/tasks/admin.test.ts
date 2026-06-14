import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";

describe("Admin Access Overrides", () => {
	it("should allow an admin to access, list, modify, and delete another user's task", async () => {
		// 1. Create and log in User A (Regular User)
		const emailA = `user-a-${Date.now()}@example.com`;
		const signupARes = await request(app).post("/api/v1/auth/signup").send({
			email: emailA,
			password: "password123",
			name: "User A",
			skipSeed: true,
		});
		expect(signupARes.status).toBe(201);
		const tokenA = signupARes.body.token;

		// 2. Create and log in User B (Admin)
		const emailB = `admin-${Date.now()}@example.com`;
		const signupBRes = await request(app).post("/api/v1/auth/signup").send({
			email: emailB,
			password: "password123",
			name: "Admin B",
			skipSeed: true,
		});
		expect(signupBRes.status).toBe(201);
		const tokenB = signupBRes.body.token;
		const adminUser = signupBRes.body.user;

		// Manually update role of Admin B to "admin" in database
		await prisma.user.update({
			where: { id: adminUser.id },
			data: { role: "admin" },
		});

		// 3. User A creates a task
		const createTaskRes = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${tokenA}`)
			.send({
				title: "User A Private Task",
				description: "Private task of user A",
				priority: "medium",
				status: "todo",
			});
		expect(createTaskRes.status).toBe(201);
		const taskId = createTaskRes.body.task.id;

		// 4. Admin attempts to fetch User A's task using unique identifier -> should succeed (200)
		const strUuidCode = `STR-${taskId.slice(0, 8).toUpperCase()}`;
		const getAdminRes = await request(app)
			.get(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenB}`);
		expect(getAdminRes.status).toBe(200);
		expect(getAdminRes.body.task.title).toBe("User A Private Task");

		// 5. Admin lists tasks with allUsers=true parameter -> should return User A's task
		const listAdminRes = await request(app)
			.get("/api/v1/tasks?allUsers=true")
			.set("Authorization", `Bearer ${tokenB}`);
		expect(listAdminRes.status).toBe(200);
		const foundTask = listAdminRes.body.tasks.find(
			(t: { id: string }) => t.id === taskId,
		);
		expect(foundTask).toBeDefined();

		// 6. Admin attempts to update User A's task -> should succeed (200)
		const updateAdminRes = await request(app)
			.patch(`/api/v1/tasks/${taskId}`)
			.set("Authorization", `Bearer ${tokenB}`)
			.send({ title: "Admin Modified Title" });
		expect(updateAdminRes.status).toBe(200);
		expect(updateAdminRes.body.task.title).toBe("Admin Modified Title");

		// 7. Admin attempts to delete User A's task -> should succeed (204)
		const deleteAdminRes = await request(app)
			.delete(`/api/v1/tasks/${taskId}`)
			.set("Authorization", `Bearer ${tokenB}`);
		expect(deleteAdminRes.status).toBe(204);
	});
});
