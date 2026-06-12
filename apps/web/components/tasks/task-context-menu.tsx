import { Delete01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
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
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	HighPriorityIcon,
	InProgressIcon,
	LowPriorityIcon,
	MediumPriorityIcon,
	NoPriorityIcon,
	PriorityIcon,
	TodoIcon,
	UrgentPriorityIcon,
} from "../icons";

// --- Types & Data ---

export type TaskStatus =
	| "backlog"
	| "todo"
	| "in-progress"
	| "done"
	| "canceled";
export type TaskPriority = "no-priority" | "urgent" | "high" | "medium" | "low";

const statuses = [
	{ value: "backlog", label: "Backlog", icon: BacklogIcon, shortcut: "1" },
	{ value: "todo", label: "Todo", icon: TodoIcon, shortcut: "2" },
	{
		value: "in-progress",
		label: "In Progress",
		icon: InProgressIcon,
		shortcut: "3",
	},
	{ value: "done", label: "Done", icon: DoneIcon, shortcut: "4" },
	{ value: "canceled", label: "Canceled", icon: CanceledIcon, shortcut: "5" },
];

const priorities = [
	{
		value: "no-priority",
		label: "No priority",
		icon: NoPriorityIcon,
		shortcut: "0",
	},
	{ value: "urgent", label: "Urgent", icon: UrgentPriorityIcon, shortcut: "1" },
	{ value: "high", label: "High", icon: HighPriorityIcon, shortcut: "2" },
	{ value: "medium", label: "Medium", icon: MediumPriorityIcon, shortcut: "3" },
	{ value: "low", label: "Low", icon: LowPriorityIcon, shortcut: "4" },
];

interface TaskContextMenuProps {
	children: React.ReactNode;
	currentStatus?: TaskStatus;
	currentPriority?: TaskPriority;
}

export function TaskContextMenu({
	children,
	currentStatus = "todo",
	currentPriority = "no-priority",
}: TaskContextMenuProps) {
	// Mock state for UI demonstration
	const [status, setStatus] = React.useState<TaskStatus>(currentStatus);
	const [priority, setPriority] = React.useState<TaskPriority>(currentPriority);

	// Shortcuts
	useHotkeys("1", () => setStatus("backlog"));
	useHotkeys("2", () => setStatus("todo"));
	useHotkeys("3", () => setStatus("in-progress"));
	useHotkeys("4", () => setStatus("done"));
	useHotkeys("5", () => setStatus("canceled"));

	return (
		<ContextMenu>
			<ContextMenuTrigger render={children as React.ReactElement} />
			<ContextMenuContent className="w-56">
				{/* Status Submenu */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="flex items-center gap-2">
						<TodoIcon className="h-4 w-4 text-muted-foreground" />
						<span>Status</span>
						<span className="ml-auto text-xs text-muted-foreground">S</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48 p-0">
						<Command>
							<CommandInput placeholder="Change status..." autoFocus />
							<CommandList>
								<CommandEmpty>No status found.</CommandEmpty>
								<CommandGroup>
									{statuses.map((s) => (
										<CommandItem
											key={s.value}
											value={s.label} // Value used for cmdk filtering
											onSelect={() => setStatus(s.value as TaskStatus)}
											className="flex items-center gap-2"
										>
											<s.icon
												className={`h-4 w-4 ${status === s.value ? "text-primary" : "text-muted-foreground"}`}
											/>
											<span>{s.label}</span>
											{status === s.value && (
												<HugeiconsIcon
													icon={Tick02Icon}
													className="ml-auto h-4 w-4"
												/>
											)}
											<span
												className={`text-xs text-muted-foreground ${status === s.value ? "ml-2" : "ml-auto"}`}
											>
												{s.shortcut}
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</ContextMenuSubContent>
				</ContextMenuSub>

				{/* Priority Submenu */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="flex items-center gap-2">
						<PriorityIcon className="h-4 w-4 text-muted-foreground" />
						<span>Priority</span>
						<span className="ml-auto text-xs text-muted-foreground">P</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48 p-0">
						<Command>
							<CommandInput placeholder="Set priority to..." autoFocus />
							<CommandList>
								<CommandEmpty>No priority found.</CommandEmpty>
								<CommandGroup>
									{priorities.map((p) => (
										<CommandItem
											key={p.value}
											value={p.label}
											onSelect={() => setPriority(p.value as TaskPriority)}
											className="flex items-center gap-2"
										>
											<p.icon
												className={`h-4 w-4 ${priority === p.value ? "text-primary" : "text-muted-foreground"}`}
											/>
											<span>{p.label}</span>
											{priority === p.value && (
												<HugeiconsIcon
													icon={Tick02Icon}
													className="ml-auto h-4 w-4"
												/>
											)}
											<span
												className={`text-xs text-muted-foreground ${priority === p.value ? "ml-2" : "ml-auto"}`}
											>
												{p.shortcut}
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</ContextMenuSubContent>
				</ContextMenuSub>

				<ContextMenuSeparator />

				{/* Delete Task */}
				<ContextMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
					<HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
					<span>Delete Task</span>
					<span className="ml-auto text-xs opacity-60">⌘ ⌫</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
