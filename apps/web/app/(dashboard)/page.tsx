import { Suspense } from "react";
import { WorkspaceLayout } from "@/components/workspace";

export default function DashboardPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
					Loading...
				</div>
			}
		>
			<WorkspaceLayout />
		</Suspense>
	);
}
