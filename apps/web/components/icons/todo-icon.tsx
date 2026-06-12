export function TodoIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			role="img"
			aria-label="Todo"
		>
			<title>Todo</title>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
		</svg>
	);
}
