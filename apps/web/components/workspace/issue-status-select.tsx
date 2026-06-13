import * as React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { statuses, type TaskStatus } from "../tasks/task-metadata";
import { TaskStatusList } from "../tasks/task-status-list";

interface IssueStatusSelectProps {
	value: TaskStatus;
	onChange: (status: TaskStatus) => void;
}

const getStatusColorClass = (status: TaskStatus) => {
	switch (status) {
		case "backlog":
			return "text-zinc-500 dark:text-zinc-400";
		case "todo":
			return "text-zinc-500 dark:text-zinc-400";
		case "in-progress":
			return "text-amber-500 dark:text-amber-400";
		case "in-review":
			return "text-blue-500 dark:text-blue-400";
		case "done":
			return "text-indigo-500 dark:text-indigo-400";
		case "canceled":
			return "text-zinc-400 dark:text-zinc-500";
		default:
			return "text-zinc-500 dark:text-zinc-400";
	}
};

export function IssueStatusSelect({ value, onChange }: IssueStatusSelectProps) {
	const [open, setOpen] = React.useState(false);

	const selectedStatus = statuses.find((s) => s.value === value) || statuses[1];
	const SelectedIcon = selectedStatus.icon;

	const handleSelect = (newValue: TaskStatus) => {
		onChange(newValue);
		setOpen(false);
	};

	// Handle number keys (1-6) when popover is open
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (open && ["1", "2", "3", "4", "5", "6"].includes(e.key)) {
			e.preventDefault();
			const index = Number(e.key) - 1;
			if (index >= 0 && index < statuses.length) {
				handleSelect(statuses[index].value as TaskStatus);
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
							"flex h-[26px] items-center gap-1.5 rounded-none border border-border bg-transparent hover:bg-muted/40 px-2 text-xs font-normal text-foreground cursor-pointer outline-none transition-colors select-none",
							"focus-visible:ring-1 focus-visible:ring-ring/50",
						)}
					/>
				}
			>
				<span
					className={cn(
						"flex size-4 shrink-0 items-center justify-center",
						getStatusColorClass(selectedStatus.value as TaskStatus),
					)}
				>
					<SelectedIcon className="size-3.5 shrink-0" />
				</span>
				<span className="text-[12px] leading-none font-medium text-foreground">
					{selectedStatus.label}
				</span>
			</PopoverTrigger>
			<PopoverContent
				className="w-[180px] p-0 rounded-none border border-border/80 shadow-md bg-popover"
				align="start"
				onKeyDown={handleKeyDown}
			>
				<TaskStatusList value={value} onSelect={handleSelect} />
			</PopoverContent>
		</Popover>
	);
}
