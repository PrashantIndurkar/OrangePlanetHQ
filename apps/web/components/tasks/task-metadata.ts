import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	HighPriorityIcon,
	InProgressIcon,
	InReviewIcon,
	LowPriorityIcon,
	MediumPriorityIcon,
	NoPriorityIcon,
	TodoIcon,
	UrgentPriorityIcon,
} from "../icons";

export type TaskStatus =
	| "backlog"
	| "todo"
	| "in-progress"
	| "in-review"
	| "done"
	| "canceled";

export type TaskPriority = "no-priority" | "urgent" | "high" | "medium" | "low";

export const statuses = [
	{
		value: "backlog" as const,
		label: "Backlog",
		icon: BacklogIcon,
		shortcut: "1",
	},
	{ value: "todo" as const, label: "Todo", icon: TodoIcon, shortcut: "2" },
	{
		value: "in-progress" as const,
		label: "In Progress",
		icon: InProgressIcon,
		shortcut: "3",
	},
	{
		value: "in-review" as const,
		label: "In Review",
		icon: InReviewIcon,
		shortcut: "4",
	},
	{ value: "done" as const, label: "Done", icon: DoneIcon, shortcut: "5" },
	{
		value: "canceled" as const,
		label: "Canceled",
		icon: CanceledIcon,
		shortcut: "6",
	},
];

export const priorities = [
	{
		value: "no-priority" as const,
		label: "No priority",
		icon: NoPriorityIcon,
		shortcut: "0",
	},
	{
		value: "urgent" as const,
		label: "Urgent",
		icon: UrgentPriorityIcon,
		shortcut: "1",
	},
	{
		value: "high" as const,
		label: "High",
		icon: HighPriorityIcon,
		shortcut: "2",
	},
	{
		value: "medium" as const,
		label: "Medium",
		icon: MediumPriorityIcon,
		shortcut: "3",
	},
	{ value: "low" as const, label: "Low", icon: LowPriorityIcon, shortcut: "4" },
];
