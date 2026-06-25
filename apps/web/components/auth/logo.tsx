export function Logo() {
	return (
		<div className="flex items-center justify-center gap-2.5 py-6 select-none">
			<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20 dark:bg-blue-500">
				<svg
					className="h-5.5 w-5.5 text-white"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
					role="img"
					aria-label="Brand Logo"
				>
					<title>Brand Logo</title>
					<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
				</svg>
			</div>
			<span className="font-sans text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
				OrangePlanet
			</span>
		</div>
	);
}
