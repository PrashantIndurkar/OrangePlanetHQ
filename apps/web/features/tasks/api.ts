import type {
	BackendTask,
	CreateTaskInput,
	ListTasksResponse,
	TaskResponse,
	UpdateTaskInput,
} from "./types";

const STORAGE_KEY = "orangeplanet_mock_tasks";

function getTasks(): BackendTask[] {
	if (typeof window === "undefined") return [];
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) {
		const initialTasks: BackendTask[] = [
			{
				id: "task-1",
				issueNumber: 1,
				title: "Implement tRPC Adapters",
				description:
					"<p>Set up tRPC routers on Express backend and integrate with Next.js client.</p>",
				status: "in_progress",
				priority: "high",
				dueDate: new Date(Date.now() + 86400000).toISOString(),
				userId: "mock-user-1",
				createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
				updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
				user: {
					id: "mock-user-1",
					name: "Mock User",
					email: "mock@example.com",
				},
				activities: [
					{
						id: "act-1",
						taskId: "task-1",
						userId: "mock-user-1",
						userName: "Mock User",
						userInitials: "MU",
						actionText: "created this issue",
						timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
					},
				],
			},
			{
				id: "task-2",
				issueNumber: 2,
				title: "Configure Better Auth",
				description:
					"<p>Integrate Better Auth session handling and OAuth callbacks.</p>",
				status: "todo",
				priority: "medium",
				dueDate: null,
				userId: "mock-user-1",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				user: {
					id: "mock-user-1",
					name: "Mock User",
					email: "mock@example.com",
				},
				activities: [
					{
						id: "act-2",
						taskId: "task-2",
						userId: "mock-user-1",
						userName: "Mock User",
						userInitials: "MU",
						actionText: "created this issue",
						timestamp: new Date().toISOString(),
					},
				],
			},
		];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
		return initialTasks;
	}
	return JSON.parse(data);
}

function saveTasks(tasks: BackendTask[]) {
	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
	}
}

export async function listTasksApi(filters: {
	status?: string[];
	priority?: string[];
	search?: string;
	sortBy?: string;
	sortOrder?: string;
	allUsers?: boolean;
}): Promise<ListTasksResponse> {
	await new Promise((resolve) => setTimeout(resolve, 300));
	let list = getTasks();

	if (filters.status && filters.status.length > 0) {
		list = list.filter((t) => filters.status!.includes(t.status));
	}
	if (filters.priority && filters.priority.length > 0) {
		list = list.filter((t) => filters.priority!.includes(t.priority));
	}
	if (filters.search) {
		const s = filters.search.toLowerCase();
		list = list.filter(
			(t) =>
				t.title.toLowerCase().includes(s) ||
				(t.description && t.description.toLowerCase().includes(s)) ||
				t.id.toLowerCase().includes(s) ||
				`oph-${t.issueNumber}`.includes(s),
		);
	}

	const sortBy = filters.sortBy || "createdAt";
	const sortOrder = filters.sortOrder || "desc";
	list.sort((a, b) => {
		let valA = a[sortBy as keyof BackendTask] || "";
		let valB = b[sortBy as keyof BackendTask] || "";
		if (sortBy === "created") {
			valA = a.createdAt;
			valB = b.createdAt;
		}
		if (valA < valB) return sortOrder === "asc" ? -1 : 1;
		if (valA > valB) return sortOrder === "asc" ? 1 : -1;
		return 0;
	});

	return {
		tasks: list,
		total: list.length,
	};
}

export async function getTaskApi(idOrCode: string): Promise<TaskResponse> {
	await new Promise((resolve) => setTimeout(resolve, 150));
	const list = getTasks();
	const code = idOrCode.toUpperCase();
	let task = list.find((t) => t.id === idOrCode);
	if (!task && code.startsWith("OPH-")) {
		const num = parseInt(code.slice(4), 10);
		task = list.find((t) => t.issueNumber === num);
	}
	if (!task) {
		throw new Error("Task not found");
	}
	return { task };
}

