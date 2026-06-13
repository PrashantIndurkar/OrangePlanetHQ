export const ALLOWED_STATUSES = [
	"backlog",
	"todo",
	"in-progress",
	"in-review",
	"done",
	"canceled",
] as const;

export const ALLOWED_PRIORITIES = [
	"no-priority",
	"urgent",
	"high",
	"medium",
	"low",
] as const;

export const ALLOWED_DUE_DATES = [
	"today",
	"tomorrow",
	"overdue",
	"no-due-date",
] as const;

export const ALLOWED_SORT_BY = ["created", "dueDate", "priority"] as const;
export const ALLOWED_SORT_ORDER = ["asc", "desc"] as const;

export interface ReadOnlySearchParams {
	get(key: string): string | null;
}

export function getNormalizedFilters(searchParams: ReadOnlySearchParams) {
	const activeStatuses = (searchParams.get("status")?.split(",") || [])
		.filter(Boolean)
		.filter((v): v is (typeof ALLOWED_STATUSES)[number] =>
			(ALLOWED_STATUSES as readonly string[]).includes(v),
		);

	const activePriorities = (searchParams.get("priority")?.split(",") || [])
		.filter(Boolean)
		.filter((v): v is (typeof ALLOWED_PRIORITIES)[number] =>
			(ALLOWED_PRIORITIES as readonly string[]).includes(v),
		);

	const activeDueDates = (searchParams.get("due_date")?.split(",") || [])
		.filter(Boolean)
		.filter((v): v is (typeof ALLOWED_DUE_DATES)[number] =>
			(ALLOWED_DUE_DATES as readonly string[]).includes(v),
		);

	const rawSortBy = searchParams.get("sort_by");
	const sortBy =
		rawSortBy && (ALLOWED_SORT_BY as readonly string[]).includes(rawSortBy)
			? (rawSortBy as (typeof ALLOWED_SORT_BY)[number])
			: "created";

	const rawSortOrder = searchParams.get("sort_order");
	const sortOrder =
		rawSortOrder &&
		(ALLOWED_SORT_ORDER as readonly string[]).includes(rawSortOrder)
			? (rawSortOrder as "asc" | "desc")
			: "desc";

	return {
		activeStatuses,
		activePriorities,
		activeDueDates,
		sortBy,
		sortOrder,
	};
}

export interface Task {
	id: string;
	title: string;
	status:
		| "backlog"
		| "todo"
		| "in-progress"
		| "in-review"
		| "done"
		| "canceled";
	priority: "urgent" | "high" | "medium" | "low" | "no-priority";
	dueDate?: string; // e.g. "Today", "Tomorrow", "Overdue", or absent
	createdDate?: string; // e.g. "Created Jun 12"
	createdAt: number; // unix timestamp for sorting
	assigneeName?: string;
	assigneeAvatarUrl?: string;
	description?: string;
	activities?: TaskActivity[];
}

export interface TaskActivity {
	id: string;
	userInitials: string;
	userName: string;
	actionText: string;
	timestamp: number;
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
