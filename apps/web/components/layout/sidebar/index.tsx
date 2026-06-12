"use client";

import * as React from "react";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/sidebar-provider";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
	const { isOpen, toggle } = useSidebar();
	const [width, setWidth] = React.useState(260); // default width, resizable between 220px and 330px
	const [isDragging, setIsDragging] = React.useState(false);
	const dragStartRef = React.useRef<{ x: number; width: number } | null>(null);

	const handleMouseDown = React.useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			setIsDragging(true);
			dragStartRef.current = {
				x: e.clientX,
				width: width,
			};
		},
		[width],
	);

	React.useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!dragStartRef.current) return;
			const deltaX = e.clientX - dragStartRef.current.x;
			const newWidth = Math.max(
				220,
				Math.min(330, dragStartRef.current.width + deltaX),
			);
			setWidth(newWidth);
		};

		const handleMouseUp = (e: MouseEvent) => {
			setIsDragging(false);
			if (dragStartRef.current) {
				const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
				if (deltaX < 3) {
					toggle();
				}
			}
			dragStartRef.current = null;
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, toggle]);

	return (
		<aside
			style={{ width: isOpen ? `${width}px` : "0px" }}
			className={cn(
				"relative h-screen border-border bg-sidebar text-sidebar-foreground flex flex-col overflow-hidden shrink-0 select-none",
				isOpen && "border-r",
				!isDragging && "transition-[width] duration-200 ease-in-out",
			)}
		>
			{/* Inner wrapper with fixed width matching sidebar active width to prevent distortion */}
			<div
				style={{ width: `${width}px` }}
				className="h-full flex flex-col justify-between shrink-0 relative"
			>
				<div className="flex flex-col flex-1">
					{/* Sidebar Header */}
					<SidebarHeader />

					{/* Global Search Section aligned to workspace filters height */}
					<div className="px-4 h-11 flex items-center border-b border-border bg-muted/5 shrink-0">
						<div className="flex-1">
							<SearchInput
								placeholder="Search..."
								showShortcut={true}
								shortcutKey="/"
							/>
						</div>
					</div>

					{/* Navigation List */}
					<SidebarNav />
				</div>

				{/* Sidebar Footer */}
				<SidebarFooter />
			</div>

			{/* Interactive Clickable & Draggable Border Zone */}
			{isOpen && (
				<div
					role="separator"
					aria-valuenow={width}
					aria-valuemin={220}
					aria-valuemax={330}
					tabIndex={0}
					onMouseDown={handleMouseDown}
					className={cn(
						"absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 cursor-col-resize z-50 transition-all hover:bg-primary/20",
						isDragging && "bg-primary/30 w-1.5",
					)}
					title="Drag to resize, click to collapse"
				/>
			)}
		</aside>
	);
}
export default Sidebar;
