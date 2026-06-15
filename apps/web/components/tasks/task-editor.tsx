"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUploadImageMutation } from "@/features/tasks/use-upload-image-mutation";

interface TaskEditorProps {
	value: string;
	onChange: (val: string) => void;
	onBlur: () => void;
}

export function TaskEditor({ value, onChange, onBlur }: TaskEditorProps) {
	const uploadMutation = useUploadImageMutation();

	const handleUpload = async (file: File, insertFn: (url: string) => void) => {
		try {
			const result = await uploadMutation.mutateAsync(file);
			insertFn(result.url);
			toast.success("Image uploaded successfully");
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to upload image",
			);
		}
	};

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				HTMLAttributes: {
					class: "kaneo-editor-image",
				},
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class:
					"focus:outline-none min-h-[160px] max-w-none w-full text-[14px] leading-relaxed text-foreground select-text",
			},
			handlePaste: (view, event) => {
				const items = Array.from(event.clipboardData?.items || []);
				const imageItem = items.find((item) => item.type.startsWith("image/"));
				if (imageItem) {
					const file = imageItem.getAsFile();
					if (file) {
						event.preventDefault();
						handleUpload(file, (url) => {
							view.dispatch(
								view.state.tr.replaceSelectionWith(
									view.state.schema.nodes.image.create({ src: url }),
								),
							);
						});
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
					handleUpload(imageFile, (url) => {
						view.dispatch(
							view.state.tr.insert(
								pos,
								view.state.schema.nodes.image.create({ src: url }),
							),
						);
					});
					return true;
				}
				return false;
			},
		},
		onUpdate: ({ editor }) => {
			// Return HTML format for saving
			onChange(editor.getHTML());
		},
		onBlur: () => {
			onBlur();
		},
	});

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
