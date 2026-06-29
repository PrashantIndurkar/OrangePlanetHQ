# OrangePlanetHQ — Frontend Architecture & State Management

This document defines the frontend architecture for the OrangePlanet Next.js application (`apps/web`). It outlines our rendering model, tRPC hydration boundaries, and state management rules (URL Search Params vs. Zustand vs. TanStack Query).

---

## 1. Directory Structure

We use a **Domain-First, Feature-Sliced Design** (Option A). The Next.js App Router only handles layouts, page routing, and query parameters. All dynamic business logic lives in self-contained feature folders.

```
apps/web/src/
├── app/                      # App Router (layouts, routing, page shells)
│   ├── (auth)/               # Login/Signup pages
│   └── (workspace)/          # Core workspace navigation & shells
│       └── [orgSlug]/
│           ├── layout.tsx    # Fetches layout metadata (Server Component)
│           └── issues/
│               └── page.tsx  # Dynamic dashboard shell
├── features/                 # Bounded contexts (Option A)
│   ├── issues/               # Issue feature (components, hooks, local state)
│   ├── chat/                 # Chat feature
│   └── docs/                 # Notion-style docs feature
├── hooks/                    # Global, non-feature specific hooks
├── lib/                      # Centralized helper modules (tRPC clients, auth)
└── store/                    # Global Zustand stores (local UI state only)
```

---

## 2. Server-Side Hydration Flow (tRPC Server Caller)

To prevent visual layout shifts (CLS), page flickering, and duplicate client-side requests, all initial page layout data is fetched server-side using a **tRPC Server Caller** and hydrated into the client query cache.

```
[Server Component] ──(Queries DB directly / tRPC Caller)──> [Pre-populates Query Cache]
                                                                     │
                                                                     ▼
[Hydration Boundary] ──(Passes cached state to client)─────> [Client-Side Mount]
                                                                     │
                                                                     ▼
[Client Query Hook] <──(Reads instantly from cache - no fetch)───── [React UI Render]
```

### Server Component Layout Example
```typescript
// apps/web/src/app/(workspace)/[orgSlug]/layout.tsx
import { HydrateClient, trpcServer } from '@/lib/trpc/server';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';

interface LayoutProps {
  children: React.ReactNode;
  params: { orgSlug: string };
}

export default async function OrgLayout({ children, params }: LayoutProps) {
  // Pre-fetch workspace metadata server-side directly into tRPC cache
  await trpcServer.org.getMetadata.prefetch({ slug: params.orgSlug });

  return (
    <HydrateClient>
      <WorkspaceShell orgSlug={params.orgSlug}>
        {children}
      </WorkspaceShell>
    </HydrateClient>
  );
}
```

---

## 3. URL-as-State Pattern (Shareable State)

All UI state that is **shareable**, **bookmarkable**, or affects the data-view filters must be stored directly in the browser's URL search parameters. **Never store this data in a global state manager (like Zustand) or a local React `useState`.**

### Standardized URL Keys

| State Variable | Parameter Key | Example URL |
|---|---|---|
| **Issue Status** | `status` | `/issues?status=todo` |
| **Search Query** | `q` | `/issues?q=navbar` |
| **Assignee** | `assignee` | `/issues?assignee=john_doe` |
| **Sorting** | `sort` | `/issues?sort=priority_desc` |
| **Active Project** | `project` | `/issues?project=mobile-app` |
| **Pagination** | `page` | `/issues?page=2` |

### Client-Side Hook Consumption
Use Next.js navigation hooks (or wrappers like `use-query-state`) to keep filters in sync:
```typescript
// apps/web/src/features/issues/hooks/use-issue-filters.ts
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useIssueFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get('status') || 'all';

  const setStatus = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', newStatus);
    router.push(`${pathname}?${params.toString()}`);
  };

  return { status, setStatus };
}
```

---

## 4. Zustand State Management Rules (Local UI State Only)

Zustand is used strictly for **transient, local-only UI state** that does not make sense to share via a URL link or cache on the server.

### Approved Zustand Store Cases
- **Workspace Sidebar:** Expanded/collapsed state.
- **Modals & Dialogs:** Open/closed flags (e.g. `isNewIssueModalOpen`).
- **Command Palette:** Cmd+K window toggle states.
- **Chat Draft Buffer:** Temporarily saving text input as the user navigates between channels before hitting send.
- **Video Call Session:** Active WebRTC connection states, audio tracks, and local stream settings.

### Store Example
```typescript
// apps/web/src/store/use-ui-store.ts
import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  chatDrafts: Record<string, string>; // channelId -> message draft
  setChatDraft: (channelId: string, draft: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  chatDrafts: {},
  setChatDraft: (channelId, draft) => 
    set((state) => ({
      chatDrafts: { ...state.chatDrafts, [channelId]: draft }
    })),
}));
```

---

## 5. Client Caching & Invalidation (TanStack Query)

Upon completing a mutation (e.g., updating an issue or sending a message), the frontend must explicitly trigger a cache invalidation to keep the UI in sync without doing full page refreshes.

```typescript
// apps/web/src/features/issues/components/EditIssueModal.tsx
import { trpc } from '@/lib/trpc/client';

export function EditIssueModal() {
  const utils = trpc.useUtils();

  const updateIssue = trpc.issues.update.useMutation({
    onSuccess: (updatedIssue) => {
      // Invalidate the cache for list queries to trigger refetch
      utils.issues.list.invalidate();
      
      // Manually set cache for the individual issue query (instant update)
      utils.issues.get.setData({ id: updatedIssue.id }, updatedIssue);
    }
  });
}
```
