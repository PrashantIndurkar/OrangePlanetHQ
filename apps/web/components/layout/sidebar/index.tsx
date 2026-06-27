"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/sidebar-provider";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
	const { isOpen, toggle } = useSidebar();
	const [width, setWidth] = React.useState(280); // default width, resizable between 240px and 360px
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
				240,
				Math.min(360, dragStartRef.current.width + deltaX),
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
				"relative flex h-screen shrink-0 flex-col overflow-hidden border-border bg-sidebar text-sidebar-foreground select-none",
				isOpen && "border-r",
				!isDragging && "transition-[width] duration-200 ease-in-out",
			)}
		>
			{/* Inner wrapper with fixed width matching sidebar active width to prevent distortion */}
			<div
				style={{ width: `${width}px` }}
				className="relative flex h-full shrink-0 flex-col justify-between"
			>
				<div className="flex flex-1 flex-col">
					{/* Sidebar Header */}
					<SidebarHeader sidebarWidth={width} />

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
						"absolute top-0 right-0 bottom-0 z-50 w-1 cursor-col-resize transition-all hover:w-1.5 hover:bg-primary/20",
						isDragging && "w-1.5 bg-primary/30",
					)}
					title="Drag to resize, click to collapse"
				/>
			)}
		</aside>
	);
}
export default Sidebar;
