"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUploadImageMutation } from "@/features/tasks/use-upload-image-mutation";
import { isValidImage } from "@/lib/image-validation";

interface TaskEditorProps {
	value: string;
	onChange: (val: string) => void;
	onBlur: () => void;
	onEditorCreated?: (editor: Editor) => void;
}

export function TaskEditor({
	value,
	onChange,
	onBlur,
	onEditorCreated,
}: TaskEditorProps) {
	const uploadMutation = useUploadImageMutation();

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				HTMLAttributes: {
					class: "kaneo-editor-image",
				},
			}),
			Placeholder.configure({
				placeholder: "Add description or drop images here...",
				emptyEditorClass: "is-editor-empty",
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class:
					"focus:outline-none min-h-[160px] max-w-none w-full text-[14px] leading-relaxed text-foreground select-text tiptap",
			},
			handlePaste: (_view, event) => {
				const items = Array.from(event.clipboardData?.items || []);
				const imageItem = items.find((item) => item.type.startsWith("image/"));
				if (imageItem) {
					const file = imageItem.getAsFile();
					if (file) {
						event.preventDefault();
						handleUpload(file);
						return true;
					}
				}
				return false;
			},
			handleDrop: (view, event) => {
				const files = Array.from(event.dataTransfer?.files || []);
				const imageFile = files.find((file) => file.type.startsWith("image/"));
				if (imageFile) {
					event.preventDefault();
					const coordinates = view.posAtCoords({
						left: event.clientX,
						top: event.clientY,
					});
					const pos = coordinates ? coordinates.pos : view.state.selection.from;
					handleUpload(imageFile, pos);
					return true;
				}
				return false;
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		onBlur: () => {
			onBlur();
		},
	});

	const handleUpload = async (file: File, pos?: number) => {
		if (!editor) return;
		const validation = isValidImage(file);
		if (!validation.valid) {
			toast.error(validation.error ?? "Invalid image");
			return;
		}
		const localUrl = URL.createObjectURL(file);

		// Insert loading preview image
		if (pos !== undefined) {
			editor.commands.insertContentAt(pos, {
				type: "image",
				attrs: {
					src: localUrl,
					alt: "Uploading...",
				},
			});
		} else {
			editor.commands.insertContent({
				type: "image",
				attrs: {
					src: localUrl,
					alt: "Uploading...",
				},
			});
		}

		try {
			const result = await uploadMutation.mutateAsync(file);
			editor.commands.command(({ tr, state }) => {
				let found = false;
				state.doc.descendants((node, pos) => {
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
			URL.revokeObjectURL(localUrl);
		} catch (err) {
			editor.commands.command(({ tr, state }) => {
				let found = false;
				state.doc.descendants((node, pos) => {
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
			URL.revokeObjectURL(localUrl);
		}
	};

	// Expose the editor instance to the parent component
	useEffect(() => {
		if (editor && onEditorCreated) {
			onEditorCreated(editor);
		}
	}, [editor, onEditorCreated]);

	// Sync external changes to the editor (e.g. initial load)
	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [value, editor]);

	return (
		<div className="w-full">
			<EditorContent editor={editor} />
		</div>
	);
}
