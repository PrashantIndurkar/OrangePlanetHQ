export function PriorityIcon({ className }: { className?: string }) {
  // Fallback/Default priority icon is the NoPriority ellipsis icon
  return <NoPriorityIcon className={className} />
}

export function NoPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      role="img"
      aria-label="No Priority"
    >
      <title>No Priority</title>
      <circle
        cx="8"
        cy="12"
        r="1.2"
        className="fill-zinc-400 stroke-none dark:fill-zinc-500"
      />
      <circle
        cx="12"
        cy="12"
        r="1.2"
        className="fill-zinc-400 stroke-none dark:fill-zinc-500"
      />
      <circle
        cx="16"
        cy="12"
        r="1.2"
        className="fill-zinc-400 stroke-none dark:fill-zinc-500"
      />
    </svg>
  )
}

export function UrgentPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Urgent Priority"
    >
      <title>Urgent Priority</title>
      <path
        d="M12 7v6M12 16.5h.01"
        className="stroke-red-500 dark:stroke-red-400"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HighPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="High Priority"
    >
      <title>High Priority</title>
      <rect
        x="7.5"
        y="13.5"
        width="2"
        height="3.5"
        className="fill-zinc-500 stroke-none dark:fill-zinc-400"
      />
      <rect
        x="11"
        y="10.5"
        width="2"
        height="6.5"
        className="fill-zinc-500 stroke-none dark:fill-zinc-400"
      />
      <rect
        x="14.5"
        y="7.5"
        width="2"
        height="9.5"
        className="fill-zinc-500 stroke-none dark:fill-zinc-400"
      />
    </svg>
  )
}

export function MediumPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Medium Priority"
    >
      <title>Medium Priority</title>
      <rect
        x="7.5"
        y="13.5"
        width="2"
        height="3.5"
        className="fill-zinc-500 stroke-none dark:fill-zinc-400"
      />
      <rect
        x="11"
        y="10.5"
        width="2"
        height="6.5"
        className="fill-zinc-500 stroke-none dark:fill-zinc-400"
      />
      <rect
        x="14.5"
        y="7.5"
        width="2"
        height="9.5"
        className="fill-zinc-200 stroke-none dark:fill-zinc-700"
      />
    </svg>
  )
}

export function LowPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Low Priority"
    >
      <title>Low Priority</title>
      <rect
        x="7.5"
        y="13.5"
        width="2"
        height="3.5"
        className="fill-zinc-500 stroke-none dark:fill-zinc-400"
      />
      <rect
        x="11"
        y="10.5"
        width="2"
        height="6.5"
        className="fill-zinc-200 stroke-none dark:fill-zinc-700"
      />
      <rect
        x="14.5"
        y="7.5"
        width="2"
        height="9.5"
        className="fill-zinc-200 stroke-none dark:fill-zinc-700"
      />
    </svg>
  )
}
