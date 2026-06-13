export interface Task {
	id: string;
	title: string;
	status: "backlog" | "todo" | "in-progress" | "done" | "canceled";
	priority: "urgent" | "high" | "medium" | "low" | "no-priority";
	dueDate?: string; // e.g. "Today", "Tomorrow", "Overdue", or absent
	createdDate?: string; // e.g. "Created Jun 12"
	createdAt: number; // unix timestamp for sorting
	assigneeName?: string;
	assigneeAvatarUrl?: string;
}

export type DueDateCategory = "today" | "tomorrow" | "overdue" | "no-due-date";

export function getDueDateCategory(task: Task): DueDateCategory {
	if (!task.dueDate) return "no-due-date";
	const normalized = task.dueDate.toLowerCase();
	if (normalized === "today") return "today";
	if (normalized === "tomorrow") return "tomorrow";
	if (
		normalized === "overdue" ||
		normalized.includes("ago") ||
		normalized.includes("yesterday")
	)
		return "overdue";
	return "no-due-date";
}

function getDueDateSortValue(task: Task): number {
	if (!task.dueDate) return Infinity; // No due date at the bottom
	const category = getDueDateCategory(task);
	switch (category) {
		case "overdue":
			return 1;
		case "today":
			return 2;
		case "tomorrow":
			return 3;
		default:
			return 4;
	}
}

function getPrioritySortValue(priority: string): number {
	switch (priority) {
		case "urgent":
			return 4;
		case "high":
			return 3;
		case "medium":
			return 2;
		case "low":
			return 1;
		default:
			return 0;
	}
}

export function filterAndSortTasks(
	tasks: Task[],
	activeStatuses: string[],
	activePriorities: string[],
	activeDueDates: string[],
	sortBy: string,
	sortOrder: "asc" | "desc",
	searchQuery = "",
	searchableFields: (keyof Task)[] = ["title", "id"],
): Task[] {
	let result = [...tasks];

	// 1. Search (case-insensitive, partial matching)
	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase().trim();
		result = result.filter((task) => {
			return searchableFields.some((field) => {
				const val = task[field];
				return val != null && String(val).toLowerCase().includes(query);
			});
		});
	}

	// 2. Filtering
	if (activeStatuses.length > 0) {
		result = result.filter((task) => activeStatuses.includes(task.status));
	}

	if (activePriorities.length > 0) {
		result = result.filter((task) => activePriorities.includes(task.priority));
	}

	if (activeDueDates.length > 0) {
		result = result.filter((task) => {
			const category = getDueDateCategory(task);
			return activeDueDates.includes(category);
		});
	}

	// 2. Sorting
	result.sort((a, b) => {
		let compare = 0;
		if (sortBy === "created") {
			compare = a.createdAt - b.createdAt;
		} else if (sortBy === "dueDate") {
			const dueA = getDueDateSortValue(a);
			const dueB = getDueDateSortValue(b);
			compare = dueA - dueB;
		} else if (sortBy === "priority") {
			const prioA = getPrioritySortValue(a.priority);
			const prioB = getPrioritySortValue(b.priority);
			compare = prioA - prioB;
		}

		return sortOrder === "asc" ? compare : -compare;
	});

	return result;
}
