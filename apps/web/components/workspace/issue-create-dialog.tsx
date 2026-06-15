"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
	ArrowExpand01Icon,
	ArrowShrink02Icon,
	Cancel01Icon,
	FocusPointIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { TaskPriority, TaskStatus } from "../tasks/task-metadata";
import { IssueAttachmentButton } from "./issue-attachment-button";
import { IssueDueDateSelect } from "./issue-due-date-select";
import { IssuePrioritySelect } from "./issue-priority-select";
import { IssueStatusSelect } from "./issue-status-select";

interface IssueCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultStatus?: TaskStatus;
	onSubmit: (issue: {
		title: string;
		description: string;
		status: TaskStatus;
		priority: TaskPriority;
		dueDate?: string;
	}) => void;
}

export function IssueCreateDialog({
	open,
	onOpenChange,
	defaultStatus = "todo",
	onSubmit,
}: IssueCreateDialogProps) {
	const { user } = useAuth();
	const [isExpanded, setIsExpanded] = React.useState(false);
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [prevDefaultStatus, setPrevDefaultStatus] =
		React.useState<TaskStatus>(defaultStatus);
	const [status, setStatus] = React.useState<TaskStatus>(defaultStatus);
	const [priority, setPriority] = React.useState<TaskPriority>("no-priority");
	const [dueDate, setDueDate] = React.useState<string | undefined>(undefined);
	const [createMore, setCreateMore] = React.useState(false);
	const [attachedImages, setAttachedImages] = React.useState<
		{ name: string; dataUrl: string }[]
	>([]);

	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	const titleInputRef = React.useRef<HTMLInputElement>(null);

	// Update status if defaultStatus changes during render
	if (defaultStatus !== prevDefaultStatus) {
		setPrevDefaultStatus(defaultStatus);
		setStatus(defaultStatus);
	}

	// Auto-grow textarea height
	const adjustHeight = React.useCallback(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: adjust height when description changes
	React.useEffect(() => {
		if (open) {
			adjustHeight();
		}
	}, [open, description, adjustHeight]);

	React.useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				titleInputRef.current?.focus();
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [open]);

	const resetForm = () => {
		setTitle("");
		setDescription("");
		setPriority("no-priority");
		setDueDate(undefined);
		setAttachedImages([]);
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleSubmit = () => {
		if (!title.trim()) return;

		onSubmit({
			title: title.trim(),
			description: description.trim(),
			status,
			priority,
			dueDate,
		});

		if (createMore) {
			resetForm();
		} else {
			resetForm();
			onOpenChange(false);
		}
	};

	const handleFileSelect = (files: File[]) => {
		for (const file of files) {
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const dataUrl = e.target?.result as string;
					setAttachedImages((prev) => [...prev, { name: file.name, dataUrl }]);
					setDescription(
						(prev) => `${prev}${prev ? "\n" : ""}![${file.name}](${dataUrl})`,
					);
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const handleRemoveImage = (index: number, name: string, dataUrl: string) => {
		setAttachedImages((prev) => prev.filter((_, idx) => idx !== index));
		const markdownLink = `![${name}](${dataUrl})`;
		setDescription((prev) => prev.replace(markdownLink, "").trim());
	};

	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]" />
				<DialogPrimitive.Popup
					onKeyDown={handleGlobalKeyDown}
					className={cn(
						"fixed top-1/2 left-1/2 z-50 flex flex-col -translate-x-1/2 -translate-y-1/2 bg-popover text-popover-foreground shadow-2xl border-0 rounded-none outline-none",
						isExpanded
							? "w-[818px] h-[90vh] max-h-[1194px]"
							: "w-[748px] min-h-[260px] max-h-[560px] h-auto",
						"max-sm:w-[95vw] max-sm:h-[90vh] max-sm:max-h-none",
					)}
				>
					{/* Header */}
					<div className="flex items-center justify-between border-b-0 py-3 px-[18px] shrink-0">
						<div className="flex items-center gap-2">
							{/* Project Badge - boxy border with issues icon */}
							<div className="flex items-center gap-1 border border-zinc-300 dark:border-zinc-700 bg-transparent px-1.5 py-0.5 rounded-none text-foreground font-semibold text-[11px] h-5 select-none">
								<HugeiconsIcon
									icon={FocusPointIcon}
									className="size-3.5 text-[#5e6ad2] dark:text-[#8b9bf5]"
									strokeWidth={2.5}
								/>
								<span>STR</span>
							</div>
							<span className="text-zinc-400 text-xs font-normal">›</span>
							<span className="text-[13px] font-medium text-foreground select-none">
								New issue
							</span>
						</div>

						<div className="flex items-center gap-2">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger
										render={
											<button
												type="button"
												onClick={() => setIsExpanded(!isExpanded)}
												className="p-1 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring"
											/>
										}
									>
										<HugeiconsIcon
											icon={isExpanded ? ArrowShrink02Icon : ArrowExpand01Icon}
											className="size-4"
											strokeWidth={2.5}
										/>
									</TooltipTrigger>
									<TooltipContent>
										{isExpanded ? "Shrink" : "Expand"}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<DialogPrimitive.Close
								render={
									<button
										type="button"
										className="p-1 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring"
									/>
								}
							>
								<HugeiconsIcon
									icon={Cancel01Icon}
									className="size-4"
									strokeWidth={2.5}
								/>
							</DialogPrimitive.Close>
						</div>
					</div>

					{/* Main Content Form */}
					<div className="flex-1 overflow-y-auto py-3 px-[18px] flex flex-col gap-3 min-h-0">
						{/* Title input */}
						<input
							ref={titleInputRef}
							type="text"
							placeholder="Issue title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onKeyDown={handleTitleKeyDown}
							className="w-full text-[18px] font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/30 border-none bg-transparent outline-none p-0 focus:ring-0"
						/>

						{/* Description field */}
						<textarea
							ref={textareaRef}
							placeholder="Add description..."
							value={description}
							onChange={(e) => {
								setDescription(e.target.value);
								adjustHeight();
							}}
							className="w-full resize-none text-[15px] font-normal leading-[23px] text-foreground placeholder:text-muted-foreground/45 border-none bg-transparent outline-none p-0 focus:ring-0 min-h-[40px] focus:outline-none"
						/>

						{/* Inline Attached Images List */}
						{attachedImages.length > 0 && (
							<div className="grid grid-cols-2 gap-2 mt-2">
								{attachedImages.map((img, idx) => (
									<div
										key={img.dataUrl}
										className="relative group rounded-lg overflow-hidden border border-border bg-muted/40 aspect-video max-h-[160px] flex items-center justify-center"
									>
										<Image
											src={img.dataUrl}
											alt={img.name}
											width={280}
											height={160}
											unoptimized
											className="object-contain max-h-full max-w-full"
										/>
										<button
											type="button"
											onClick={() =>
												handleRemoveImage(idx, img.name, img.dataUrl)
											}
											className="absolute top-2 right-2 size-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
										>
											<HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
										</button>
									</div>
								))}
							</div>
						)}

						{/* Metadata selectors row - no borders, all boxy */}
						<div className="flex flex-wrap items-center gap-1.5 mt-auto pt-4 border-t-0 select-none">
							<IssueStatusSelect value={status} onChange={setStatus} />
							<IssuePrioritySelect value={priority} onChange={setPriority} />
							<IssueDueDateSelect value={dueDate} onChange={setDueDate} />
							<div className="flex h-7 items-center gap-1.5 border border-border bg-card px-2.5 py-0 text-xs font-medium text-muted-foreground select-none">
								<div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[8px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
									{user?.name
										? user.name
												.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()
												.slice(0, 1)
										: "U"}
								</div>
								<span className="text-[11px] font-medium text-foreground/80">
									{user?.name || "Unassigned"}
								</span>
							</div>
						</div>
					</div>

					{/* Footer - no border, boxy button */}
					<div className="flex items-center justify-between border-t-0 py-3 px-[18px] shrink-0 bg-background/50 rounded-none">
						<IssueAttachmentButton onFileSelect={handleFileSelect} />

						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Switch
									id="create-more"
									checked={createMore}
									onCheckedChange={setCreateMore}
									size="sm"
								/>
								<label
									htmlFor="create-more"
									className="text-[12px] font-normal leading-[18px] text-muted-foreground cursor-pointer select-none"
								>
									Create more
								</label>
							</div>

							<button
								type="button"
								disabled={!title.trim()}
								onClick={handleSubmit}
								className={cn(
									"h-8 px-4 rounded-none text-[12px] font-semibold transition-all select-none cursor-pointer outline-none border-0",
									"bg-[#5e6ad2] text-white hover:bg-[#5e6ad2]/90 disabled:opacity-50 disabled:pointer-events-none disabled:bg-[#5e6ad2]/60",
								)}
							>
								Create issue
							</button>
						</div>
					</div>
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
