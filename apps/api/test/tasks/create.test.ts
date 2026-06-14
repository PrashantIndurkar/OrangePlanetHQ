import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";

describe("Tasks Integration - Creation", () => {
	it("should create tasks with auto-incrementing issue numbers and activity logs, and reject unauthorized requests", async () => {
		// 1. Signup a user to get authorization token
		const email = `task-create-${Date.now()}@example.com`;
		const signupRes = await request(app).post("/api/v1/auth/signup").send({
			email,
			password: "password123",
			name: "Task Creator",
			skipSeed: true,
		});
		expect(signupRes.status).toBe(201);
		const token = signupRes.body.token;

		// 2. Try creating a task without token (should fail)
		const unauthorizedRes = await request(app)
			.post("/api/v1/tasks")
			.send({ title: "No Auth Task" });
		expect(unauthorizedRes.status).toBe(401);

		// 3. Try creating a task with invalid body (no title - should fail)
		const invalidRes = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${token}`)
			.send({ description: "Missing title" });
		expect(invalidRes.status).toBe(400);

		// 4. Create Task 1 successfully
		const task1Res = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "First Task",
				description: "My first task description",
				priority: "high",
				status: "todo",
			});

		expect(task1Res.status).toBe(201);
		expect(task1Res.body).toHaveProperty("task");
		expect(task1Res.body.task).toHaveProperty("id");
		expect(task1Res.body.task.title).toBe("First Task");
		expect(task1Res.body.task.issueNumber).toBe(1); // First task for this user

		const taskId1 = task1Res.body.task.id;

		// 5. Create Task 2 successfully (verify issue number auto-increments to 2)
		const task2Res = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Second Task",
				priority: "low",
				status: "backlog",
			});

		expect(task2Res.status).toBe(201);
		expect(task2Res.body.task.issueNumber).toBe(2);

		// 6. Verify that an ActivityLog was created for Task 1
		const activityLogs = await prisma.activityLog.findMany({
			where: { taskId: taskId1 },
		});
		expect(activityLogs.length).toBe(1);
		expect(activityLogs[0].actionText).toBe("created this issue");
		expect(activityLogs[0].userName).toBe("Task Creator");
	});
});
