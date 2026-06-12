"use client";

import {
	Add01Icon,
	ArrowDown01Icon,
	Folder01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProjectItem {
	id: string;
	name: string;
	href: string;
}

export function SidebarNav() {
	const pathname = usePathname();
	const [projectsExpanded, setProjectsExpanded] = React.useState(true);

	const projects: ProjectItem[] = [
		{
			id: "task-management",
			name: "Task-management",
			href: "/tasks",
		},
	];

	return (
		<div className="flex-1 py-4 px-3 flex flex-col gap-4 select-none">
			{/* Projects Collapsible Group */}
			<div className="flex flex-col gap-1">
				<button
					type="button"
					onClick={() => setProjectsExpanded(!projectsExpanded)}
					className="flex items-center justify-between w-full px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider outline-none cursor-pointer"
				>
					<span>Projects</span>
					<HugeiconsIcon
						icon={ArrowDown01Icon}
						size={12}
						className={cn(
							"transition-transform duration-200 text-muted-foreground",
							projectsExpanded && "transform rotate-180",
						)}
					/>
				</button>

				{/* Collapsible Project List */}
				<div
					className={cn(
						"flex flex-col gap-0.5 overflow-hidden transition-all duration-300 ease-in-out",
						projectsExpanded
							? "max-h-96 opacity-100 mt-1"
							: "max-h-0 opacity-0 pointer-events-none",
					)}
				>
					{projects.map((project) => {
						// Highlight active if pathname matches /tasks or is dynamic taskId route
						const isActive =
							pathname === project.href ||
							(project.href === "/tasks" &&
								(pathname.startsWith("/tasks/") ||
									(/^\/[a-zA-Z0-9_-]+$/.test(pathname) && pathname !== "/")));

						return (
							<Link
								key={project.id}
								href={project.href}
								className={cn(
									"flex items-center gap-2 px-2.5 py-1.5 text-xs transition-colors rounded-none w-full font-medium outline-none",
									isActive
										? "bg-muted text-foreground border-l-2 border-primary pl-2"
										: "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
								)}
							>
								<HugeiconsIcon
									icon={Folder01Icon}
									size={14}
									className="shrink-0"
								/>
								<span>{project.name}</span>
							</Link>
						);
					})}

					{/* Add Project Item UI (static) */}
					<button
						type="button"
						className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors rounded-none w-full font-medium outline-none cursor-pointer text-left"
					>
						<HugeiconsIcon icon={Add01Icon} size={14} className="shrink-0" />
						<span>Add project</span>
					</button>
				</div>
			</div>
		</div>
	);
}
