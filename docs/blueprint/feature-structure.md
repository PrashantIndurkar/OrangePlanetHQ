# OrangePlanetHQ — Feature Structure Blueprint

This blueprint defines the canonical file and folder structure for adding a new feature or domain module to the OrangePlanet monorepo. Every feature must follow this specification to guarantee consistency, testability, and isolated domains.

---

## 1. Shared UI Components (`packages/ui`)

Shared, stateless UI components (like buttons, dialogs, avatars) live in the shared design system. They must be completely isolated from data fetching, router logic, and API calls.

### Folder Structure
Each component has its own dedicated directory:
```
packages/ui/
└── src/
    └── components/
        └── Button/
            ├── Button.tsx            # Main component implementation
            ├── Button.stories.tsx    # Storybook visual tests (MANDATORY)
            ├── Button.test.tsx       # Component unit tests (Vitest)
            ├── Button.types.ts       # Type definitions
            └── index.ts              # Component export entry point
```

### Storybook Rule (Mandatory)
Every component added to `packages/ui` must have a corresponding `.stories.tsx` file covering its primary interactive states (e.g., `Default`, `Loading`, `Disabled`, `Variants`).

---

## 2. Frontend Feature Structure (`apps/web`)

We use **Feature-Sliced Design (Option A: Domain-First)**. Bounded features live in `src/features/{feature-name}/` and expose their public API through a barrel export (`index.ts`).

### Folder Structure
```
apps/web/src/features/issues/
├── components/                       # Feature-specific UI components
│   ├── IssueList.tsx
│   └── IssueCard.tsx
├── hooks/                            # React hooks specific to this feature
│   └── use-issue-filters.ts
├── api/                              # Client-side tRPC endpoints & cache queries
│   └── queries.ts
├── types.ts                          # Types specific to this feature
└── index.ts                          # Feature public entrypoint (Exports list)
```

### App Routing Integration
The Next.js App Router (`src/app/`) must remain extremely thin, handling only page layout, query parameters, and importing the feature dashboard component.
```typescript
// apps/web/src/app/(workspace)/issues/page.tsx
import { IssueDashboard } from '@/features/issues';

export default function IssuesPage() {
  return <IssueDashboard />;
}
```

### Encapsulation Rules
1. **No Deep Imports:** A file outside `features/issues` must never import directly from a nested folder.
   - **Incorrect:** `import { IssueCard } from '@/features/issues/components/IssueCard'`
   - **Correct:** `import { IssueCard } from '@/features/issues'`
2. **Barrel Exports:** The `index.ts` file must explicitly export only what is necessary for other features or routing to consume.
3. **Cross-Feature Imports:** If Feature A needs to render a component from Feature B, it must import it through Feature B's `index.ts` entrypoint.

---

## 3. Backend Module Structure (`apps/api`)

Backend features are organized around Express REST routing (for external integration/webhooks) and tRPC routers (for internal client-server requests).

### Folder Structure
```
apps/api/src/
├── trpc/
│   └── routers/
│       └── issues.ts                 # tRPC procedures (queries/mutations)
├── modules/
│   └── webhooks/
│       └── github.ts                 # Express REST endpoint (webhook)
└── db/
    └── schema/
        └── issues.ts                 # Drizzle pg-core schema definition
```

### Database Schema Definition
Export table schemas and Zod validation types from the Drizzle schema file:
```typescript
// apps/api/src/db/schema/issues.ts
import { pgTable, uuid, varchar, integer, text } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey(), // Generated via uuidv7 helper in application code
  organizationId: uuid('organization_id').notNull(),
  number: integer('number').notNull(),
  identifier: varchar('identifier', { length: 32 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull(),
  title: text('title').notNull(),
});

export const selectIssueSchema = createSelectSchema(issues);
export const insertIssueSchema = createInsertSchema(issues);
```

### tRPC Router Implementation
Always validate inputs, execute atomic workspace counter updates, and authorize session membership before querying the database:
```typescript
// apps/api/src/trpc/routers/issues.ts
import { router, protectedProcedure } from '../trpc';
import { insertIssueSchema, issues } from '../../db/schema/issues';
import { organizations } from '../../db/schema/organizations';
import { eq, sql } from 'drizzle-orm';
import { uuidv7 } from '../../utils/uuid'; // Custom uuidv7 generator

export const issuesRouter = router({
  create: protectedProcedure
    .input(insertIssueSchema.omit({ id: true, number: true, identifier: true }))
    .mutation(async ({ ctx, input }) => {
      // 1. Run inside a transaction to ensure atomic increment of organization issue counter
      return await ctx.db.transaction(async (tx) => {
        // 2. Fetch and increment organization counter
        const [org] = await tx
          .update(organizations)
          .set({ nextIssueNumber: sql`${organizations.nextIssueNumber} + 1` })
          .where(eq(organizations.id, ctx.session.organizationId))
          .returning({ 
            key: organizations.key, 
            currentNumber: organizations.nextIssueNumber 
          });

        const issueNumber = org.currentNumber;
        const identifier = `${org.key}-${issueNumber}`;
        const issueId = uuidv7();

        // 3. Insert new issue
        const [newIssue] = await tx
          .insert(issues)
          .values({
            ...input,
            id: issueId,
            organizationId: ctx.session.organizationId,
            number: issueNumber,
            identifier,
          })
          .returning();

        return newIssue;
      });
    }),
});
```
