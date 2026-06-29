# OrangePlanetHQ — Database Architecture & Drizzle Conventions

This document defines the database architecture, schema conventions, indexing strategies, and migration lifecycle for OrangePlanetHQ using PostgreSQL and Drizzle ORM.

---

## 1. Directory Structure

All database schemas, migrations, and seeding scripts live inside `apps/api` to maintain a clean boundary between the backend engine and shared configurations.

```
apps/api/src/db/
├── index.ts                  # Database client initialization (node-postgres)
├── schema/                   # Domain-split Drizzle schemas (Option B)
│   ├── index.ts              # Schema barrel export
│   ├── users.ts
│   ├── organizations.ts      # Workspace & memberships
│   ├── issues.ts             # Tasks & Linear projects
│   ├── channels.ts           # Slack channels & messages
│   └── docs.ts               # Notion documents
└── migrations/               # Drizzle-Kit generated SQL migration files
```

---

## 2. Key Conventions

### Database Identity (UUIDv7)
Every database table must use **UUIDv7** as its primary key. UUIDv7 embeds a millisecond-precision timestamp, ensuring sequential inserts (avoiding B-Tree page splits and fragmentation in PostgreSQL) while remaining globally unique.

Drizzle schema standard definition:
```typescript
import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey(), // Generated on the application side on insert
  // ...
});
```

### Human-Facing Identifiers
User-facing resources must expose separate string identifiers (e.g., `PLO-24`) generated via workspace counters, rather than UUIDs. Refer to `docs/architecture/domain-map.md` for details.

---

## 3. Multi-Tenancy & Indexing Strategy

In a multi-tenant SaaS application, almost all queries filter by `organizationId`. Correct indexing is critical to maintain performance as data grows.

### Index Rules
1. **Single-Column Tenant Index:** Every table containing user-generated content must have an index on `organization_id` to speed up organization-wide reads.
2. **Compound Query Indexes:** Create compound indexes for hot query paths, combining the tenant identifier with status or sort parameters:
   - Index: `(organization_id, status)` for dashboard filters.
   - Index: `(organization_id, created_at)` for chat messages chronological feeds.
3. **Foreign Key Indexes:** PostgreSQL does not automatically index foreign keys. You must explicitly declare indexes on all reference fields (e.g., `assignee_id`, `project_id`) to prevent table scans on joins.

Drizzle Index Example:
```typescript
import { pgTable, uuid, index } from 'drizzle-orm/pg-core';

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey(),
  organizationId: uuid('organization_id').notNull(),
  status: varchar('status', { length: 32 }).notNull(),
}, (table) => [
  index('issues_org_idx').on(table.organizationId),
  index('issues_org_status_idx').on(table.organizationId, table.status)
]);
```

---

## 4. Soft Delete Patterns & Cascade Rules

To preserve audit trails and prevent accidental data loss, OrangePlanet uses **Soft Deletes** instead of hard SQL `DELETE` calls.

### Schema Fields
Every soft-deletable table must include a nullable timestamp:
```typescript
import { timestamp } from 'drizzle-orm/pg-core';

deletedAt: timestamp('deleted_at', { withTimezone: true })
```

### Parent-Child Cascades (Implicit Filters)
When a parent resource is soft-deleted (e.g. deleting a `Project` or a `Channel`), we do not update thousands of child rows (`Issues` or `Messages`) to set `deletedAt`. Instead, we use **implicit queries**:

1. **Write Action:** Set `deletedAt = now()` on the parent row.
2. **Read Action:** When querying child items, perform a relational join to verify the parent is active:
```typescript
// Querying active issues under active projects
const activeIssues = await db
  .select()
  .from(issues)
  .leftJoin(projects, eq(issues.projectId, projects.id))
  .where(
    and(
      eq(issues.organizationId, orgId),
      isNull(issues.deletedAt),
      // Child is only active if it has no project, or if the project itself is not deleted
      or(
        isNull(issues.projectId),
        isNull(projects.deletedAt)
      )
    )
  );
```
*Why this design?* If a user restores/undeletes the parent `Project`, all its child issues instantly become active again without complex database mutations.

---

## 5. Migration Lifecycle

We use **Drizzle-Kit** to manage database schemas.

### Workflow Actions
1. **Modify Schema:** Edit schema files in `src/db/schema/*.ts`.
2. **Generate Migration:** Run the migration generator from the workspace root:
   ```bash
   pnpm --filter api db:generate
   ```
3. **Review Migration:** Check the generated SQL file in `apps/api/src/db/migrations/` for correctness.
4. **Apply Migration:**
   - **Local Dev:** Apply directly via:
     ```bash
     pnpm --filter api db:push
     ```
   - **Production:** Run migrations during the container startup sequence using:
     ```bash
     pnpm --filter api db:migrate
     ```

### Seeding
Database seeding scripts live in `apps/api/src/db/seed.ts` and are run using `pnpm --filter api db:seed`. Seeds must generate default organizations, admin users, and initial project channels for local development testing.
