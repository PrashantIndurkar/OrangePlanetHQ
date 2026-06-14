import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";

describe("Tasks Integration - Pagination, Sorting, and Filtering", () => {
	it("should paginate, sort, and filter task lists correctly based on query parameters", async () => {
		const email = `task-list-${Date.now()}@example.com`;

		// 1. Register user with skipSeed: false to auto-generate 26 default dummy tasks
		const signupRes = await request(app).post("/api/v1/auth/signup").send({
			email,
			password: "password123",
			name: "List User",
			skipSeed: false, // This will seed 26 tasks in database transaction
		});
		expect(signupRes.status).toBe(201);
		const token = signupRes.body.token;

		// 2. Fetch page 1 with limit of 10
		const page1Res = await request(app)
			.get("/api/v1/tasks?page=1&limit=10")
			.set("Authorization", `Bearer ${token}`);

		expect(page1Res.status).toBe(200);
		expect(page1Res.body).toHaveProperty("tasks");
		expect(page1Res.body).toHaveProperty("total", 26);
		expect(page1Res.body.tasks.length).toBe(10);

		// 3. Fetch page 3 with limit of 10
		const page3Res = await request(app)
			.get("/api/v1/tasks?page=3&limit=10")
			.set("Authorization", `Bearer ${token}`);

		expect(page3Res.status).toBe(200);
		expect(page3Res.body.tasks.length).toBe(6); // 26 - 20 = 6

		// 4. Test filtering by status (e.g. 'todo')
		const filteredStatusRes = await request(app)
			.get("/api/v1/tasks?status=todo&page=1&limit=30")
			.set("Authorization", `Bearer ${token}`);

		expect(filteredStatusRes.status).toBe(200);
		expect(filteredStatusRes.body.tasks.length).toBeGreaterThan(0);
		for (const task of filteredStatusRes.body.tasks) {
			expect(task.status).toBe("todo");
		}

		// 5. Test filtering by priority (e.g. 'urgent')
		const filteredPriorityRes = await request(app)
			.get("/api/v1/tasks?priority=urgent&page=1&limit=30")
			.set("Authorization", `Bearer ${token}`);

		expect(filteredPriorityRes.status).toBe(200);
		expect(filteredPriorityRes.body.tasks.length).toBeGreaterThan(0);
		for (const task of filteredPriorityRes.body.tasks) {
			expect(task.priority).toBe("urgent");
		}

		// 6. Test sorting (sortBy=priority, sortOrder=desc)
		const sortedPriorityRes = await request(app)
			.get("/api/v1/tasks?sortBy=priority&sortOrder=desc&page=1&limit=10")
			.set("Authorization", `Bearer ${token}`);

		expect(sortedPriorityRes.status).toBe(200);
		const priorities = sortedPriorityRes.body.tasks.map((t: { priority: string }) => t.priority);
		// With desc sort, urgent tasks should appear at the top. Let's make sure the first one is indeed urgent
		expect(priorities[0]).toBe("urgent");
	});
});
