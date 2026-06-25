import type { Task } from "@/components/workspace/types";

const INITIAL_MOCK_TASKS = [
	...Array.from({ length: 25 }, (_, i) => {
		const priorities: Task["priority"][] = [
			"no-priority",
			"low",
			"medium",
			"high",
			"urgent",
		];
		const priority = priorities[i % priorities.length];
		let dueDate: string | undefined;
		if (i % 5 === 1) dueDate = "Today";
		if (i % 5 === 2) dueDate = "Tomorrow";
		if (i % 5 === 3) dueDate = "Overdue";

		return {
			id: `OPH-${25 - i}`,
			title: `Backlog issue placeholder ${i + 1}`,
			status: "backlog" as const,
			priority,
			dueDate,
			createdDate: `Created Jun ${12 - (i % 10)}`,
			createdAt: new Date(`2026-06-${12 - (i % 10)}`).getTime(),
			updatedAt: new Date(`2026-06-${12 - (i % 10)}`).getTime(),
			description: `This is the default description for task OPH-${25 - i}.`,
			activities: [
				{
					id: `act-init-${25 - i}`,
					userInitials: "PD",
					userName: "Prashant",
					actionText: "created this issue",
					timestamp: new Date(`2026-06-${12 - (i % 10)}`).getTime(),
				},
			],
		};
	}),
	{
		id: "OPH-41",
		title: "Issue title Urgent",
		status: "in-progress" as const,
		priority: "urgent" as const,
		createdDate: "Created Jun 12",
		createdAt: new Date("2026-06-12").getTime(),
		updatedAt: new Date("2026-06-12").getTime(),
		description: "Urgent issue description here.",
		activities: [
			{
				id: "act-init-41",
				userInitials: "PD",
				userName: "Prashant",
				actionText: "created this issue",
				timestamp: new Date("2026-06-12").getTime(),
			},
		],
	},
	{
		id: "OPH-35",
		title: "Issue title High",
		status: "in-progress" as const,
		priority: "high" as const,
		createdDate: "Created Jun 11",
		createdAt: new Date("2026-06-11").getTime(),
		updatedAt: new Date("2026-06-11").getTime(),
		description: "High priority task details.",
		activities: [
			{
				id: "act-init-35",
				userInitials: "PD",
				userName: "Prashant",
				actionText: "created this issue",
				timestamp: new Date("2026-06-11").getTime(),
			},
		],
	},
	{
		id: "OPH-33",
		title: "Issue title medium",
		status: "in-progress" as const,
		priority: "medium" as const,
		createdDate: "Created Jun 10",
		createdAt: new Date("2026-06-10").getTime(),
		updatedAt: new Date("2026-06-10").getTime(),
		description: "Medium priority task details.",
		activities: [
			{
				id: "act-init-33",
				userInitials: "PD",
				userName: "Prashant",
				actionText: "created this issue",
				timestamp: new Date("2026-06-10").getTime(),
			},
		],
	},
	{
		id: "OPH-36",
		title: "Issue title Low",
		status: "in-progress" as const,
		priority: "low" as const,
		dueDate: "Tomorrow",
		createdDate: "Created Jun 12",
		createdAt: new Date("2026-06-12").getTime(),
		updatedAt: new Date("2026-06-12").getTime(),
		description: "Low priority task details.",
		activities: [
			{
				id: "act-init-36",
				userInitials: "PD",
				userName: "Prashant",
				actionText: "created this issue",
				timestamp: new Date("2026-06-12").getTime(),
			},
		],
	},
	{
		id: "OPH-40",
		title: "test",
		status: "todo" as const,
		priority: "no-priority" as const,
		createdDate: "Created Jun 12",
		createdAt: new Date("2026-06-12").getTime(),
		updatedAt: new Date("2026-06-12").getTime(),
		assigneeName: "Prashant Indurkar",
		assigneeAvatarUrl:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
		description: "Test todo item.",
		activities: [
			{
				id: "act-init-40",
				userInitials: "PD",
				userName: "Prashant",
				actionText: "created this issue",
				timestamp: new Date("2026-06-12").getTime(),
			},
		],
	},
	{
		id: "OPH-38",
		title: "test",
		status: "done" as const,
		priority: "no-priority" as const,
		createdDate: "Created Jun 12",
		createdAt: new Date("2026-06-12").getTime(),
		updatedAt: new Date("2026-06-12").getTime(),
		description: "Test completed item.",
		activities: [
			{
				id: "act-init-38",
				userInitials: "PD",
				userName: "Prashant",
				actionText: "created this issue",
				timestamp: new Date("2026-06-12").getTime(),
			},
		],
	},
	{
		id: "OPH-39",
		title: "test",
		status: "canceled" as const,
		priority: "no-priority" as const,
		createdDate: "Created Jun 12",
		createdAt: new Date("2026-06-12").getTime(),
		updatedAt: new Date("2026-06-12").getTime(),
		description: "Test canceled item.",
		activities: [
			{
				id: "act-init-39",
				userInitials: "PD",
				userName: "Prashant",
				actionText: "created this issue",
				timestamp: new Date("2026-06-12").getTime(),
			},
		],
	},
];

class IssuesStore {
	private tasks: Task[] = [];
	private listeners: Set<() => void> = new Set();
	private initialized = false;

	constructor() {
		if (typeof window !== "undefined") {
			this.load();
		} else {
			this.tasks = INITIAL_MOCK_TASKS;
		}
	}

	private load() {
		try {
			const stored = localStorage.getItem("orangeplanet_tasks_v2");
			if (stored) {
				this.tasks = JSON.parse(stored);
			} else {
				this.tasks = INITIAL_MOCK_TASKS;
				this.save();
			}
		} catch {
			this.tasks = INITIAL_MOCK_TASKS;
		}
		this.initialized = true;
	}

	private save() {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("orangeplanet_tasks_v2", JSON.stringify(this.tasks));
			} catch (e) {
				console.error("Failed to save tasks to localStorage", e);
			}
		}
	}

	getTasks(): Task[] {
		if (!this.initialized && typeof window !== "undefined") {
			this.load();
		}
		return this.tasks;
	}

	getTask(id: string): Task | undefined {
		return this.getTasks().find((t) => t.id === id);
	}

	setTasks(tasks: Task[]) {
		this.tasks = tasks;
		this.save();
		this.notify();
	}

	updateTask(id: string, updates: Partial<Task>, actionText?: string) {
		this.tasks = this.tasks.map((t) => {
			if (t.id === id) {
				const activities = t.activities ? [...t.activities] : [];
				if (actionText) {
					activities.push({
						id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
						userInitials: "PD",
						userName: "Prashant",
						actionText,
						timestamp: Date.now(),
					});
				}
				return { ...t, ...updates, updatedAt: Date.now(), activities };
			}
			return t;
		});
		this.save();
		this.notify();
	}

	addTask(task: Task) {
		const newTask: Task = {
			...task,
			createdAt: task.createdAt || Date.now(),
			updatedAt: Date.now(),
			activities: task.activities || [
				{
					id: `act-${Date.now()}`,
					userInitials: "PD",
					userName: "Prashant",
					actionText: "created this issue",
					timestamp: Date.now(),
				},
			],
		};
		this.tasks = [...this.tasks, newTask];
		this.save();
		this.notify();
	}

	deleteTask(id: string) {
		this.tasks = this.tasks.filter((t) => t.id !== id);
		this.save();
		this.notify();
	}

	subscribe(listener: () => void) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private notify() {
		for (const listener of this.listeners) {
			listener();
		}
	}
}

export const issuesStore = new IssuesStore();
