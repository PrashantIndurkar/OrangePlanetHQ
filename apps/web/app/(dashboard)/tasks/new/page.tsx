/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { Editor } from "@tiptap/react";
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
import { uploadImage } from "@/lib/upload-image";
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
	const [isUploading, setIsUploading] = React.useState(false);

	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	const titleInputRef = React.useRef<HTMLInputElement>(null);
	const editorRef = React.useRef<Editor | null>(null);

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

	const handleFileSelect = async (files: File[]) => {
		if (!editorRef.current) return;
		const editor = editorRef.current;

		const allowedTypes = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/webp",
			"image/gif",
		];

		const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
		setIsUploading(true);
		for (const file of files) {
			if (!allowedTypes.includes(file.type)) {
				toast.error(
					`File "${file.name}" format is not supported. Please upload PNG, JPG, WEBP, or GIF images.`,
				);
				continue;
			}
			if (file.size > MAX_IMAGE_SIZE) {
				toast.error(`File "${file.name}" exceeds the 5 MB size limit.`);
				continue;
			}
			if (file.type.startsWith("image/")) {
				const localUrl = URL.createObjectURL(file);

				// Insert image loading preview
				editor.commands.insertContent({
					type: "image",
					attrs: {
						src: localUrl,
						alt: "Uploading...",
					},
				});

				try {
					const result = await uploadImage(file);
					// biome-ignore lint/suspicious/noExplicitAny: Tiptap types
					editor.commands.command(({ tr, state }: any) => {
						let found = false;
						// biome-ignore lint/suspicious/noExplicitAny: Tiptap types
						state.doc.descendants((node: any, pos: number) => {
							if (node.type.name === "image" && node.attrs.src === localUrl) {
								tr.setNodeMarkup(pos, undefined, {
									...node.attrs,
									src: result.url,
									alt: file.name,
								});
								found = true;
								return false;
							}
						});
						return found;
					});
					toast.success("Image uploaded successfully");
				} catch (err) {
					// Remove the preview if failed
					// biome-ignore lint/suspicious/noExplicitAny: Tiptap types
					editor.commands.command(({ tr, state }: any) => {
						let found = false;
						// biome-ignore lint/suspicious/noExplicitAny: Tiptap types
						state.doc.descendants((node: any, pos: number) => {
							if (node.type.name === "image" && node.attrs.src === localUrl) {
								tr.delete(pos, pos + node.nodeSize);
								found = true;
								return false;
							}
						});
						return found;
					});
					toast.error(
						err instanceof Error ? err.message : "Failed to upload image",
					);
				}
			}
		}
		setIsUploading(false);
	};

	const handleCreate = () => {
		if (!title.trim() || isUploading) return;

		let finalDesc = description.trim();
		// Clean up empty Tiptap paragraphs/placeholders
		if (
			finalDesc === "<p></p>" ||
			finalDesc === "<p></p><p></p>" ||
			finalDesc === "<p></p><p></p><p></p>"
		) {
			finalDesc = "";
		}

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
				description: finalDesc,
				status,
				priority,
				dueDate: isoDueDate,
			},
			{
				onSuccess: (data) => {
					const nextId = `OPH-${data.task.issueNumber}`;
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
			<div className="flex-1 overflow-y-auto p-6 flex justify-center pb-24">
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
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: Container focusing */}
						{/* biome-ignore lint/a11y/noStaticElementInteractions: Container focusing */}
						<div
							className="flex-1 min-h-[260px] overflow-y-auto w-full pb-10 cursor-text"
							onClick={() => {
								if (editorRef.current) {
									editorRef.current.commands.focus();
								}
							}}
						>
							<TaskEditor
								value={description}
								onChange={setDescription}
								onBlur={() => {}}
								onEditorCreated={(editor) => {
									editorRef.current = editor;
								}}
							/>
						</div>
					</div>

					{/* Metadata row selector */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: Stop propagation container */}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: Stop propagation container */}
					<div
						className="flex flex-wrap items-center gap-2 pt-6 border-t border-border/40 mt-6 relative z-20 bg-card"
						onClick={(e) => e.stopPropagation()}
					>
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
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 sticky bottom-0 bg-card z-10">
						<Link
							href="/tasks"
							className="flex h-8 items-center px-4 rounded-none border border-border text-[12px] font-semibold text-foreground hover:bg-muted/50 transition-colors select-none"
						>
							Cancel
						</Link>
						<button
							type="button"
							disabled={!title.trim() || isUploading}
							onClick={handleCreate}
							className={cn(
								"h-8 px-4 rounded-none text-[12px] font-semibold transition-all select-none cursor-pointer outline-none border-0",
								"bg-[#FF591E] text-white hover:bg-[#FF591E]/90 disabled:opacity-50 disabled:pointer-events-none disabled:bg-[#FF591E]/60",
							)}
						>
							{isUploading ? "Uploading..." : "Create Task"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
