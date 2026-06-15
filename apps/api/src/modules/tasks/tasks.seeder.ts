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

	const realLifeTitles = [
		"Set up CI/CD pipeline using GitHub Actions",
		"Refactor auth middleware to support MFA",
		"Optimize database indexes on primary transactions table",
		"Implement dark mode theme using Tailwind CSS v4",
		"Fix memory leak in websocket event listeners",
		"Upgrade React to version 19 and resolve breaking changes",
		"Add end-to-end integration tests using Playwright",
		"Implement real-time search with debounce on frontend",
		"Integrate Cloudinary service for image uploading",
		"Resolve security vulnerabilities reported by npm audit",
		"Design and implement user onboarding dashboard flow",
		"Setup centralized logging using Winston and Datadog",
		"Fix layout alignment bugs in responsive mobile views",
		"Implement role-based access control (RBAC) on task routes",
		"Create Docker compose configuration for local development",
		"Optimize Largest Contentful Paint (LCP) for landing page",
		"Add pagination and query filters to tasks endpoint",
		"Set up Redis cache for frequently accessed endpoints",
		"Implement password reset flow with secure token validation",
		"Add interactive analytics charts for user task completion",
		"Configure Husky git hooks for automated pre-commit linting",
		"Optimize bundle size by implementing code splitting",
		"Fix hydration errors in server-side rendered layouts",
		"Write API documentation using Swagger/OpenAPI specifications",
		"Implement auto-save functionality for description edits",
		"Resolve CORS policy issues on dev websocket handshake",
	];

	const unsplashImages = [
		"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
		"https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80",
	];

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

		// Distribute at least 10 images across seed data (e.g. index 0, 2, 5, 7, 10, 12, 15, 17, 20)
		const imageIndexes = [0, 2, 5, 7, 10, 12, 15, 17, 20];
		const imageIndexInArray = imageIndexes.indexOf(idx);

		let description = `<p>This task involves ${realLifeTitles[idx].toLowerCase()}. Please review and assign to the correct team member.</p>`;
		if (imageIndexInArray !== -1) {
			const imgUrl = unsplashImages[imageIndexInArray % unsplashImages.length];
			description += `<p><img src="${imgUrl}" class="kaneo-editor-image" alt="Development image for ${realLifeTitles[idx]}" /></p>`;
		}

		return {
			issueNumber: num,
			title: realLifeTitles[idx] || `Development Issue #${num}`,
			description,
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
