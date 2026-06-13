import request from "supertest";
import app from "../src/app.js";

export async function runTasksTests() {
	console.log("\n🏃 Running Tasks Integration Tests...");
	const emailA = `test-task-a-${Date.now()}@example.com`;
	const emailB = `test-task-b-${Date.now()}@example.com`;
	const password = "password123";

	let tokenA = "";
	let tokenB = "";
	let taskIDA = "";
	let taskIdB = "";

	try {
		// Preparation: Signup User A and User B
		console.log("➡️ Preparing test users...");
		const signupARes = await request(app).post("/api/v1/auth/signup").send({
			email: emailA,
			password,
			name: "User A",
		});
		if (signupARes.status !== 201) {
			throw new Error(`Signup User A failed: ${JSON.stringify(signupARes.body)}`);
		}
		tokenA = signupARes.body.token;

		const signupBRes = await request(app).post("/api/v1/auth/signup").send({
			email: emailB,
			password,
			name: "User B",
		});
		if (signupBRes.status !== 201) {
			throw new Error(`Signup User B failed: ${JSON.stringify(signupBRes.body)}`);
		}
		tokenB = signupBRes.body.token;

		console.log("✅ Test users ready");

		// Test 1: User A creates a task
		console.log("➡️ Test 1: User A creates a task...");
		const createRes = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${tokenA}`)
			.send({
				title: "Task 1 for User A",
				description: "This is a detailed description",
				priority: "high",
				status: "todo",
			});

		if (createRes.status !== 201) {
			throw new Error(`Expected 201, got ${createRes.status}: ${JSON.stringify(createRes.body)}`);
		}
		if (!createRes.body.task || !createRes.body.task.id) {
			throw new Error(`Response does not contain task object: ${JSON.stringify(createRes.body)}`);
		}
		taskIDA = createRes.body.task.id;
		console.log(`✅ Task created with ID: ${taskIDA}`);

		// Test 2: User A retrieves the created task
		console.log("➡️ Test 2: User A retrieves their own task...");
		const getRes = await request(app)
			.get(`/api/v1/tasks/${taskIDA}`)
			.set("Authorization", `Bearer ${tokenA}`);

		if (getRes.status !== 200) {
			throw new Error(`Expected 200, got ${getRes.status}`);
		}
		if (getRes.body.task.title !== "Task 1 for User A") {
			throw new Error(`Task title mismatch: ${getRes.body.task.title}`);
		}
		console.log("✅ Task retrieval passed");

		// Test 3: User B attempts to retrieve User A's task (isolation check)
		console.log("➡️ Test 3: User B attempts to retrieve User A's task (Boundary Guard)...");
		const getBRes = await request(app)
			.get(`/api/v1/tasks/${taskIDA}`)
			.set("Authorization", `Bearer ${tokenB}`);

		if (getBRes.status !== 404) {
			throw new Error(`Expected 404 for tenant boundary check, got ${getBRes.status}: ${JSON.stringify(getBRes.body)}`);
		}
		if (!getBRes.body.error || getBRes.body.error.message !== "Task not found") {
			throw new Error(`Expected Error message 'Task not found', got: ${JSON.stringify(getBRes.body)}`);
		}
		console.log("✅ User isolation boundary retrieval guard passed");

		// Test 4: User A updates task (partial, setting description to null)
		console.log("➡️ Test 4: User A updates task description to null and title to updated...");
		const updateRes = await request(app)
			.patch(`/api/v1/tasks/${taskIDA}`)
			.set("Authorization", `Bearer ${tokenA}`)
			.send({
				title: "Updated Task 1 for User A",
				description: null,
			});

		if (updateRes.status !== 200) {
			throw new Error(`Expected 200, got ${updateRes.status}: ${JSON.stringify(updateRes.body)}`);
		}
		if (updateRes.body.task.title !== "Updated Task 1 for User A" || updateRes.body.task.description !== null) {
			throw new Error(`Update check failed: ${JSON.stringify(updateRes.body.task)}`);
		}
		console.log("✅ Partial nullable update passed");

		// Test 5: User B attempts to update User A's task (isolation check)
		console.log("➡️ Test 5: User B attempts to update User A's task (Boundary Guard)...");
		const updateBRes = await request(app)
			.patch(`/api/v1/tasks/${taskIDA}`)
			.set("Authorization", `Bearer ${tokenB}`)
			.send({
				title: "Malicious update attempt",
			});

		if (updateBRes.status !== 404) {
			throw new Error(`Expected 404, got ${updateBRes.status}`);
		}
		console.log("✅ User isolation boundary update guard passed");

		// Test 6: Create more tasks for listing/sorting/filtering validation
		console.log("➡️ Preparing additional tasks for list filtering...");
		const task2Res = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${tokenA}`)
			.send({
				title: "Task 2 for User A (urgent backlog)",
				priority: "urgent",
				status: "backlog",
			});
		if (task2Res.status !== 201) {
			throw new Error("Failed to create task 2");
		}

		const task3Res = await request(app)
			.post("/api/v1/tasks")
			.set("Authorization", `Bearer ${tokenA}`)
			.send({
				title: "Task 3 for User A (low in-progress)",
				priority: "low",
				status: "in-progress",
			});
		if (task3Res.status !== 201) {
			throw new Error("Failed to create task 3");
		}

		// List endpoint check
		console.log("➡️ Test 6: User A lists their tasks...");
		const listRes = await request(app)
			.get("/api/v1/tasks")
			.set("Authorization", `Bearer ${tokenA}`);

		if (listRes.status !== 200) {
			throw new Error(`Expected 200, got ${listRes.status}`);
		}
		if (listRes.body.total !== 3 || listRes.body.tasks.length !== 3) {
			throw new Error(`Expected total 3, got: ${JSON.stringify(listRes.body)}`);
		}
		console.log("✅ List all tasks passed");

		// List filtering by status
		console.log("➡️ Test 6b: User A lists and filters by status (todo,in-progress)...");
		const listFilteredStatusRes = await request(app)
			.get("/api/v1/tasks?status=todo,in-progress")
			.set("Authorization", `Bearer ${tokenA}`);

		if (listFilteredStatusRes.status !== 200) {
			throw new Error("Failed listing with status filter");
		}
		if (listFilteredStatusRes.body.total !== 2) {
			throw new Error(`Expected total 2, got: ${listFilteredStatusRes.body.total}`);
		}
		console.log("✅ Status filtering passed");

		// List filtering by priority
		console.log("➡️ Test 6c: User A lists and filters by priority (urgent)...");
		const listFilteredPriorityRes = await request(app)
			.get("/api/v1/tasks?priority=urgent")
			.set("Authorization", `Bearer ${tokenA}`);

		if (listFilteredPriorityRes.body.total !== 1 || listFilteredPriorityRes.body.tasks[0].priority !== "urgent") {
			throw new Error(`Expected urgent task, got: ${JSON.stringify(listFilteredPriorityRes.body)}`);
		}
		console.log("✅ Priority filtering passed");

		// List search check
		console.log("➡️ Test 6d: User A lists and searches text...");
		const searchRes = await request(app)
			.get("/api/v1/tasks?search=backlog")
			.set("Authorization", `Bearer ${tokenA}`);

		if (searchRes.body.total !== 1 || !searchRes.body.tasks[0].title.includes("backlog")) {
			throw new Error(`Search failure: ${JSON.stringify(searchRes.body)}`);
		}
		console.log("✅ Text search passed");

		// Sorting check
		console.log("➡️ Test 6e: User A lists and sorts by priority desc...");
		const sortRes = await request(app)
			.get("/api/v1/tasks?sortBy=priority&sortOrder=desc")
			.set("Authorization", `Bearer ${tokenA}`);

		// Order of priorities desc: urgent, high, low
		const titles = sortRes.body.tasks.map((t: any) => t.title);
		if (!titles[0].includes("urgent") || !titles[1].includes("Updated Task 1") || !titles[2].includes("low")) {
			throw new Error(`Sort mismatch: ${JSON.stringify(titles)}`);
		}
		console.log("✅ Sorting passed");

		// Test 7: User B attempts to delete User A's task (isolation check)
		console.log("➡️ Test 7: User B attempts to delete User A's task (Boundary Guard)...");
		const deleteBRes = await request(app)
			.delete(`/api/v1/tasks/${taskIDA}`)
			.set("Authorization", `Bearer ${tokenB}`);

		if (deleteBRes.status !== 404) {
			throw new Error(`Expected 404, got ${deleteBRes.status}`);
		}
		console.log("✅ User isolation boundary delete guard passed");

		// Test 8: User A deletes their own task
		console.log("➡️ Test 8: User A deletes their own task...");
		const deleteARes = await request(app)
			.delete(`/api/v1/tasks/${taskIDA}`)
			.set("Authorization", `Bearer ${tokenA}`);

		if (deleteARes.status !== 204) {
			throw new Error(`Expected 204, got ${deleteARes.status}`);
		}
		console.log("✅ Task deletion passed");

		// Test 9: Verify task is gone
		console.log("➡️ Test 9: Verify deleted task returns 404...");
		const verifyDeletedRes = await request(app)
			.get(`/api/v1/tasks/${taskIDA}`)
			.set("Authorization", `Bearer ${tokenA}`);

		if (verifyDeletedRes.status !== 404) {
			throw new Error(`Expected 404, got ${verifyDeletedRes.status}`);
		}
		console.log("✅ Verification of deleted task passed");

		console.log("🎉 ALL TASKS TESTS PASSED SUCCESSFULLY!");
	} catch (error) {
		console.error("❌ TASK TEST FAILURE:", error);
		throw error;
	}
}
