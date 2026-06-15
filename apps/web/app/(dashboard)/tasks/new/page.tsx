"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import type {
	TaskPriority,
	TaskStatus,
} from "@/components/tasks/task-metadata";
import { IssueAttachmentButton } from "@/components/workspace/issue-attachment-button";
import { IssueDueDateSelect } from "@/components/workspace/issue-due-date-select";
import { IssuePrioritySelect } from "@/components/workspace/issue-priority-select";
import { IssueStatusSelect } from "@/components/workspace/issue-status-select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useCreateTaskMutation } from "../../../../features/tasks/hooks";

export default function NewTaskPage() {
	const router = useRouter();
	const { user } = useAuth();
	const createTaskMutation = useCreateTaskMutation();

	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [status, setStatus] = React.useState<TaskStatus>("todo");
	const [priority, setPriority] = React.useState<TaskPriority>("no-priority");
	const [dueDate, setDueDate] = React.useState<string | undefined>(undefined);
	const [attachedImages, setAttachedImages] = React.useState<
		{ name: string; dataUrl: string }[]
	>([]);

	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	const titleInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		titleInputRef.current?.focus();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: auto-grow textarea when description changes
	React.useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, [description]);

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

	const handleCreate = () => {
		if (!title.trim()) return;

		let isoDueDate: string | null = null;
		if (dueDate) {
			const lower = dueDate.toLowerCase();
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
				isoDueDate = new Date(dueDate).toISOString();
			}
		}

		createTaskMutation.mutate(
			{
				title: title.trim(),
				description: description.trim(),
				status,
				priority,
				dueDate: isoDueDate,
			},
			{
				onSuccess: (data) => {
					const nextId = `STR-${data.task.issueNumber}`;
					router.push(`/tasks/${nextId}`);
				},
			},
		);
	};

	return (
		<div className="flex h-screen w-full flex-col bg-background overflow-hidden select-none">
			{/* Top Header / Breadcrumb Bar */}
			<header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border px-4">
				<div className="flex items-center gap-1.5 text-xs">
					<Link
						href="/tasks"
						className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						My Issues
					</Link>
					<span className="text-zinc-500 font-semibold">/</span>
					<span className="font-semibold text-foreground">New Task</span>
				</div>
			</header>

			{/* Main Scrollable Form Area */}
			<div className="flex-1 overflow-y-auto p-6 flex justify-center">
				<div className="w-full max-w-3xl flex flex-col gap-6 bg-card border border-border p-6 shadow-sm rounded-none h-fit">
					<div className="flex flex-col gap-4">
						{/* Title field */}
						<input
							ref={titleInputRef}
							type="text"
							placeholder="Task title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full text-xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/30 border-none bg-transparent outline-none p-0 focus:ring-0 focus:outline-none"
						/>

						{/* Description field */}
						<textarea
							ref={textareaRef}
							placeholder="Add description..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full resize-none text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/45 border-none bg-transparent outline-none p-0 focus:ring-0 min-h-[120px] focus:outline-none"
						/>

						{/* Attached Images */}
						{attachedImages.length > 0 && (
							<div className="grid grid-cols-2 gap-2 mt-2">
								{attachedImages.map((img, idx) => (
									<div
										key={img.dataUrl}
										className="relative group rounded-none overflow-hidden border border-border bg-muted/40 aspect-video max-h-[160px] flex items-center justify-center"
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
											className="absolute top-2 right-2 size-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 border-0"
										>
											<HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Metadata row selector */}
					<div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/40">
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
						<div className="ml-auto">
							<IssueAttachmentButton onFileSelect={handleFileSelect} />
						</div>
					</div>

					{/* Actions footer */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
						<Link
							href="/tasks"
							className="flex h-8 items-center px-4 rounded-none border border-border text-[12px] font-semibold text-foreground hover:bg-muted/50 transition-colors select-none"
						>
							Cancel
						</Link>
						<button
							type="button"
							disabled={!title.trim()}
							onClick={handleCreate}
							className={cn(
								"h-8 px-4 rounded-none text-[12px] font-semibold transition-all select-none cursor-pointer outline-none border-0",
								"bg-[#5e6ad2] text-white hover:bg-[#5e6ad2]/90 disabled:opacity-50 disabled:pointer-events-none disabled:bg-[#5e6ad2]/60",
							)}
						>
							Create Task
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