export async function createTaskApi(
	data: CreateTaskInput,
): Promise<TaskResponse> {
	await new Promise((resolve) => setTimeout(resolve, 200));
	const list = getTasks();
	const maxNumber = list.reduce((max, t) => Math.max(max, t.issueNumber), 0);
	const newTaskId =
		data.id || `task-${Math.random().toString(36).slice(2, 11)}`;

	const newTask: BackendTask = {
		id: newTaskId,
		issueNumber: maxNumber + 1,
		title: data.title,
		description: data.description || null,
		status: data.status || "backlog",
		priority: data.priority || "no_priority",
		dueDate: data.dueDate || null,
		userId: "mock-user-1",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		user: { id: "mock-user-1", name: "Mock User", email: "mock@example.com" },
		activities: [
			{
				id: `act-${Math.random().toString(36).slice(2, 11)}`,
				taskId: newTaskId,
				userId: "mock-user-1",
				userName: "Mock User",
				userInitials: "MU",
				actionText: "created this issue",
				timestamp: new Date().toISOString(),
			},
		],
	};

	list.push(newTask);
	saveTasks(list);
	return { task: newTask };
}

export async function updateTaskApi(
	idOrCode: string,
	data: UpdateTaskInput,
): Promise<TaskResponse> {
	await new Promise((resolve) => setTimeout(resolve, 200));
	const list = getTasks();
	const code = idOrCode.toUpperCase();
	let index = list.findIndex((t) => t.id === idOrCode);
	if (index === -1 && code.startsWith("OPH-")) {
		const num = parseInt(code.slice(4), 10);
		index = list.findIndex((t) => t.issueNumber === num);
	}
	if (index === -1) {
		throw new Error("Task not found");
	}

	const task = list[index];
	const original = { ...task };

	const updatedTask = {
		...task,
		...data,
		updatedAt: new Date().toISOString(),
	};

	const activities = task.activities ? [...task.activities] : [];

	if (data.title !== undefined && data.title !== original.title) {
		activities.push({
			id: `act-${Math.random().toString(36).slice(2, 11)}`,
			taskId: task.id,
			userId: "mock-user-1",
			userName: "Mock User",
			userInitials: "MU",
			actionText: `changed title from "${original.title}" to "${data.title}"`,
			timestamp: new Date().toISOString(),
		});
	}
	if (data.status !== undefined && data.status !== original.status) {
		activities.push({
			id: `act-${Math.random().toString(36).slice(2, 11)}`,
			taskId: task.id,
			userId: "mock-user-1",
			userName: "Mock User",
			userInitials: "MU",
			actionText: `changed status from ${original.status} to ${data.status}`,
			timestamp: new Date().toISOString(),
		});
	}
	if (data.priority !== undefined && data.priority !== original.priority) {
		activities.push({
			id: `act-${Math.random().toString(36).slice(2, 11)}`,
			taskId: task.id,
			userId: "mock-user-1",
			userName: "Mock User",
			userInitials: "MU",
			actionText: `changed priority from ${original.priority} to ${data.priority}`,
			timestamp: new Date().toISOString(),
		});
	}
	if (data.dueDate !== undefined && data.dueDate !== original.dueDate) {
		activities.push({
			id: `act-${Math.random().toString(36).slice(2, 11)}`,
			taskId: task.id,
			userId: "mock-user-1",
			userName: "Mock User",
			userInitials: "MU",
			actionText: `changed due date to ${data.dueDate ? new Date(data.dueDate).toLocaleDateString() : "No due date"}`,
			timestamp: new Date().toISOString(),
		});
	}
	if (
		data.description !== undefined &&
		data.description !== original.description
	) {
		activities.push({
			id: `act-${Math.random().toString(36).slice(2, 11)}`,
			taskId: task.id,
			userId: "mock-user-1",
			userName: "Mock User",
			userInitials: "MU",
			actionText: "updated description",
			timestamp: new Date().toISOString(),
		});
	}

	updatedTask.activities = activities;
	list[index] = updatedTask;
	saveTasks(list);

	return { task: updatedTask };
}

export async function deleteTaskApi(idOrCode: string): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 200));
	const list = getTasks();
	const code = idOrCode.toUpperCase();
	let index = list.findIndex((t) => t.id === idOrCode);
	if (index === -1 && code.startsWith("OPH-")) {
		const num = parseInt(code.slice(4), 10);
		index = list.findIndex((t) => t.issueNumber === num);
	}
	if (index === -1) {
		throw new Error("Task not found");
	}
	list.splice(index, 1);
	saveTasks(list);
}
