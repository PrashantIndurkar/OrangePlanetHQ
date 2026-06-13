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
import { statuses, type TaskStatus } from "./task-metadata";

interface TaskStatusListProps {
	value: TaskStatus;
	onSelect: (status: TaskStatus) => void;
}

export function TaskStatusList({ value, onSelect }: TaskStatusListProps) {
	return (
		<Command className="rounded-none">
			<CommandInput placeholder="Change status..." autoFocus />
			<CommandList className="max-h-[220px]">
				<CommandEmpty>No status found.</CommandEmpty>
				<CommandGroup>
					{statuses.map((s) => {
						const Icon = s.icon;
						const isSelected = value === s.value;
						return (
							<CommandItem
								key={s.value}
								value={s.label}
								onSelect={() => onSelect(s.value)}
								className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-default select-none outline-none hover:bg-muted/80"
							>
								<Icon
									className={cn(
										"h-4 w-4 shrink-0",
										isSelected ? "text-primary" : "text-muted-foreground",
									)}
								/>
								<span className="flex-grow text-left text-[12px] font-medium text-foreground">
									{s.label}
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
										{s.shortcut}
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
