# OrangePlanetHQ — Coding Standards & Guidelines

This document establishes the coding conventions, quality standards, and TypeScript constraints for all developers and AI assistants working in the OrangePlanetHQ monorepo.

---

## 1. TypeScript Strictness Rules

We enforce maximum type safety across the entire codebase to prevent runtime exceptions and support automatic tRPC client type generation.

1. **No `any` or `unknown` casts:** Use explicit type definitions. If a type cannot be determined, write a strict interface or Zod validation schema rather than resorting to `any`.
2. **Strict Null Checks:** Always verify variables are defined before accessing properties. Prefer optional chaining (`user?.name`) or early return statements:
   ```typescript
   if (!user) return null;
   ```
3. **No Type Assertions (`as`):** Avoid casting types unless parsing raw API buffers or working with external libraries that do not export TypeScript types. Rely on TypeScript type inference.
4. **Use Declared Return Types:** Explicitly define the return type of all functions and API controllers. This makes the code self-documenting and speeds up compiler check times.

---

## 2. Naming Conventions

Maintain strict name capitalization across all workspace files:

| Entity | Style | Case | Example |
|---|---|---|---|
| **Files & Folders** | Kebab Case | `kebab-case` | `create-issue-modal.tsx` |
| **Component Folders** | Pascal Case | `PascalCase` | `packages/ui/src/components/Button/` |
| **React Components** | Pascal Case | `PascalCase` | `export function TaskCard() {}` |
| **Functions & Variables** | Camel Case | `camelCase` | `const issueNumber = 24;` |
| **Classes & Types** | Pascal Case | `PascalCase` | `interface UserSession {}` |
| **Database Tables** | Snake Case | `snake_case` | `organization_memberships` |
| **Enums & Constants** | Upper Snake | `UPPER_SNAKE` | `export const MAX_FILE_SIZE = 100;` |

---

## 3. Monorepo Import & Aliases Standards

Imports must be clean, absolute, and respect workspace boundaries to prevent circular dependencies.

- **Frontend Path Aliases:** Always use absolute aliases (`@/`) when importing files inside the same application:
  - **Correct:** `import { useUIStore } from '@/store/use-ui-store'`
  - **Incorrect:** `import { useUIStore } from '../../../store/use-ui-store'`
- **Design System Imports:** External apps must import shared UI components via the package entrypoint:
  - **Correct:** `import { Button } from '@orangeplanet/ui'`
  - **Incorrect:** `import { Button } from '../../../../packages/ui/src/components/Button'`
- **Shared Types:** Share Zod validation schemas and general TS contracts via `@orangeplanet/shared`.
- **No Unused Imports:** Keep imports clean. Biome / ESLint will fail builds if unused imports are committed.

---

## 4. React Components & Hooks Standards

To maintain clean and readable frontend code:

1. **Custom Hook Co-location:** Feature-specific custom hooks (like filter states or mutations wrappers) must live inside the feature's `hooks/` directory. They cannot be defined inline in the UI component file.
2. **No Inline Fetching:** Components must never run inline fetching logic. Data must be read using tRPC query hooks (`trpc.feature.action.useQuery()`) to ensure proper query hydration and caching.
3. **Snappy Visual States:** Ensure all component interactions use snappier, spring-based transitions (stiffness `100-150ms` as specified in `design-system.md`).

---

## 5. Backend API & Async Standards

To keep the Express + tRPC hybrid API predictable and maintainable:

1. **Async / Await Standard:** Always use `async/await` syntax for asynchronous operations and database transactions. Raw `.then().catch()` chains are forbidden.
2. **Error Boundaries:** Never return raw database exceptions. All unexpected errors must be caught, logged, and mapped to standard tRPC errors:
   ```typescript
   throw new TRPCError({ 
     code: 'INTERNAL_SERVER_ERROR', 
     message: 'An unexpected database error occurred.' 
   });
   ```

---

## 6. Styling Standard (The Sharp Edge Directive)

All CSS styles and Tailwind configurations must align with **[`apps/web/app/globals.css`](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/app/globals.css)**:
1. **Perfect Square Corners:** You must use `rounded-none` or ensure radius variables resolve to `0`. No rounded corners.
2. **No Custom Pixel Brackets:** Always map spacing and sizes to standard Tailwind values (`p-4` or `p-4.5` instead of `p-[17px]`).
3. **Use Semantic Tokens:** Always use semantic classes (`bg-bg-main`, `text-text-primary`, `border-border-primary`) instead of raw hex values to support automatic light/dark mode inversion.

---

## 7. Tooling, Linting & Formatting

OrangePlanet uses **Biome** for formatting and **ESLint** for semantic rules.
- Run `pnpm run lint` from the root before committing code.
- Ensure your editor has Auto-Format on Save enabled using the Biome extension. Do not commit code with formatting changes.
- Warnings should be resolved, and errors will block the build.
