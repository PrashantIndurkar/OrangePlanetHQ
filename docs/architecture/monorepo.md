# OrangePlanetHQ — Monorepo Strategy

This document outlines the structural rules for the OrangePlanetHQ monorepo, which uses pnpm workspaces and Turborepo.

## 1. Workspace Map

The repository is strictly divided into `apps/` (deployable services) and `packages/` (reusable, internal dependencies).

```
OrangePlanetHQ/
├── apps/
│   ├── web/               # Next.js SPA (port 3000)
│   └── api/               # Express + tRPC API (port 4000)
├── packages/
│   ├── ui/                # Shared React components (shadcn/Radix)
│   ├── shared/            # Shared TS types, Zod schemas, constants
│   ├── editor/            # Tiptap + Yjs wrapper and extensions
│   ├── realtime/          # Mediasoup + WebSocket utility wrapper
│   └── config/            # Centralized tooling configuration
└── package.json           # Root workspace definitions
```

## 2. Centralized Configuration (`packages/config`)

To prevent style drift and configuration chaos, all tooling configurations are centralized. **Do not create independent configurations inside `apps/` or other `packages/`**.

- **ESLint/Biome:** Defined in `packages/config/eslint` and `packages/config/biome`.
- **TypeScript:** Base `tsconfig.json` lives in `packages/config/typescript`.
- **Tailwind:** Centralized design tokens live in `packages/config/tailwind`.

**Usage Example:**
An app's `tsconfig.json` simply extends the centralized config:
```json
{
  "extends": "@orangeplanet/config/typescript/next.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

## 3. Package Boundaries & Rules

1. **`packages/ui` (Campsite Model):**
   - Must contain only UI presentation components.
   - Cannot fetch data, cannot import from `@orangeplanet/shared` (unless for generic enums), and cannot know about tRPC or Drizzle.
   - Organized as a directory per component (e.g., `Button/index.tsx`, `Button/Button.tsx`).
   
2. **`packages/shared`:**
   - Contains code that must execute in both Node.js (backend) and Browser (frontend).
   - Validation schemas (Zod).
   - Global enums and constants (e.g., Plan limits, Role names).
   - **Rule:** This package must have zero dependencies on Node.js-only or DOM-only APIs.

3. **When to create a new app?**
   - Only create a new app if it has a fundamentally different runtime or deployment target (e.g., a Desktop Electron wrapper, or a static marketing site).
   - Do NOT split the core workspace into micro-frontends.

4. **When to create a new package?**
   - Create a new package when a distinct set of logic needs to be shared across two or more apps.
   - Examples: If we build an admin panel (`apps/admin`), we would move core logic out of `apps/api` into a shared package. Until then, keep domain logic inside `apps/api`.

## 4. Turborepo Pipelines

Turborepo handles execution caching and task dependency graphs. Defined in `turbo.json`.

| Task | Pipeline Rule | Caching |
|---|---|---|
| `build` | `^build` (depends on dependencies' build task) | ✅ Yes |
| `test` | Depends on `build` | ✅ Yes |
| `lint` | No dependencies | ✅ Yes |
| `dev` | Persistent execution, no caching | ❌ No |

**Running Tasks:**
Always run tasks from the root to leverage caching:
```bash
# Good
pnpm run build --filter web

# Bad
cd apps/web && pnpm run build
```
