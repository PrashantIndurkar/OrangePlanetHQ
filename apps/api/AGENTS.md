# OrangePlanet — API App Operational Rules (apps/api)

> **CRITICAL: READ BEFORE WORKING IN THIS APP**
> This file contains the strict rules for all AI coding agents modifying backend files inside `apps/api`.

## 1. Scope & Architecture
`apps/api` is the Express + tRPC Node.js backend. It interfaces with the PostgreSQL database via Drizzle ORM.

## 2. API Framework Boundaries
- **tRPC for UI Queries:** All frontend client-server transactions must use **tRPC Procedures**. Do not create REST endpoints for Next.js UI features.
- **Express for Webhooks/API:** Keep Express routing restricted strictly to incoming external webhooks (e.g. GitHub/Slack callbacks) and public REST endpoints.

## 3. Database & Identity Rules
- **Drizzle Only:** You are prohibited from importing or writing Prisma code.
- **UUIDv7 Primary Keys:** Every table primary key must be a UUIDv7 generated on insert.
- **Internal UUIDs:** Database primary keys (`id`) must remain strictly internal. Never expose UUIDs in client URLs or routing paths. Use scoped human-readable `identifier` fields (`PLO-24`) or unique `slug` strings.
- **Atomic Counters:** Issue identifiers must be generated within an atomic database transaction that reads and increments the organization's `nextIssueNumber` counter.

## 4. Multi-Tenancy & Auth
- **Procedure Boundaries:** Verify organization memberships inside tRPC custom middlewares (`orgProcedure`). Context headers (like `x-organization-slug`) should be read automatically by the contextual builder.
- **WS Cookie Upgrades:** Authenticate WebSockets during the HTTP handshake using standard Better Auth session cookies. Only fall back to URL query tokens if cookies are disabled by the client (CLI/mobile app).

## 5. Use-Case Action Pattern
Keep tRPC router procedure files thin. Extract complex database mutations, transactional sequences, and third-party events (sending emails, publishing socket broadcasts) into dedicated **Action files** inside `src/services/` or `src/actions/`.
