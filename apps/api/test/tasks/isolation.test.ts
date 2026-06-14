import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";

describe("Tasks Integration - Ownership and Tenant Boundary Isolation", () => {
	it("should enforce user boundaries and prevent User B from accessing/mutating User A's tasks", async () => {
		// 1. Create and log in User A
		const emailA = `user-a-${Date.now()}@example.com`;
		const signupARes = await request(app).post("/api/v1/auth/signup").send({
			email: emailA,
			password: "password123",
			name: "User A",
			skipSeed: true,
		});
		expect(signupARes.status).toBe(201);
		const tokenA = signupARes.body.token;

		// 2. Create and log in User B
		const emailB = `user-b-${Date.now()}@example.com`;
		const signupBRes = await request(app).post("/api/v1/auth/signup").send({
			email: emailB,
			password: "password123",
			name: "User B",
			skipSeed: true,
		});
		expect(signupBRes.status).toBe(201);
		const tokenB = signupBRes.body.token;

		// 3. User A creates a task
		const createTaskRes = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${tokenA}`)
			.send({
				title: "User A Task",
				description: "This belongs to User A",
				priority: "medium",
				status: "todo",
			});
		expect(createTaskRes.status).toBe(201);
		const taskId = createTaskRes.body.task.id;
		const strUuidCode = `STR-${taskId.slice(0, 8).toUpperCase()}`;

		// 4. User B attempts to GET User A's task -> should return 404 (or 403, but our app returns 404 for security obfustication)
		const getBRes = await request(app)
			.get(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenB}`);
		expect(getBRes.status).toBe(404);
		expect(getBRes.body.error.message).toContain("not found");

		// 5. User B attempts to UPDATE User A's task -> should return 404
		const updateBRes = await request(app)
			.patch(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenB}`)
			.send({ title: "Hacked Title" });
		expect(updateBRes.status).toBe(404);

		// 6. User B attempts to DELETE User A's task -> should return 404
		const deleteBRes = await request(app)
			.delete(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenB}`);
		expect(deleteBRes.status).toBe(404);

		// 7. Verify User A can fetch the task successfully
		const getARes = await request(app)
			.get(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenA}`);
		expect(getARes.status).toBe(200);
		expect(getARes.body.task.title).toBe("User A Task");

		// 8. Verify User A can update the task successfully
		const updateARes = await request(app)
			.patch(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenA}`)
			.send({ title: "User A Updated Task" });
		expect(updateARes.status).toBe(200);
		expect(updateARes.body.task.title).toBe("User A Updated Task");

		// 9. Verify User A can delete the task successfully
		const deleteARes = await request(app)
			.delete(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenA}`);
		expect(deleteARes.status).toBe(204);

		// 10. Verify User A gets a 404 now that the task is deleted
		const getADeletedRes = await request(app)
			.get(`/api/v1/tasks/${strUuidCode}`)
			.set("Authorization", `Bearer ${tokenA}`);
		expect(getADeletedRes.status).toBe(404);
	});
});
