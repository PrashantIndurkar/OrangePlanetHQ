import { Calendar04Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface TaskDueDateListProps {
	value?: string;
	onSelect: (dueDate?: string) => void;
}

const dueDateOptions = [
	{ value: undefined, label: "No due date", shortcut: "0" },
	{ value: "Today", label: "Today", shortcut: "1" },
	{ value: "Tomorrow", label: "Tomorrow", shortcut: "2" },
	{ value: "Overdue", label: "Overdue", shortcut: "3" },
];

export function TaskDueDateList({ value, onSelect }: TaskDueDateListProps) {
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
		<Command className="rounded-none">
			<CommandInput placeholder="Set due date to..." autoFocus />
			<CommandList className="max-h-[220px]">
				<CommandEmpty>No option found.</CommandEmpty>
				<CommandGroup>
					{dueDateOptions.map((opt) => {
						const isSelected = value === opt.label || (opt.value === undefined && !value);
						const styles = getOptionStyles(opt.label);
						return (
							<CommandItem
								key={opt.label}
								value={opt.label}
								onSelect={() => onSelect(opt.value)}
								className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-default select-none outline-none hover:bg-muted/80"
							>
								<HugeiconsIcon
									icon={Calendar04Icon}
									className={cn("h-4 w-4 shrink-0", styles.icon)}
								/>
								<span className={cn("flex-grow text-left text-[12px] font-medium", styles.text)}>
									{opt.label}
								</span>
								<div className="ml-auto flex shrink-0 items-center gap-2">
									{isSelected ? (
										<HugeiconsIcon
											icon={Tick02Icon}
											className="h-4 w-4 text-primary"
											strokeWidth={2.5}
										/>
									) : (
										<div className="h-4 w-4" />
									)}
									<CommandShortcut className="ml-0 min-w-[12px] text-right tracking-normal text-[10px] font-mono text-muted-foreground/60">
										{opt.shortcut}
									</CommandShortcut>
								</div>
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
