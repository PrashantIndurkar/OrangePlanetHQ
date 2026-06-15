import { Calendar04Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	priorities,
	statuses,
	type TaskPriority,
	type TaskStatus,
} from "./task-metadata";
import { TaskPriorityList } from "./task-priority-list";
import { TaskStatusList } from "./task-status-list";
import { TaskDueDateList } from "./task-due-date-list";

export { priorities, statuses, type TaskPriority, type TaskStatus };

import { PriorityIcon, TodoIcon } from "../icons";

// --- Types & Data ---

interface TaskContextMenuProps {
	children: React.ReactNode;
	currentStatus?: TaskStatus;
	currentPriority?: TaskPriority;
	currentDueDate?: string;
	onUpdateStatus?: (status: TaskStatus) => void;
	onUpdatePriority?: (priority: TaskPriority) => void;
	onUpdateDueDate?: (dueDate?: string) => void;
	onDeleteTask?: () => void;
}

export function TaskContextMenu({
	children,
	currentStatus = "todo",
	currentPriority = "no-priority",
	currentDueDate,
	onUpdateStatus,
	onUpdatePriority,
	onUpdateDueDate,
	onDeleteTask,
}: TaskContextMenuProps) {
	// Mock state for UI demonstration
	const [prevCurrentStatus, setPrevCurrentStatus] =
		React.useState<TaskStatus>(currentStatus);
	const [status, setStatus] = React.useState<TaskStatus>(currentStatus);

	const [prevCurrentPriority, setPrevCurrentPriority] =
		React.useState<TaskPriority>(currentPriority);
	const [priority, setPriority] = React.useState<TaskPriority>(currentPriority);

	const [prevCurrentDueDate, setPrevCurrentDueDate] =
		React.useState<string | undefined>(currentDueDate);
	const [dueDate, setDueDate] = React.useState<string | undefined>(currentDueDate);

	const [isOpen, setIsOpen] = React.useState(false);

	if (currentStatus !== prevCurrentStatus) {
		setPrevCurrentStatus(currentStatus);
		setStatus(currentStatus);
	}

	if (currentPriority !== prevCurrentPriority) {
		setPrevCurrentPriority(currentPriority);
		setPriority(currentPriority);
	}

	if (currentDueDate !== prevCurrentDueDate) {
		setPrevCurrentDueDate(currentDueDate);
		setDueDate(currentDueDate);
	}

	const handleStatusChange = (newStatus: TaskStatus) => {
		setStatus(newStatus);
		onUpdateStatus?.(newStatus);
		setIsOpen(false);
	};

	const handlePriorityChange = (newPriority: TaskPriority) => {
		setPriority(newPriority);
		onUpdatePriority?.(newPriority);
		setIsOpen(false);
	};

	const handleDueDateChange = (newDueDate?: string) => {
		setDueDate(newDueDate);
		onUpdateDueDate?.(newDueDate);
		setIsOpen(false);
	};

	// Shortcuts
	useHotkeys("1", () => handleStatusChange("backlog"));
	useHotkeys("2", () => handleStatusChange("todo"));
	useHotkeys("3", () => handleStatusChange("in-progress"));
	useHotkeys("4", () => handleStatusChange("done"));
	useHotkeys("5", () => handleStatusChange("canceled"));

	const triggerChild = React.isValidElement(children)
		? React.cloneElement(
				children as React.ReactElement<{ "data-context-menu-open"?: boolean }>,
				{
					"data-context-menu-open": isOpen,
				},
			)
		: children;

	return (
		<ContextMenu open={isOpen} onOpenChange={setIsOpen}>
			<ContextMenuTrigger render={triggerChild as React.ReactElement} />
			<ContextMenuContent className="w-56">
				{/* Status Submenu */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="flex items-center gap-2">
						<TodoIcon className="h-4 w-4 text-muted-foreground" />
						<span className="flex-grow">Status</span>
						<span className="text-xs text-muted-foreground/60">S</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48 p-0">
						<TaskStatusList value={status} onSelect={handleStatusChange} />
					</ContextMenuSubContent>
				</ContextMenuSub>

				{/* Priority Submenu */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="flex items-center gap-2">
						<PriorityIcon className="h-4 w-4 text-muted-foreground" />
						<span className="flex-grow">Priority</span>
						<span className="text-xs text-muted-foreground/60">P</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48 p-0">
						<TaskPriorityList
							value={priority}
							onSelect={handlePriorityChange}
						/>
					</ContextMenuSubContent>
				</ContextMenuSub>

				{/* Due Date Submenu */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="flex items-center gap-2">
						<HugeiconsIcon icon={Calendar04Icon} className="h-4 w-4 text-muted-foreground" />
						<span className="flex-grow">Due date</span>
						<span className="text-xs text-muted-foreground/60">D</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48 p-0">
						<TaskDueDateList
							value={dueDate}
							onSelect={handleDueDateChange}
						/>
					</ContextMenuSubContent>
				</ContextMenuSub>

				<ContextMenuSeparator />

				{/* Delete Task */}
				<ContextMenuItem
					onClick={() => {
						onDeleteTask?.();
						setIsOpen(false);
					}}
					className="flex items-center gap-2 text-destructive focus:text-destructive"
				>
					<HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
					<span>Delete Task</span>
					<span className="ml-auto text-xs opacity-60">⌘ ⌫</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
