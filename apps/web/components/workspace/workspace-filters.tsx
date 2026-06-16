"use client";

import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/search-input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
	BacklogIcon,
	CanceledIcon,
	DoneIcon,
	HighPriorityIcon,
	InProgressIcon,
	LowPriorityIcon,
	MediumPriorityIcon,
	NoPriorityIcon,
	TodoIcon,
	UrgentPriorityIcon,
} from "../icons";
import { getNormalizedFilters } from "./types";

interface WorkspaceFiltersProps {
	view: "board" | "list";
	onViewChange: (view: "board" | "list") => void;
	showAllUsers?: boolean;
	onShowAllUsersChange?: (show: boolean) => void;
}

export function WorkspaceFilters({
	view,
	onViewChange,
	showAllUsers = false,
	onShowAllUsersChange,
}: WorkspaceFiltersProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [filterOpen, setFilterOpen] = useState(false);
	const [sortOpen, setSortOpen] = useState(false);
	const [isMac] = useState(() => {
		if (typeof window !== "undefined") {
			return window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
		}
		return true;
	});

	useHotkeys(
		"alt+v",
		(e) => {
			e.preventDefault();
			onViewChange(view === "list" ? "board" : "list");
		},
		{
			enableOnFormTags: false,
			enableOnContentEditable: false,
		},
		[view, onViewChange],
	);

	useHotkeys(
		"alt+f",
		(e) => {
			e.preventDefault();
			setFilterOpen((prev) => !prev);
		},
		{
			enableOnFormTags: false,
			enableOnContentEditable: false,
		},
		[],
	);

	useHotkeys(
		"alt+s",
		(e) => {
			e.preventDefault();
			setSortOpen((prev) => !prev);
		},
		{
			enableOnFormTags: false,
			enableOnContentEditable: false,
		},
		[],
	);

	const {
		activeStatuses,
		activePriorities,
		activeDueDates,
		sortBy,
		sortOrder,
	} = getNormalizedFilters(searchParams);

	const currentQuery = searchParams.get("q") || "";
	const [prevQuery, setPrevQuery] = useState(currentQuery);
	const [localSearch, setLocalSearch] = useState(currentQuery);

	if (currentQuery !== prevQuery) {
		setPrevQuery(currentQuery);
		setLocalSearch(currentQuery);
	}

	const setParams = useCallback(
		(params: Record<string, string | string[] | null>) => {
			const newParams = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(params)) {
				if (
					value === null ||
					value === undefined ||
					value === "" ||
					(Array.isArray(value) && value.length === 0)
				) {
					newParams.delete(key);
				} else if (Array.isArray(value)) {
					newParams.set(key, value.join(","));
				} else {
					newParams.set(key, value);
				}
			}
			const query = newParams.toString();
			router.replace(`${pathname}${query ? `?${query}` : ""}`, {
				scroll: false,
			});
		},
		[searchParams, pathname, router],
	);

	// Debounce and update URL search query parameter
	useEffect(() => {
		const handler = setTimeout(() => {
			const currentQ = searchParams.get("q") || "";
			if (localSearch !== currentQ) {
				setParams({ q: localSearch || null });
			}
		}, 500);

		return () => clearTimeout(handler);
	}, [localSearch, searchParams, setParams]);

	const activeFilterCount =
		activeStatuses.length + activePriorities.length + activeDueDates.length;

	const toggleFilter = useCallback(
		(key: string, value: string) => {
			const current = searchParams.get(key)?.split(",").filter(Boolean) || [];
			const updated = current.includes(value)
				? current.filter((v) => v !== value)
				: [...current, value];
			setParams({ [key]: updated });
		},
		[searchParams, setParams],
	);

	const statusOptions = [
		{
			value: "backlog",
			label: "Backlog",
			icon: BacklogIcon,
			color: "text-zinc-400",
		},
		{ value: "todo", label: "Todo", icon: TodoIcon, color: "text-zinc-500" },
		{
			value: "in-progress",
			label: "In Progress",
			icon: InProgressIcon,
			color: "text-amber-500",
		},
		{ value: "done", label: "Done", icon: DoneIcon, color: "text-indigo-500" },
		{
			value: "canceled",
			label: "Cancel/Delete",
			icon: CanceledIcon,
			color: "text-zinc-400",
		},
	];

	const priorityOptions = [
		{ value: "no-priority", label: "No Priority", icon: NoPriorityIcon },
		{ value: "urgent", label: "Urgent", icon: UrgentPriorityIcon },
		{ value: "high", label: "High", icon: HighPriorityIcon },
		{ value: "medium", label: "Medium", icon: MediumPriorityIcon },
		{ value: "low", label: "Low", icon: LowPriorityIcon },
	];

	const dueDateOptions = [
		{ value: "today", label: "Today" },
		{ value: "tomorrow", label: "Tomorrow" },
		{ value: "overdue", label: "Overdue" },
		{ value: "no-due-date", label: "No Due Date" },
	];

	return (
		<div className="flex h-11 w-full shrink-0 items-center justify-between border-b border-border bg-background px-4 select-none">
			{/* Left side: Search, Filter and Sort controls */}
			<div className="flex items-center gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={
								<SearchInput
									value={localSearch}
									onChange={(e) => setLocalSearch(e.target.value)}
									placeholder="Search title or ID..."
									size="sm"
									showShortcut={true}
									containerClassName="h-7 w-48 border-border bg-card rounded-none shadow-none focus-within:border-ring focus-within:ring-0 focus-within:ring-offset-0 focus-within:ring-transparent focus-within:ring-offset-transparent focus-within:shadow-none text-muted-foreground focus-within:text-foreground"
								/>
							}
						/>
						<TooltipContent className="gap-1.5">
							<span>Search issues by title or ID</span>
							<kbd data-slot="kbd">/</kbd>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Filter Dropdown */}
				<DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger
								render={
									<DropdownMenuTrigger className="flex h-7 cursor-pointer items-center gap-1.5 rounded-none border border-border bg-card px-2.5 py-0 text-xs font-medium text-muted-foreground transition-all duration-200 outline-none hover:bg-muted hover:text-foreground" />
								}
							>
								<svg
									className="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Filter</title>
									<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
								</svg>
								<span>
									Filter
									{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
								</span>
							</TooltipTrigger>
							<TooltipContent className="gap-1.5">
								<span>Filter issues</span>
								<kbd data-slot="kbd">{isMac ? "⌥ F" : "Alt+F"}</kbd>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<DropdownMenuContent className="w-48 p-1" align="start">
						{/* Status Submenu */}
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="p-0">
								<Command className="w-48 rounded-none">
									<CommandInput
										placeholder="Filter status..."
										className="h-8 border-none bg-transparent"
										autoFocus
									/>
									<CommandList className="max-h-56">
										<CommandEmpty>No status found.</CommandEmpty>
										<CommandGroup>
											{statusOptions.map((opt) => (
												<CommandItem
													key={opt.value}
													value={opt.label}
													data-checked={(
														activeStatuses as readonly string[]
													).includes(opt.value)}
													onSelect={() => toggleFilter("status", opt.value)}
													className="cursor-pointer rounded-none"
												>
													<opt.icon
														className={cn("mr-2 size-3.5", opt.color)}
													/>
													<span>{opt.label}</span>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</DropdownMenuSubContent>
						</DropdownMenuSub>

						{/* Priority Submenu */}
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="p-0">
								<Command className="w-48 rounded-none">
									<CommandInput
										placeholder="Filter priority..."
										className="h-8 border-none bg-transparent"
										autoFocus
									/>
									<CommandList className="max-h-56">
										<CommandEmpty>No priority found.</CommandEmpty>
										<CommandGroup>
											{priorityOptions.map((opt) => (
												<CommandItem
													key={opt.value}
													value={opt.label}
													data-checked={(
														activePriorities as readonly string[]
													).includes(opt.value)}
													onSelect={() => toggleFilter("priority", opt.value)}
													className="cursor-pointer rounded-none"
												>
													<opt.icon className="mr-2 size-3.5" />
													<span>{opt.label}</span>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</DropdownMenuSubContent>
						</DropdownMenuSub>

						{/* Due Date Submenu */}
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Due Date</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="p-0">
								<Command className="w-48 rounded-none">
									<CommandInput
										placeholder="Filter due date..."
										className="h-8 border-none bg-transparent"
										autoFocus
									/>
									<CommandList className="max-h-56">
										<CommandEmpty>No due date found.</CommandEmpty>
										<CommandGroup>
											{dueDateOptions.map((opt) => (
												<CommandItem
													key={opt.value}
													value={opt.label}
													data-checked={(
														activeDueDates as readonly string[]
													).includes(opt.value)}
													onSelect={() => toggleFilter("due_date", opt.value)}
													className="cursor-pointer rounded-none"
												>
													<HugeiconsIcon
														icon={Calendar04Icon}
														className="mr-2 size-3.5 text-zinc-500"
													/>
													<span>{opt.label}</span>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Sort Dropdown */}
				<DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger
								render={
									<DropdownMenuTrigger className="flex h-7 cursor-pointer items-center gap-1.5 rounded-none border border-border bg-card px-2.5 py-0 text-xs font-medium text-muted-foreground transition-all duration-200 outline-none hover:bg-muted hover:text-foreground" />
								}
							>
								<svg
									className="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Sort</title>
									<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16" />
								</svg>
								<span>Sort</span>
							</TooltipTrigger>
							<TooltipContent className="gap-1.5">
								<span>Sort issues</span>
								<kbd data-slot="kbd">{isMac ? "⌥ S" : "Alt+S"}</kbd>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<DropdownMenuContent className="w-48 p-1" align="start">
						<DropdownMenuRadioGroup
							value={sortBy}
							onValueChange={(val) => setParams({ sort_by: val })}
						>
							<DropdownMenuRadioItem
								value="created"
								className="cursor-pointer rounded-none"
							>
								Created Date
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem
								value="dueDate"
								className="cursor-pointer rounded-none"
							>
								Due Date
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem
								value="priority"
								className="cursor-pointer rounded-none"
							>
								Priority
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={sortOrder}
							onValueChange={(val) => setParams({ sort_order: val })}
						>
							<DropdownMenuRadioItem
								value="asc"
								className="cursor-pointer rounded-none"
							>
								Ascending
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem
								value="desc"
								className="cursor-pointer rounded-none"
							>
								Descending
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* All Users Toggle (Only visible for Admins when callback is available) */}
				{onShowAllUsersChange && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger
								render={
									<button
										type="button"
										onClick={() => onShowAllUsersChange(!showAllUsers)}
										className={cn(
											"flex h-7 cursor-pointer items-center gap-1.5 rounded-none border px-2.5 py-0 text-xs font-semibold transition-all duration-200 outline-none",
											showAllUsers
												? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20"
												: "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
										)}
									/>
								}
							>
								<svg
									className="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>All Users</title>
									<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
									<path d="M16 3.13a4 4 0 0 1 0 7.75" />
								</svg>
								<span>Show All Users&apos; Tasks</span>
							</TooltipTrigger>
							<TooltipContent>
								Toggle showing tasks from all workspace members
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>

			{/* Right side: View Switcher (Board vs List) */}
			<div className="flex h-7 items-center gap-0.5 rounded-none border border-border bg-muted/10 p-0.5">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={
								<button
									type="button"
									onClick={() => onViewChange("list")}
									className={cn(
										"flex h-full cursor-pointer items-center gap-1.5 border-none px-2.5 text-xs transition-all duration-200 outline-none",
										view === "list"
											? "bg-muted font-semibold text-foreground"
											: "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
									)}
								/>
							}
						>
							<svg
								className="h-3.5 w-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>List View</title>
								<line x1="8" y1="6" x2="21" y2="6" />
								<line x1="8" y1="12" x2="21" y2="12" />
								<line x1="8" y1="18" x2="21" y2="18" />
								<line x1="3" y1="6" x2="3.01" y2="6" />
								<line x1="3" y1="12" x2="3.01" y2="12" />
								<line x1="3" y1="18" x2="3.01" y2="18" />
							</svg>
							<span>List</span>
						</TooltipTrigger>
						<TooltipContent className="gap-1.5">
							<span>Switch to list layout</span>
							<kbd data-slot="kbd">{isMac ? "⌥ V" : "Alt+V"}</kbd>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={
								<button
									type="button"
									onClick={() => onViewChange("board")}
									className={cn(
										"flex h-full cursor-pointer items-center gap-1.5 border-none px-2.5 text-xs transition-all duration-200 outline-none",
										view === "board"
											? "bg-muted font-semibold text-foreground"
											: "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
									)}
								/>
							}
						>
							<svg
								className="h-3.5 w-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Board View</title>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<path d="M9 3v18M15 3v18" />
							</svg>
							<span>Board</span>
						</TooltipTrigger>
						<TooltipContent className="gap-1.5">
							<span>Switch to kanban board layout</span>
							<kbd data-slot="kbd">{isMac ? "⌥ V" : "Alt+V"}</kbd>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
