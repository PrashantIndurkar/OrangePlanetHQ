# Feature Learning Documentation Generator

## Goal

After completing **every feature**, your job is **not finished**.

Your second responsibility is to generate learning documentation that teaches **how and why** the feature was built.

Assume I am a junior engineer learning from this project.

The documentation should allow me to revisit this feature months later and fully understand the implementation without reading the source code.

---

## Output Location

```
learn/
└── features/
    └── <feature-group>/
        └── <feature-id>-<feature-name>.md
```

Examples:

```
learn/features/issues/001-create-issue.md
learn/features/issues/002-issue-comments.md
learn/features/chat/001-send-message.md
learn/features/chat/002-message-reactions.md
learn/features/notifications/001-real-time-notifications.md
```

If the folder does not exist, create it.

Never overwrite previous feature documentation.

Each feature gets its own markdown file.

---

## Writing Style

* Explain everything assuming I am learning.
* Use simple English.
* Avoid unnecessary theory.
* Focus on THIS project's implementation.
* Use diagrams whenever possible.
* Keep explanations practical.

---

## Documentation Structure

Every feature document MUST contain the following sections.

# Feature Overview

* What we built
* Why we built it
* User problem it solves

---

# Requirements

Summarize the original requirements.

---

# Final Architecture

Explain the complete architecture.

Include simple diagrams.

Example

User

↓

UI

↓

tRPC

↓

Use Case

↓

Repository

↓

Drizzle

↓

Postgres

---

# Step-by-Step Implementation

Document the implementation in chronological order.

Example

Step 1

Created database schema.

Why?

Step 2

Created validation.

Why?

Step 3

Created backend procedure.

Why?

Step 4

Connected frontend.

Why?

Step 5

Added cache invalidation.

Why?

Each step should explain

* What was done
* Why it was necessary
* What problem it solved

---

# Technologies Used

List every technology used.

For each technology explain ONLY:

* How it was used in THIS feature
* Why we used it
* What would happen if we removed it

Do NOT explain the entire technology.

Focus only on this feature.

Example

## Zod

Used to validate comment creation input.

Without it, invalid data could reach the backend.

---

# Important Files

List every important file.

For every file explain

* Purpose
* Why it exists
* What happens if deleted

---

# Data Flow

Explain the complete request lifecycle.

Use diagrams.

---

# Architecture Decisions

Explain every important decision.

Examples

Why tRPC instead of REST?

Why optimistic updates?

Why transaction?

Why Server Component?

Why Client Component?

Why cache invalidation?

Why this folder structure?

Always explain

* Decision
* Alternatives
* Why this approach was selected

---

# Alternative Solutions

For every major implementation decision explain at least one alternative.

Example

Current

Optimistic Updates

Alternative

Reload after mutation

Pros

Cons

Why we selected the current approach.

---

# Common Mistakes

List common implementation mistakes.

Explain how to avoid them.

---

# Interview Questions

Generate 5–10 interview questions related to this feature.

Include short expected answers.

---

# Key Takeaways

Summarize the most important concepts.

---

# Mini Challenge

Give me one exercise to rebuild this feature myself without AI.

---

## Rules

* Keep everything feature-specific.
* Never duplicate previous feature docs.
* Never create huge technology documentation.
* Keep explanations concise but complete.
* Always explain WHY, not only WHAT.
* Document every architectural decision made during implementation.
* If multiple technologies are used, explain how each contributed to this feature.
* Write documentation that I can use months later to quickly relearn the feature.

The final document should read like an internal engineering case study combined with a learning guide.
