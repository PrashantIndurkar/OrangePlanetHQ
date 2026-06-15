"use client";

import {
	Delete01Icon,
	GitBranchIcon,
	HashIcon,
	Link01Icon,
	SidebarRightIcon,
	Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { TaskEditor } from "@/components/tasks/task-editor";
import type {
	TaskPriority,
	TaskStatus,
} from "@/components/tasks/task-metadata";
import { IssueAttachmentButton } from "@/components/workspace/issue-attachment-button";
import { IssueDueDateSelect } from "@/components/workspace/issue-due-date-select";
import { IssuePrioritySelect } from "@/components/workspace/issue-priority-select";
import { IssueStatusSelect } from "@/components/workspace/issue-status-select";
import { isValidImage } from "@/lib/image-validation";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";
import {
	useDeleteTaskMutation,
	useTaskQuery,
	useUpdateTaskMutation,
} from "../../../../features/tasks/hooks";

const formatDateTime = (timestamp?: number) => {
	if (!timestamp) return "—";
	return new Date(timestamp).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
};

export default function TaskDetailsPage({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = React.use(params);
	const router = useRouter();

	const { data: task, isLoading, isError } = useTaskQuery(taskId);

	const [localTitle, setLocalTitle] = React.useState("");
	const [localDescription, setLocalDescription] = React.useState("");

	// Sync local states when query finishes loading
	React.useEffect(() => {
		if (task) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setLocalTitle(task.title);
			setLocalDescription(task.description || "");
		}
	}, [task]);

	// Silent URL update to STR-XXXX format if UUID was passed
	React.useEffect(() => {
		if (task && taskId !== task.id) {
			window.history.replaceState(null, "", `/tasks/${task.id}`);
		}
	}, [task, taskId]);

	const updateMutation = useUpdateTaskMutation();
	const deleteMutation = useDeleteTaskMutation();

	// Sidebar resizing states
	const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
	const [sidebarWidth, setSidebarWidth] = React.useState(280);
	const [isDragging, setIsDragging] = React.useState(false);
	const dragStartRef = React.useRef<{ x: number; width: number } | null>(null);

	// Copy action feedback state
	const [copyStatus, setCopyStatus] = React.useState<string | null>(null);

	// Drag resize handlers
	const handleMouseDown = React.useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			setIsDragging(true);
			dragStartRef.current = {
				x: e.clientX,
				width: sidebarWidth,
			};
		},
		[sidebarWidth],
	);

	React.useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!dragStartRef.current) return;
			const deltaX = dragStartRef.current.x - e.clientX;
			const newWidth = Math.max(
				240,
				Math.min(360, dragStartRef.current.width + deltaX),
			);
			setSidebarWidth(newWidth);
		};

		const handleMouseUp = (e: MouseEvent) => {
			setIsDragging(false);
			if (dragStartRef.current) {
				const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
				if (deltaX < 3) {
					setIsSidebarOpen((prev) => !prev);
				}
			}
			dragStartRef.current = null;
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	if (isLoading) {
		return (
			<div className="flex h-screen w-full flex-col bg-background select-none overflow-hidden animate-pulse">
				{/* Top Header / Breadcrumb Bar Skeleton */}
				<header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border px-4 bg-background">
					<div className="flex items-center gap-1.5">
						<div className="h-4 w-16 bg-muted rounded" />
						<span className="text-zinc-500 font-semibold">/</span>
						<div className="h-4 w-24 bg-muted rounded" />
					</div>
					<div className="flex items-center gap-1.5">
						<div className="size-8 bg-muted rounded" />
						<div className="size-8 bg-muted rounded" />
						<div className="size-8 bg-muted rounded" />
						<div className="size-8 bg-muted rounded" />
					</div>
				</header>

				{/* Content Wrapper Skeleton */}
				<div className="flex flex-1 min-h-0 w-full flex-row overflow-hidden">
					{/* Main details body */}
					<div className="flex flex-1 flex-col overflow-y-auto p-6 min-w-0">
						{/* Title input skeleton */}
						<div className="h-8 w-2/3 bg-muted rounded mb-5" />

						{/* Description field skeleton */}
						<div className="flex flex-col gap-2.5 mb-6">
							<div className="h-4 w-full bg-muted rounded" />
							<div className="h-4 w-5/6 bg-muted rounded" />
							<div className="h-4 w-4/5 bg-muted rounded" />
							<div className="h-4 w-2/3 bg-muted rounded" />
						</div>

						{/* Attachments inline triggers skeleton */}
						<div className="flex items-center gap-1.5 mt-2 mb-6">
							<div className="h-7 w-24 bg-muted rounded" />
							<div className="size-7 bg-muted rounded-full" />
						</div>

						<hr className="border-border/50 my-6" />

						{/* Activity log skeleton */}
						<div className="flex flex-col gap-4">
							<div className="h-3.5 w-16 bg-muted rounded" />
							<div className="relative flex flex-col pl-4 gap-6 border-l border-border/80 ml-2">
								<div className="relative flex items-center gap-3">
									<div className="absolute -left-[21px] size-2 rounded-full border-2 border-background bg-zinc-400 shrink-0" />
									<div className="size-5 bg-muted rounded-full shrink-0" />
									<div className="h-3.5 w-48 bg-muted rounded" />
								</div>
								<div className="relative flex items-center gap-3">
									<div className="absolute -left-[21px] size-2 rounded-full border-2 border-background bg-zinc-400 shrink-0" />
									<div className="size-5 bg-muted rounded-full shrink-0" />
									<div className="h-3.5 w-64 bg-muted rounded" />
								</div>
							</div>
						</div>
					</div>

					{/* Properties Sidebar (Desktop Only) */}
					<aside className="hidden lg:flex h-full w-[280px] shrink-0 flex-col overflow-hidden border-l border-border bg-sidebar text-sidebar-foreground p-4 gap-4 animate-pulse">
						<div className="h-4 w-20 bg-muted rounded border-b border-border/30 pb-2" />

						<div className="flex flex-col gap-3.5 mt-2">
							{/* Status */}
							<div className="flex items-center justify-between">
								<div className="h-3.5 w-12 bg-muted rounded" />
								<div className="h-7 w-20 bg-muted rounded" />
							</div>
							{/* Priority */}
							<div className="flex items-center justify-between">
								<div className="h-3.5 w-12 bg-muted rounded" />
								<div className="h-7 w-24 bg-muted rounded" />
							</div>
							{/* Due Date */}
							<div className="flex items-center justify-between">
								<div className="h-3.5 w-16 bg-muted rounded" />
								<div className="h-7 w-24 bg-muted rounded" />
							</div>
							{/* Assignee */}
							<div className="flex items-center justify-between">
								<div className="h-3.5 w-16 bg-muted rounded" />
								<div className="h-7 w-24 bg-muted rounded" />
							</div>
							{/* Created At */}
							<div className="flex items-center justify-between">
								<div className="h-3.5 w-16 bg-muted rounded" />
								<div className="h-4 w-24 bg-muted rounded" />
							</div>
						</div>
					</aside>
				</div>
			</div>
		);
	}

	if (isError || !task) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center bg-background select-none gap-3">
				<span className="text-sm text-muted-foreground font-medium">
					Task {taskId} not found or failed to load.
				</span>
				<Link
					href="/tasks"
					className="flex h-8 items-center px-4 rounded-none border border-border text-[12px] font-semibold hover:bg-muted/50 transition-colors"
				>
					Back to Issues
				</Link>
			</div>
		);
	}

	const handleTitleBlur = () => {
		if (localTitle.trim() && localTitle !== task.title) {
			updateMutation.mutate({
				id: taskId,
				data: { title: localTitle.trim() },
			});
		}
	};

	const handleDescriptionBlur = () => {
		if (localDescription.trim() !== (task.description || "").trim()) {
			updateMutation.mutate({
				id: taskId,
				data: { description: localDescription.trim() },
			});
		}
	};

	const handleStatusChange = (newStatus: TaskStatus) => {
		if (newStatus !== task.status) {
			updateMutation.mutate({
				id: taskId,
				data: { status: newStatus },
			});
		}
	};

	const handlePriorityChange = (newPriority: TaskPriority) => {
		if (newPriority !== task.priority) {
			updateMutation.mutate({
				id: taskId,
				data: { priority: newPriority },
			});
		}
	};

	const handleDueDateChange = (newDueDate?: string) => {
		let isoDueDate: string | null = null;
		if (newDueDate) {
			const lower = newDueDate.toLowerCase();
			const d = new Date();
			d.setHours(12, 0, 0, 0);
			if (lower === "today") {
				isoDueDate = d.toISOString();
			} else if (lower === "tomorrow") {
				d.setDate(d.getDate() + 1);
				isoDueDate = d.toISOString();
			} else if (lower === "overdue") {
				d.setDate(d.getDate() - 1);
				isoDueDate = d.toISOString();
			} else {
				isoDueDate = new Date(newDueDate).toISOString();
			}
		}
		updateMutation.mutate({
			id: taskId,
			data: { dueDate: isoDueDate },
		});
	};

	const handleDelete = () => {
		deleteMutation.mutate(taskId, {
			onSuccess: () => {
				router.push("/");
			},
		});
	};

	const triggerCopy = (type: string, value: string) => {
		navigator.clipboard.writeText(value);
		setCopyStatus(type);
		setTimeout(() => setCopyStatus(null), 1500);
	};

	const getRelativeTime = (timestamp: number) => {
		// eslint-disable-next-line react-hooks/purity
		const diff = Date.now() - timestamp;
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return "just now";
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		return `${Math.floor(hours / 24)}d ago`;
	};

	const handleFileSelect = async (files: File[]) => {
		for (const file of files) {
			// Use centralized validation
			const validation = isValidImage(file);
			if (!validation.valid) {
				toast.error(validation.error ?? "Invalid image");
				continue;
			}
			if (file.type.startsWith("image/")) {
				try {
					const result = await uploadImage(file);
					const imgHtml = `\n<img src="${result.url}" class="kaneo-editor-image" />`;
					const nextDesc = `${localDescription}${imgHtml}`;
					setLocalDescription(nextDesc);
					updateMutation.mutate({
						id: taskId,
						data: { description: nextDesc },
					});
					toast.success("Image uploaded successfully");
				} catch (err) {
					toast.error(
						err instanceof Error ? err.message : "Failed to upload image",
					);
				}
			}
		}
	};

	return (
		<div className="flex h-screen w-full flex-col bg-background select-none overflow-hidden">
			{/* Top Header / Breadcrumb Bar */}
			<header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border px-4 bg-background">
				<div className="flex items-center gap-1.5 text-xs">
					<Link
						href="/tasks"
						className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						My Tasks
					</Link>
					<span className="text-zinc-500 font-semibold">/</span>
					<span className="font-semibold text-foreground">{taskId}</span>
				</div>

				{/* Copy actions and sidebar trigger */}
				<div className="flex items-center gap-1.5">
					{/* Copy URL */}
					<div className="relative">
						<button
							type="button"
							onClick={() => triggerCopy("url", window.location.href)}
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border border-border bg-transparent text-foreground/80 hover:bg-muted/50 hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
							title="Copy issue URL"
						>
							<HugeiconsIcon
								icon={Link01Icon}
								className="size-4"
								strokeWidth={2.2}
							/>
						</button>
						{copyStatus === "url" && (
							<div className="absolute top-10 right-0 z-50 flex items-center gap-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-semibold px-2 py-1 shadow-md rounded-none whitespace-nowrap animate-in fade-in slide-in-from-top-1">
								<HugeiconsIcon
									icon={Tick01Icon}
									className="size-3"
									strokeWidth={3}
								/>
								<span>Copied URL!</span>
							</div>
						)}
					</div>

					{/* Copy Issue ID */}
					<div className="relative">
						<button
							type="button"
							onClick={() => triggerCopy("id", taskId)}
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border border-border bg-transparent text-foreground/80 hover:bg-muted/50 hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
							title="Copy Issue ID"
						>
							<HugeiconsIcon
								icon={HashIcon}
								className="size-4"
								strokeWidth={2.2}
							/>
						</button>
						{copyStatus === "id" && (
							<div className="absolute top-10 right-0 z-50 flex items-center gap-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-semibold px-2 py-1 shadow-md rounded-none whitespace-nowrap animate-in fade-in slide-in-from-top-1">
								<HugeiconsIcon
									icon={Tick01Icon}
									className="size-3"
									strokeWidth={3}
								/>
								<span>Copied ID!</span>
							</div>
						)}
					</div>

					{/* Copy Branch Name */}
					<div className="relative">
						<button
							type="button"
							onClick={() =>
								triggerCopy("branch", `feature/${taskId.toLowerCase()}`)
							}
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border border-border bg-transparent text-foreground/80 hover:bg-muted/50 hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
							title="Copy Git Branch Name"
						>
							<HugeiconsIcon
								icon={GitBranchIcon}
								className="size-4"
								strokeWidth={2.2}
							/>
						</button>
						{copyStatus === "branch" && (
							<div className="absolute top-10 right-0 z-50 flex items-center gap-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-semibold px-2 py-1 shadow-md rounded-none whitespace-nowrap animate-in fade-in slide-in-from-top-1">
								<HugeiconsIcon
									icon={Tick01Icon}
									className="size-3"
									strokeWidth={3}
								/>
								<span>Copied branch!</span>
							</div>
						)}
					</div>

					{/* Delete Task */}
					<button
						type="button"
						onClick={handleDelete}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border border-border bg-transparent text-foreground/80 hover:bg-red-500/10 hover:text-red-500 outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
						title="Delete task"
					>
						<HugeiconsIcon
							icon={Delete01Icon}
							className="size-4"
							strokeWidth={2.2}
						/>
					</button>

					{/* Sidebar Trigger (Desktop Only) */}
					<button
						type="button"
						onClick={() => setIsSidebarOpen((prev) => !prev)}
						className={cn(
							"hidden lg:flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border border-border bg-transparent outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors",
							isSidebarOpen
								? "text-foreground bg-muted/40"
								: "text-foreground/80",
						)}
						title="Toggle Sidebar"
					>
						<HugeiconsIcon
							icon={SidebarRightIcon}
							className="size-4"
							strokeWidth={2.2}
						/>
					</button>
				</div>
			</header>

			{/* Content Wrapper */}
			<div className="flex flex-1 min-h-0 w-full flex-row overflow-hidden">
				{/* Main details body */}
				<div className="flex flex-1 flex-col overflow-y-auto p-6 min-w-0">
					{/* Title input */}
					<input
						type="text"
						value={localTitle}
						onChange={(e) => setLocalTitle(e.target.value)}
						onBlur={handleTitleBlur}
						placeholder="Issue title"
						className="w-full text-2xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/35 border-none bg-transparent outline-none p-0 focus:ring-0 focus:outline-none mb-5 select-text"
					/>

					{/* Mobile/Tablet Row (Hidden on desktop) */}
					<div className="flex lg:hidden flex-wrap items-center gap-1.5 py-3 border-b border-border/50 mb-4 select-none">
						<IssueStatusSelect
							value={task.status}
							onChange={handleStatusChange}
						/>
						<IssuePrioritySelect
							value={task.priority}
							onChange={handlePriorityChange}
						/>
						<IssueDueDateSelect
							value={task.dueDate}
							onChange={handleDueDateChange}
						/>
						<div className="flex h-7 items-center gap-1.5 border border-border bg-card px-2.5 py-0 text-xs font-medium text-muted-foreground select-none">
							<div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[8px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
								{task.assigneeName
									? task.assigneeName
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()
											.slice(0, 1)
									: "U"}
							</div>
							<span className="text-[11px] font-medium text-foreground/80">
								{task.assigneeName || "Unassigned"}
							</span>
						</div>
					</div>

					{/* Description field */}
					<div className="group relative flex flex-col bg-transparent p-0 rounded-none mb-6">
						<TaskEditor
							value={localDescription}
							onChange={setLocalDescription}
							onBlur={handleDescriptionBlur}
						/>
						{/* Attachments inline triggers */}
						<div className="flex items-center gap-1.5 mt-2 justify-start select-none">
							<IssueAttachmentButton onFileSelect={handleFileSelect} />
							<button
								type="button"
								className="rounded-none bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground cursor-pointer flex items-center justify-center size-7 shrink-0 border-0"
								title="Add emoji"
							>
								<svg
									className="size-4.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.2"
									strokeLinecap="round"
									strokeLinejoin="round"
									role="img"
									aria-label="Add emoji"
								>
									<title>Add emoji</title>
									<circle cx="12" cy="12" r="10" />
									<path d="M8 14s1.5 2 4 2 4-2 4-2" />
									<line x1="9" y1="9" x2="9.01" y2="9" />
									<line x1="15" y1="9" x2="15.01" y2="9" />
								</svg>
							</button>
						</div>
					</div>

					<hr className="border-border/50 my-6" />

					{/* Activity log timeline */}
					<div className="flex flex-col gap-4">
						<h3 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
							Activity
						</h3>
						<div className="relative flex flex-col pl-4 gap-6 border-l border-border/80 ml-2">
							{[...(task.activities || [])].reverse().map((act, idx) => {
								return (
									<div
										key={act.id || idx}
										className="relative flex items-center gap-3 text-xs text-foreground"
									>
										{/* Timeline marker node dot */}
										<div className="absolute -left-[21px] size-2 rounded-full border-2 border-background bg-zinc-400 dark:bg-zinc-500 shrink-0" />

										{/* Initials Avatar */}
										<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[9px] font-bold text-zinc-700 dark:text-zinc-300 select-none">
											{act.userInitials}
										</div>

										<div className="flex items-center gap-1">
											<span className="font-semibold text-foreground">
												{act.userName}
											</span>
											<span className="text-muted-foreground">
												{act.actionText}
											</span>
											<span className="text-zinc-400 dark:text-zinc-600 select-none">
												•
											</span>
											<span className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px] shrink-0">
												{getRelativeTime(act.timestamp)}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Properties Sidebar (Desktop Only) */}
				<aside
					style={{ width: isSidebarOpen ? `${sidebarWidth}px` : "0px" }}
					className={cn(
						"relative flex h-full shrink-0 flex-col overflow-hidden border-border bg-sidebar text-sidebar-foreground select-none",
						isSidebarOpen && "border-l",
						!isDragging && "transition-[width] duration-200 ease-in-out",
						"hidden lg:flex",
					)}
				>
					{/* Fixed Width Inner Wrapper to prevent squishing */}
					<div
						style={{ width: `${sidebarWidth}px` }}
						className="flex h-full shrink-0 flex-col p-4 gap-4"
					>
						<h3 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase border-b border-border/30 pb-2">
							Properties
						</h3>

						{/* Stacked details rows */}
						<div className="flex flex-col gap-3.5">
							{/* Status */}
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground font-medium">
									Status
								</span>
								<IssueStatusSelect
									value={task.status}
									onChange={handleStatusChange}
								/>
							</div>

							{/* Priority */}
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground font-medium">
									Priority
								</span>
								<IssuePrioritySelect
									value={task.priority}
									onChange={handlePriorityChange}
								/>
							</div>

							{/* Due Date */}
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground font-medium">
									Due Date
								</span>
								<IssueDueDateSelect
									value={task.dueDate}
									onChange={handleDueDateChange}
								/>
							</div>

							{/* Assignee */}
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground font-medium">
									Assignee
								</span>
								<div className="flex items-center gap-1.5 px-2 py-1 select-text">
									<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
										{task.assigneeName
											? task.assigneeName
													.split(" ")
													.map((n) => n[0])
													.join("")
													.toUpperCase()
													.slice(0, 1)
											: "U"}
									</div>
									<span className="text-[12px] font-medium text-foreground/80">
										{task.assigneeName || "Unassigned"}
									</span>
								</div>
							</div>

							{/* Created At */}
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground font-medium">
									Created At
								</span>
								<span className="text-[12px] font-medium text-foreground/80 px-2 py-1 select-text">
									{formatDateTime(task.createdAt)}
								</span>
							</div>

							{/* Updated At */}
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground font-medium">
									Updated At
								</span>
								<span className="text-[12px] font-medium text-foreground/80 px-2 py-1 select-text">
									{formatDateTime(task.updatedAt || task.createdAt)}
								</span>
							</div>
						</div>
					</div>

					{/* Draggable Border handle */}
					{isSidebarOpen && (
						<div
							role="separator"
							aria-valuenow={sidebarWidth}
							aria-valuemin={240}
							aria-valuemax={360}
							tabIndex={0}
							onMouseDown={handleMouseDown}
							className={cn(
								"absolute top-0 left-0 bottom-0 z-50 w-1 cursor-col-resize transition-all hover:w-1.5 hover:bg-primary/20",
								isDragging && "w-1.5 bg-primary/30",
							)}
							title="Drag to resize, click to collapse"
						/>
					)}
				</aside>
			</div>
		</div>
	);
}
