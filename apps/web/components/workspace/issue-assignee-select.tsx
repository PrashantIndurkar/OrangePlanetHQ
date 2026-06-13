import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface IssueAssigneeSelectProps {
	value?: string;
	onChange?: (assignee: string) => void;
}

export function IssueAssigneeSelect({
	value = "prashantindurkarr",
}: IssueAssigneeSelectProps) {
	// Defaults to PI for prashantindurkarr
	const initials = "PI";

	return (
		<button
			type="button"
			className={cn(
				"flex h-[26px] items-center gap-1.5 rounded-none border border-border/20 bg-transparent hover:bg-muted/40 px-2 text-xs font-normal text-foreground cursor-pointer outline-none transition-colors select-none",
				"focus-visible:ring-1 focus-visible:ring-ring/50",
			)}
		>
			<Avatar className="size-4 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
				<AvatarFallback className="flex size-full items-center justify-center rounded-full text-[9px] font-bold">
					{initials}
				</AvatarFallback>
			</Avatar>
			<span className="text-[12px] font-medium text-foreground">{value}</span>
		</button>
	);
}
