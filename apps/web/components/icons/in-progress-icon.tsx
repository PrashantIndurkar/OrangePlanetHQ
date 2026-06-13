export function InProgressIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="In Progress"
    >
      <title>In Progress</title>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" />
    </svg>
  )
}
