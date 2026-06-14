import type { Prisma } from "@prisma/client";

/**
 * Seeds a set of initial dummy tasks and their corresponding activity logs for a new user.
 * Runs inside the signup database transaction context.
 */
export async function seedInitialTasks(
	tx: Omit<
		Prisma.TransactionClient,
		"$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
	>,
	userId: string,
	userName: string,
	_userEmail: string,
): Promise<void> {
	const userInitials = userName
		? userName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 1)
		: "U";

	const dummyTasksData = Array.from({ length: 26 }, (_, idx) => {
		const num = idx + 1;
		const statuses = ["backlog", "todo", "in-progress", "done", "canceled"];
		const priorities = ["no-priority", "low", "medium", "high", "urgent"];

		const status = statuses[idx % statuses.length];
		const priority = priorities[idx % priorities.length];

		let dueDate: Date | null = null;
		if (idx % 4 === 1) {
			dueDate = new Date(); // Today
		} else if (idx % 4 === 2) {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			dueDate = tomorrow;
		} else if (idx % 4 === 3) {
			const overdue = new Date();
			overdue.setDate(overdue.getDate() - 2);
			dueDate = overdue;
		}

		return {
			issueNumber: num,
			title: `Default Assessment Issue #${num}`,
			description: `This is dummy task #${num} automatically created to verify server-side searching, sorting, pagination, and filters.`,
			status,
			priority,
			dueDate,
			userId,
		};
	});

	for (const taskData of dummyTasksData) {
		const task = await tx.task.create({
			data: taskData,
		});

		await tx.activityLog.create({
			data: {
				taskId: task.id,
				userId,
				userName,
				userInitials,
				actionText: "created this issue",
			},
		});
	}
}
