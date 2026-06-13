export function BacklogIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Backlog"
    >
      <title>Backlog</title>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="2 3"
      />
    </svg>
  )
}
