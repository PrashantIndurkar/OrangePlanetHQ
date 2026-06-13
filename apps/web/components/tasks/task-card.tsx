import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
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
	onUpdateStatus?: (status: TaskStatus) => void;
	onUpdatePriority?: (priority: TaskPriority) => void;
	onDeleteTask?: () => void;
}

export function TaskCard({
	id = "STR-36",
	title = "Building card ui with fields",
	status = "todo",
	priority = "high",
	dueDate = "Tomorrow",
	createdDate = "Created Jun 12",
	assigneeName = "Prashant Indurkar",
	assigneeAvatarUrl = "",
	onUpdateStatus,
	onUpdatePriority,
	onDeleteTask,
}: TaskCardProps) {
	const router = useRouter();

	// Status Icon Resolver (Size 14px)
	const getStatusIcon = (s: string) => {
		switch (s) {
			case "backlog":
				return (
					<BacklogIcon className="h-[14px] w-[14px] shrink-0 text-zinc-400" />
				);
			case "todo":
				return (
					<TodoIcon className="h-[14px] w-[14px] shrink-0 text-zinc-500" />
				);
			case "in-progress":
				return (
					<InProgressIcon className="h-[14px] w-[14px] shrink-0 text-amber-500" />
				);
			case "done":
				return (
					<DoneIcon className="h-[14px] w-[14px] shrink-0 text-indigo-500" />
				);
			case "canceled":
				return (
					<CanceledIcon className="h-[14px] w-[14px] shrink-0 text-zinc-400" />
				);
			default:
				return (
					<TodoIcon className="h-[14px] w-[14px] shrink-0 text-zinc-500" />
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

	const handleCardClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (
			target.closest("button") ||
			target.closest(".avatar") ||
			target.closest("[role='menuitem']")
		) {
			return;
		}
		router.push(`/tasks/${id}`);
	};

	return (
		<TaskContextMenu
			currentStatus={status as TaskStatus}
			currentPriority={priority as TaskPriority}
			onUpdateStatus={onUpdateStatus}
			onUpdatePriority={onUpdatePriority}
			onDeleteTask={onDeleteTask}
		>
			<div
				role="button"
				onClick={handleCardClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						router.push(`/tasks/${id}`);
					}
				}}
				tabIndex={0}
				className="group flex w-[320px] flex-col rounded-none border border-zinc-200 bg-[#ffffff] p-[9px] pb-[11px] text-card-foreground shadow-none select-none data-[context-menu-open=true]:border-zinc-300 data-[context-menu-open=true]:bg-zinc-50 dark:border-zinc-800 dark:bg-[#25272b] dark:data-[context-menu-open=true]:border-zinc-700 dark:data-[context-menu-open=true]:bg-zinc-800/80 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
			>
				{/* Top Section: Issue ID and Assignee */}
				<div className="flex items-center justify-between">
					<span className="text-[12px] leading-none font-[450] text-zinc-700 dark:text-zinc-300">
						{id}
					</span>
					<Avatar className="h-6 w-6 rounded-full border-0">
						{assigneeAvatarUrl ? (
							<AvatarImage
								src={assigneeAvatarUrl}
								alt={assigneeName}
								className="rounded-full"
							/>
						) : null}
						<AvatarFallback className="flex items-center justify-center rounded-full bg-transparent text-zinc-500">
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
					<div className="flex h-[14px] w-[14px] shrink-0 items-center justify-center">
						{getStatusIcon(status)}
					</div>
					<h3 className="text-[13px] leading-normal font-medium break-words text-foreground">
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
								"flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-none border transition-colors",
								isUrgent
									? "border-red-200 bg-red-500/10 dark:border-red-900/30 dark:bg-red-500/20"
									: "border-zinc-200 bg-transparent hover:bg-accent/10 dark:border-zinc-800",
							)}
							aria-label="Priority"
						>
							{getPriorityIcon(priority)}
						</button>
					) : (
						<button
							type="button"
							className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-none border border-zinc-200 bg-transparent text-zinc-500 transition-colors outline-none hover:bg-accent/10 dark:border-zinc-800"
							aria-label="More Actions"
						>
							<NoPriorityIcon className="h-6 w-6" />
						</button>
					)}

					{/* Due Date Badge */}
					{dueDate && (
						<div className="flex items-center justify-center gap-1.5 rounded-none border border-zinc-200 bg-transparent px-2 py-1 pr-2.5 pl-2 text-[12px] leading-none font-[450] text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
							<HugeiconsIcon
								icon={Calendar04Icon}
								className="h-3.5 w-3.5 shrink-0 text-[#f25f4c]"
							/>
							<span>{dueDate}</span>
						</div>
					)}
				</div>

				{/* Footer text (11px distance from bottom of card, 12px font size, weight 450, gap of 11px from meta row) */}
				<div className="mt-[11px] text-[12px] leading-none font-[450] text-zinc-600 dark:text-zinc-400">
					{createdDate}
				</div>
			</div>
		</TaskContextMenu>
	);
}
