export function InReviewIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			role="img"
			aria-label="In Review"
		>
			<title>In Review</title>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
			<path d="M12 3 A9 9 0 1 1 3 12 L12 12 Z" fill="currentColor" />
		</svg>
	);
}
