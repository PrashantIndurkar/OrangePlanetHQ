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

	const getDueDateColor = (val?: string) => {
		if (val === "Overdue") return "text-red-500 dark:text-red-400";
		if (val === "Today") return "text-amber-600 dark:text-amber-400";
		if (val === "Tomorrow") return "text-blue-600 dark:text-blue-400";
		return "text-zinc-500 dark:text-zinc-400";
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
				<span className={cn("text-[12px] leading-none font-medium", value ? getDueDateColor(value) : "text-foreground")}>
					{value || "Due date"}
				</span>
			</PopoverTrigger>
			<PopoverContent
				className="w-[180px] p-0 rounded-none border border-border/80 shadow-md bg-popover"
				align="start"
			>
				<div className="flex flex-col p-1">
					{dueDateOptions.map((opt) => {
						const isSelected = value === opt.value;
						return (
							<button
								key={opt.label}
								type="button"
								onClick={() => handleSelect(opt.value)}
								className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-left cursor-default select-none outline-none hover:bg-muted/80 rounded-none text-foreground font-medium"
							>
								<HugeiconsIcon
									icon={Calendar04Icon}
									className="size-3.5 shrink-0 text-muted-foreground"
								/>
								<span className="flex-grow text-[12px]">{opt.label}</span>
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
