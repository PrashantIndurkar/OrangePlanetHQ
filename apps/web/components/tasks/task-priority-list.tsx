import { Tick02Icon } from "@hugeicons/core-free-icons";
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
import { priorities, type TaskPriority } from "./task-metadata";

interface TaskPriorityListProps {
	value: TaskPriority;
	onSelect: (priority: TaskPriority) => void;
}

export function TaskPriorityList({ value, onSelect }: TaskPriorityListProps) {
	return (
		<Command className="rounded-none">
			<CommandInput placeholder="Set priority to..." autoFocus />
			<CommandList className="max-h-[220px]">
				<CommandEmpty>No priority found.</CommandEmpty>
				<CommandGroup>
					{priorities.map((p) => {
						const Icon = p.icon;
						const isSelected = value === p.value;
						return (
							<CommandItem
								key={p.value}
								value={p.label}
								onSelect={() => onSelect(p.value)}
								className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-default select-none outline-none hover:bg-muted/80"
							>
								<Icon
									className={cn(
										"h-4 w-4 shrink-0",
										p.value === "no-priority" &&
											"text-zinc-500 dark:text-zinc-400",
										p.value === "urgent" && "text-red-500 dark:text-red-400",
										p.value === "high" && "text-zinc-800 dark:text-zinc-200",
										p.value === "medium" && "text-zinc-600 dark:text-zinc-300",
										p.value === "low" && "text-zinc-500 dark:text-zinc-400",
									)}
								/>
								<span className="flex-grow text-left text-[12px] font-medium text-foreground">
									{p.label}
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
										{p.shortcut}
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
