import * as React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { priorities, type TaskPriority } from "../tasks/task-metadata";
import { TaskPriorityList } from "../tasks/task-priority-list";

interface IssuePrioritySelectProps {
	value: TaskPriority;
	onChange: (priority: TaskPriority) => void;
}

const getPriorityColorClass = (priority: TaskPriority) => {
	switch (priority) {
		case "no-priority":
			return "text-zinc-400 dark:text-zinc-500";
		case "urgent":
			return "text-red-500";
		case "high":
			return "text-zinc-700 dark:text-zinc-300";
		case "medium":
			return "text-zinc-600 dark:text-zinc-400";
		case "low":
			return "text-zinc-400 dark:text-zinc-500";
		default:
			return "text-zinc-500";
	}
};

export function IssuePrioritySelect({
	value,
	onChange,
}: IssuePrioritySelectProps) {
	const [open, setOpen] = React.useState(false);

	const selectedPriority =
		priorities.find((p) => p.value === value) || priorities[0];
	const SelectedIcon = selectedPriority.icon;

	const handleSelect = (newValue: TaskPriority) => {
		onChange(newValue);
		setOpen(false);
	};

	// Handle number keys (0-4) when popover is open
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (open && ["0", "1", "2", "3", "4"].includes(e.key)) {
			e.preventDefault();
			const index = Number(e.key);
			if (index >= 0 && index < priorities.length) {
				handleSelect(priorities[index].value as TaskPriority);
			}
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<button
						type="button"
						className={cn(
							"flex h-[26px] items-center gap-1.5 rounded-none border border-border/20 bg-transparent hover:bg-muted/40 px-2 text-xs font-normal text-foreground cursor-pointer outline-none transition-colors select-none",
							"focus-visible:ring-1 focus-visible:ring-ring/50",
						)}
					/>
				}
			>
				<span
					className={cn(
						"flex size-4 shrink-0 items-center justify-center",
						getPriorityColorClass(selectedPriority.value as TaskPriority),
					)}
				>
					<SelectedIcon className="size-3.5 shrink-0" />
				</span>
				<span className="text-[12px] leading-none font-medium text-foreground">
					{selectedPriority.value === "no-priority"
						? "Priority"
						: selectedPriority.label}
				</span>
			</PopoverTrigger>
			<PopoverContent
				className="w-[180px] p-0 rounded-none border border-border/80 shadow-md bg-popover"
				align="start"
				onKeyDown={handleKeyDown}
			>
				<TaskPriorityList value={value} onSelect={handleSelect} />
			</PopoverContent>
		</Popover>
	);
}
