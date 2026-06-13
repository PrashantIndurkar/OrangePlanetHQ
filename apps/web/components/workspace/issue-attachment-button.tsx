import { Attachment02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { Button } from "@/components/ui/button";

interface IssueAttachmentButtonProps {
	onFileSelect: (files: File[]) => void;
}

export function IssueAttachmentButton({
	onFileSelect,
}: IssueAttachmentButtonProps) {
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onFileSelect(Array.from(e.target.files));
			e.target.value = ""; // reset selection
		}
	};

	return (
		<>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
				multiple
				accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				onClick={handleClick}
				className="rounded-none bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground cursor-pointer flex items-center justify-center h-[26px] w-[26px] shrink-0 border border-border"
				title="Attach files (images or documents)"
			>
				{/* Rotated 45 degrees to the right, increased strokeWidth for boldness */}
				<HugeiconsIcon
					icon={Attachment02Icon}
					className="size-4.5 rotate-45"
					strokeWidth={2.5}
				/>
			</Button>
		</>
	);
}
