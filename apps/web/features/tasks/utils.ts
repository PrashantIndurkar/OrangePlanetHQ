import type { Task, TaskActivity } from "@/components/workspace/types";
import type { BackendTask } from "./types";

export function mapBackendTaskToFrontend(bt: BackendTask): Task {
	let dueDateStr: string | undefined;
	if (bt.dueDate) {
		const date = new Date(bt.dueDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const compareDate = new Date(date);
		compareDate.setHours(0, 0, 0, 0);

		if (compareDate.getTime() === today.getTime()) {
			dueDateStr = "Today";
		} else if (compareDate.getTime() === tomorrow.getTime()) {
			dueDateStr = "Tomorrow";
		} else if (compareDate.getTime() < today.getTime()) {
			dueDateStr = "Overdue";
		} else {
			dueDateStr = date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}
	}

	const activities: TaskActivity[] = (bt.activities || []).map((act) => ({
		id: act.id,
		userInitials: act.userInitials,
		userName: act.userName,
		actionText: act.actionText,
		timestamp: new Date(act.timestamp).getTime(),
	}));

	const assigneeName = bt.user?.name || bt.user?.email || "Unknown User";

	return {
		id: `STR-${bt.issueNumber}`,
		uuid: bt.id,
		title: bt.title,
		status: bt.status as Task["status"],
		priority: bt.priority as Task["priority"],
		dueDate: dueDateStr,
		createdDate: `Created ${new Date(bt.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		})}`,
		createdAt: new Date(bt.createdAt).getTime(),
		updatedAt: new Date(bt.updatedAt).getTime(),
		assigneeName,
		description: bt.description || "",
		activities,
	};
}
