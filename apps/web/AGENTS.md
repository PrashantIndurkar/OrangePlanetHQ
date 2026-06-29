# OrangePlanet — Web App Operational Rules (apps/web)

> **CRITICAL: READ BEFORE WORKING IN THIS APP**
> This file contains the strict rules for all AI coding agents modifying frontend files inside `apps/web`.

## 1. Scope & Architecture
`apps/web` is the Next.js App Router workspace shell. It connects our UI components to tRPC procedures.

## 2. Directory & Import Boundaries
- **Feature-Sliced Design:** All business logic components, query hooks, and domain helpers must live in `src/features/{domain}/` (e.g., `src/features/issues/`).
- **Encapsulation:** Never write deep imports to nested feature folders. You must only import via the feature’s `index.ts` barrel file:
  - **Good:** `import { IssueCard } from '@/features/issues';`
  - **Bad:** `import { IssueCard } from '@/features/issues/components/IssueCard';`
- **Presentation Components:** Do not create shared, stateless UI components (like buttons or text inputs) here. Put them in `packages/ui`.

## 3. State Management Rules
- **Server Data Caching:** Use TanStack Query (via the tRPC client hooks wrapper) for all server state.
- **URL-as-State:** All view filters (status, search string, sort orientation, active assignee) must live in the browser's URL search parameters.
- **Zustand Limits:** Only use Zustand stores for transient local-only UI state (active drafts, sidebar collapse toggle, open modals, active call sessions).

## 4. Pre-Hydration Rule
- Fetch layout and metadata parameters server-side in Next.js Server Components using the **tRPC Server Caller** (`trpcServer.query()`), and wrap the client mount using `<HydrateClient>` to eliminate rendering flicker.
