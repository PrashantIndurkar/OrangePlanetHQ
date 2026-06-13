export function DuplicateIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			role="img"
			aria-label="Duplicate"
		>
			<title>Duplicate</title>
			<rect
				x="8"
				y="8"
				width="10"
				height="10"
				rx="1.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<path
				d="M14 5H6.5A1.5 1.5 0 0 0 5 6.5V14"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
