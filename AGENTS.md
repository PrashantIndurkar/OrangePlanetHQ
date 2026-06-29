# OrangePlanetHQ — AI Operations Manual

> **CRITICAL: READ THIS BEFORE BEGINNING ANY TASK**
> This file contains the repository-specific rules for all AI coding agents working in the OrangePlanetHQ workspace.

## 1. Project Overview & Identity
**OrangePlanet** is an all-in-one workspace platform for engineering teams combining issue tracking (Linear-style), team chat (Slack-style), collaborative docs (Notion-style), and video calls (native WebRTC).

- **Architecture:** Monorepo (Turborepo + pnpm)
- **Frontend:** Next.js (App Router), Zustand, TanStack Query, TailwindCSS v4, shadcn/Radix UI
- **Backend:** Node.js ≥22, Express 5 + tRPC Hybrid, Drizzle ORM, PostgreSQL
- **Realtime:** Native WebSocket + Mediasoup (SFU)
- **Reference Codebase:** Always refer to **Campsite** (`../campsite/`) for data models, components, and general architecture, and **Sharkord** (`../sharkord/`) for real-time chat/WebRTC patterns.

## 2. Monorepo Map
```
OrangePlanetHQ/
├── apps/
│   ├── web/               # Next.js SPA (Workspace shell, routing, UI)
│   └── api/               # Express + tRPC API, WebSocket server, WebRTC
├── packages/
│   ├── ui/                # Campsite-style component library (directory-per-component)
│   ├── shared/            # Shared types, Zod schemas, constants (tRPC bounds)
│   └── config/            # Shared ESLint, TSConfig, Prettier, Tailwind
├── docs/                  # Architecture, ADRs, Decision Framework, Standards
└── AGENTS.md              # Global AI rules (this file)
```
*(Nested `AGENTS.md` files in `apps/web/`, `apps/api/`, and `packages/ui/` contain domain-specific rules. Read them when working in those scopes.)*

## 3. Workflow & Decision Rules (MANDATORY)

You must act as a **Workflow Architect** and use specialized personas.
**The 6-Phase Rule:** Before making any large structural change, introducing a new pattern, or building a significant feature (e.g., auth, realtime, chat, DB schema change):
1. **Audit:** Inspect repo state.
2. **Clarify:** Ask only high-value questions affecting boundaries.
3. **Options & Trade-offs:** ALWAYS present 3-4 industry-standard alternatives.
4. **ADR:** If significant, write an ADR to `docs/adr/`.
5. **Implement/Plan:** Generate code/plans *only after user approval*.
6. **Review:** Run a strict review pass (e.g., Architect, Scalability Engineer).

**Reference:** `docs/decision-framework.md` contains the full 7-persona framework. **Use it.**

## 4. Commands & Tooling

| Task | Command | Run Location |
|---|---|---|
| Install Deps | `pnpm install` | Root |
| Dev Server | `pnpm run dev` | Root |
| Build | `pnpm run build` | Root |
| Lint | `pnpm run lint` | Root |
| Typecheck | `pnpm run check-types` (or `tsc --noEmit`) | Root |
| Database | `pnpm run db:push` or `db:generate` | `apps/api` |

## 5. Code Style & Conventions

- **TypeScript Only:** `strict: true`, no `any`.
- **Formatting:** Biome/Prettier is used. Do not argue with the formatter.
- **Imports:** Absolute imports (`@/components/...`) over relative paths where configured.
- **Naming:** 
  - `camelCase` for variables/functions.
  - `PascalCase` for React components and Classes.
  - `kebab-case` for file names and directories (unless it's a React component directory in `packages/ui/` which uses `PascalCase`).
- **State:** Server state via `TanStack Query` or `tRPC`. Client state via `Zustand`. Avoid React `useState` for global concerns.
- **API:** Internal Next.js ↔ API communication uses **tRPC**. External integrations use Express REST endpoints.

## 6. Testing Expectations
- **Unit/Integration:** `Vitest` for backend logic, hooks, and utilities.
- **E2E:** `Playwright` for critical user flows (Auth, Workspace creation, Chat).
- **Rule:** If you add a complex use-case or service, you must add the corresponding test.

## 7. Context Recovery
If you lose context or start a new session:
1. Read `docs/product-spec.md` for the core product vision.
2. Read `docs/decision-framework.md` for how to talk to the user.
3. Read `docs/architecture/overview.md` for system design.
4. Check `task.md` or `docs/session-log.md` for the current progress state.

## 8. Safe Edit Boundaries
- Do not introduce Prisma (We use **Drizzle**).
- Do not introduce third-party realtime services like Pusher or Twilio (We use **ws** and **Mediasoup**).
- Do not build micro-frontends (We use a **Single Next.js App**).
- Do not build a multi-repo (We use a **Single Monorepo**).
- Do not write standard REST controllers for internal UI consumption (We use **tRPC**).
