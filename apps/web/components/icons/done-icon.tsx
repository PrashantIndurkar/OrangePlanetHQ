export function DoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Done"
    >
      <title>Done</title>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path
        d="M8.5 12L11 14.5L15.5 10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
