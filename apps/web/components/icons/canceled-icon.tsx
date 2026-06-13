export function CanceledIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			role="img"
			aria-label="Canceled"
		>
			<title>Canceled</title>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
			<path
				d="M9 9L15 15M15 9L9 15"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}
