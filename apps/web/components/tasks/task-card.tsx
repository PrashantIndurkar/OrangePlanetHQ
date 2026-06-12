import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	HighPriorityIcon,
	InProgressIcon,
	LowPriorityIcon,
	MediumPriorityIcon,
	NoPriorityIcon,
	TodoIcon,
	UrgentPriorityIcon,
} from "../icons";
import {
	TaskContextMenu,
	type TaskPriority,
	type TaskStatus,
} from "./task-context-menu";

interface TaskCardProps {
	id?: string;
	title?: string;
	status?: string;
	priority?: string;
	dueDate?: string;
	createdDate?: string;
	assigneeName?: string;
	assigneeAvatarUrl?: string;
}

export function TaskCard({
	id = "PLO-36",
	title = "Building card ui with fields",
	status = "todo",
	priority = "high",
	dueDate = "Tomorrow",
	createdDate = "Created Jun 12",
	assigneeName = "Prashant Indurkar",
	assigneeAvatarUrl = "",
}: TaskCardProps) {
	// Status Icon Resolver (Size 14px)
	const getStatusIcon = (s: string) => {
		switch (s) {
			case "backlog":
				return (
					<BacklogIcon className="h-[14px] w-[14px] text-zinc-400 shrink-0" />
				);
			case "todo":
				return (
					<TodoIcon className="h-[14px] w-[14px] text-zinc-500 shrink-0" />
				);
			case "in-progress":
				return (
					<InProgressIcon className="h-[14px] w-[14px] text-amber-500 shrink-0" />
				);
			case "done":
				return (
					<DoneIcon className="h-[14px] w-[14px] text-indigo-500 shrink-0" />
				);
			case "canceled":
				return (
					<CanceledIcon className="h-[14px] w-[14px] text-zinc-400 shrink-0" />
				);
			default:
				return (
					<TodoIcon className="h-[14px] w-[14px] text-zinc-500 shrink-0" />
				);
		}
	};

	// Priority Icon Resolver
	const getPriorityIcon = (p: string) => {
		switch (p) {
			case "urgent":
				return <UrgentPriorityIcon className="h-6 w-6" />;
			case "high":
				return <HighPriorityIcon className="h-6 w-6" />;
			case "medium":
				return <MediumPriorityIcon className="h-6 w-6" />;
			case "low":
				return <LowPriorityIcon className="h-6 w-6" />;
			default:
				return <NoPriorityIcon className="h-6 w-6" />;
		}
	};

	const isUrgent = priority === "urgent";

	return (
		<TaskContextMenu
			currentStatus={status as TaskStatus}
			currentPriority={priority as TaskPriority}
		>
			<div className="group flex flex-col w-[320px] rounded-none bg-[#ffffff] dark:bg-[#25272b] p-[9px] pb-[11px] text-card-foreground shadow-none border border-zinc-200 dark:border-zinc-800 select-none">
				{/* Top Section: Issue ID and Assignee */}
				<div className="flex items-center justify-between">
					<span className="text-[12px] font-[450] text-zinc-700 dark:text-zinc-300 leading-none">
						{id}
					</span>
					<Avatar className="h-6 w-6 border-0 rounded-full">
						{assigneeAvatarUrl ? (
							<AvatarImage
								src={assigneeAvatarUrl}
								alt={assigneeName}
								className="rounded-full"
							/>
						) : null}
						<AvatarFallback className="bg-transparent text-zinc-500 flex items-center justify-center rounded-full">
							<svg
								className="h-4.5 w-4.5 text-zinc-400"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								role="img"
								aria-label="User avatar fallback"
							>
								<title>User avatar fallback</title>
								<circle cx="12" cy="8" r="4.5" />
								<path d="M5 21v-1.5a4.5 4.5 0 0 1 4.5-4.5h5a4.5 4.5 0 0 1 4.5 4.5v1.5" />
							</svg>
						</AvatarFallback>
					</Avatar>
				</div>

				{/* Title and Status Icon (Gap of 6px from Issue ID, aligned center) */}
				<div className="mt-[6px] flex items-center gap-1.5">
					<div className="shrink-0 flex items-center justify-center h-[14px] w-[14px]">
						{getStatusIcon(status)}
					</div>
					<h3 className="text-[13px] font-medium leading-normal text-foreground break-words">
						{title}
					</h3>
				</div>

				{/* Bottom Meta Row (Gap of 11px from Title) */}
				<div className="mt-[11px] flex items-center gap-1">
					{/* Priority Icon Button / More Actions Button */}
					{priority && priority !== "no-priority" ? (
						<button
							type="button"
							className={cn(
								"h-6 w-6 shrink-0 flex items-center justify-center rounded-none border transition-colors cursor-pointer",
								isUrgent
									? "border-red-200 bg-red-500/10 dark:border-red-900/30 dark:bg-red-500/20"
									: "border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-accent/10",
							)}
							aria-label="Priority"
						>
							{getPriorityIcon(priority)}
						</button>
					) : (
						<button
							type="button"
							className="h-6 w-6 shrink-0 flex items-center justify-center rounded-none border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-accent/10 transition-colors outline-none cursor-pointer text-zinc-500"
							aria-label="More Actions"
						>
							<NoPriorityIcon className="h-6 w-6" />
						</button>
					)}

					{/* Due Date Badge */}
					{dueDate && (
						<div className="flex items-center justify-center gap-1.5 rounded-none border border-zinc-200 dark:border-zinc-800 bg-transparent px-2 text-[12px] font-[450] text-zinc-700 dark:text-zinc-300 leading-none py-1 pl-2 pr-2.5">
							<HugeiconsIcon
								icon={Calendar04Icon}
								className="h-3.5 w-3.5 text-[#f25f4c] shrink-0"
							/>
							<span>{dueDate}</span>
						</div>
					)}
				</div>

				{/* Footer text (11px distance from bottom of card, 12px font size, weight 450, gap of 11px from meta row) */}
				<div className="mt-[11px] text-[12px] font-[450] text-zinc-600 dark:text-zinc-400 leading-none">
					{createdDate}
				</div>
			</div>
		</TaskContextMenu>
	);
}
