import { Calendar04Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface IssueDueDateSelectProps {
	value?: string; // "Today", "Tomorrow", "Overdue", or undefined
	onChange: (value?: string) => void;
}

const dueDateOptions = [
	{ value: undefined, label: "No due date" },
	{ value: "Today", label: "Today" },
	{ value: "Tomorrow", label: "Tomorrow" },
	{ value: "Overdue", label: "Overdue" },
];

export function IssueDueDateSelect({
	value,
	onChange,
}: IssueDueDateSelectProps) {
	const [open, setOpen] = React.useState(false);

	const handleSelect = (newValue?: string) => {
		onChange(newValue);
		setOpen(false);
	};

	const getDisplayValue = (val?: string) => {
		if (!val) return "Due date";
		if (val === "Today" || val === "Tomorrow" || val === "Overdue") {
			return val;
		}
		const parsed = Date.parse(val);
		if (!Number.isNaN(parsed)) {
			const date = new Date(parsed);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			const compareDate = new Date(date);
			compareDate.setHours(0, 0, 0, 0);

			if (compareDate.getTime() === today.getTime()) {
				return "Today";
			} else if (compareDate.getTime() === tomorrow.getTime()) {
				return "Tomorrow";
			} else if (compareDate.getTime() < today.getTime()) {
				return "Overdue";
			} else {
				return date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});
			}
		}
		return val;
	};

	const getDueDateColor = (val?: string) => {
		if (!val) return "text-zinc-500 dark:text-zinc-400";
		const display = getDisplayValue(val);
		if (display === "Overdue") return "text-red-500 dark:text-red-400";
		if (display === "Today") return "text-amber-600 dark:text-amber-400";
		if (display === "Tomorrow") return "text-blue-600 dark:text-blue-400";
		return "text-zinc-700 dark:text-zinc-300";
	};

	const getOptionStyles = (label: string) => {
		if (label === "Today") {
			return {
				icon: "text-amber-500 dark:text-amber-400",
				text: "text-amber-700 dark:text-amber-400",
			};
		}
		if (label === "Tomorrow") {
			return {
				icon: "text-blue-500 dark:text-blue-400",
				text: "text-blue-700 dark:text-blue-400",
			};
		}
		if (label === "Overdue") {
			return {
				icon: "text-red-500 dark:text-red-400",
				text: "text-red-600 dark:text-red-400",
			};
		}
		return {
			icon: "text-zinc-400 dark:text-zinc-500",
			text: "text-zinc-700 dark:text-zinc-300",
		};
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
				<HugeiconsIcon
					icon={Calendar04Icon}
					className={cn("size-3.5 shrink-0", getDueDateColor(value))}
				/>
				<span
					className={cn(
						"text-[12px] leading-none font-medium",
						value ? getDueDateColor(value) : "text-foreground",
					)}
				>
					{getDisplayValue(value)}
				</span>
			</PopoverTrigger>
			<PopoverContent
				className="w-[180px] p-0 rounded-none border border-border/80 shadow-md bg-popover"
				align="start"
			>
				<div className="flex flex-col p-1">
					{dueDateOptions.map((opt) => {
						const isSelected = value === opt.value;
						const styles = getOptionStyles(opt.label);
						return (
							<button
								key={opt.label}
								type="button"
								onClick={() => handleSelect(opt.value)}
								className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-left cursor-default select-none outline-none hover:bg-muted/80 rounded-none text-foreground font-medium"
							>
								<HugeiconsIcon
									icon={Calendar04Icon}
									className={cn("size-3.5 shrink-0", styles.icon)}
								/>
								<span className={cn("flex-grow text-[12px]", styles.text)}>
									{opt.label}
								</span>
								{isSelected && (
									<HugeiconsIcon
										icon={Tick02Icon}
										className="h-4 w-4 text-primary shrink-0"
										strokeWidth={2.5}
									/>
								)}
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
