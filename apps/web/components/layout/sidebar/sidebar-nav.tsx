"use client"

import {
  Add01Icon,
  ArrowDown01Icon,
  Folder01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ProjectItem {
  id: string
  name: string
  href: string
}

export function SidebarNav() {
  const pathname = usePathname()
  const [projectsExpanded, setProjectsExpanded] = React.useState(true)

  const projects: ProjectItem[] = [
    {
      id: "task-management",
      name: "Task-management",
      href: "/tasks",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-4 select-none">
      {/* Projects Collapsible Group */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setProjectsExpanded(!projectsExpanded)}
          className="flex w-full cursor-pointer items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase outline-none hover:text-foreground"
        >
          <span>Projects</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={12}
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              projectsExpanded && "rotate-180 transform"
            )}
          />
        </button>

        {/* Collapsible Project List */}
        <div
          className={cn(
            "flex flex-col gap-0.5 overflow-hidden transition-all duration-300 ease-in-out",
            projectsExpanded
              ? "mt-1 max-h-96 opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          {projects.map((project) => {
            // Highlight active if pathname matches /tasks or is dynamic taskId route
            const isActive =
              pathname === project.href ||
              (project.href === "/tasks" &&
                (pathname.startsWith("/tasks/") ||
                  (/^\/[a-zA-Z0-9_-]+$/.test(pathname) && pathname !== "/")))

            return (
              <Link
                key={project.id}
                href={project.href}
                className={cn(
                  "flex w-full items-center gap-2 rounded-none px-2.5 py-1.5 text-xs font-medium transition-colors outline-none",
                  isActive
                    ? "border-l-2 border-primary bg-muted pl-2 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <HugeiconsIcon
                  icon={Folder01Icon}
                  size={14}
                  className="shrink-0"
                />
                <span>{project.name}</span>
              </Link>
            )
          })}

          {/* Add Project Item UI (static) */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-none px-2.5 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted/40 hover:text-foreground"
          >
            <HugeiconsIcon icon={Add01Icon} size={14} className="shrink-0" />
            <span>Add project</span>
          </button>
        </div>
      </div>
    </div>
  )
}
