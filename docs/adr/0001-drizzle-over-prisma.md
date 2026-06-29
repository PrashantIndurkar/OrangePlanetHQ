# ADR 0001: Drizzle ORM over Prisma

* **Status:** Proposed
* **Date:** 2026-06-28
* **Authors:** Antigravity Workflow Architect

---

## 1. Context

OrangePlanetHQ originally initialized with an Express backend using Prisma ORM. While Prisma has excellent DX for database schema migrations, it introduces several limitations:
1. **High Cold-Start Overhead:** Prisma runs an internal rust query engine binary, which increases memory usage and introduces startup lag in serverless or budget hosting environments.
2. **Weak TypeScript Inference:** Prisma relies on a pre-generated client. It struggles to infer fine-grained SQL selections or database joins cleanly into TypeScript types without extensive boilerplate.
3. **No Batching Support:** Prisma does not naturally support type-safe SQL batching or complex transaction locks (like our atomic issue counter updates).

---

## 2. Decision

We will migrate the entire database access layer of OrangePlanetHQ from **Prisma** to **Drizzle ORM**.

- We will utilize PostgreSQL with the `drizzle-orm/pg-core` driver.
- We will organize schema files in domain-specific splits (`apps/api/src/db/schema/`).
- We will use Drizzle-Kit for generating migrations and local schemas checks.

---

## 3. Rationale & Trade-offs

### Pros
- **Pure TypeScript:** Drizzle is write-as-you-query. The return types of all queries are automatically inferred, matching our tRPC E2E type-safety standards perfectly.
- **Index Performance:** Drizzle allows us to write raw SQL fragments easily (`sql` helper), which is required to write atomic issue counter increment updates:
  ```typescript
  set({ nextIssueNumber: sql`${organizations.nextIssueNumber} + 1` })
  ```
- **Lightweight:** No heavy binary engines. It is just a lightweight SQL query generator wrapper.

### Cons
- **Manual Migrations:** Unlike Prisma which does auto-migration runs easily on dev, Drizzle requires generating SQL migration files (`db:generate`) and manually running them. We accept this small DX trade-off for the massive type-safety benefits.
