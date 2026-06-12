# Task Manager Monorepo Structure Guide

This document explains the recommended folder structure for a full-stack task management application built with **Next.js**, **Express/Node.js**, **PostgreSQL**, and **shadcn/ui**. It is written to help both human reviewers and AI coding tools quickly understand how the project is organized, why the structure was chosen, and what belongs in each part of the codebase.

The goal of this structure is not to look “enterprise” for the sake of it. The goal is to make the project easy to build now, easy to review in an interview, and easy to extend later with features like activity logs, attachments, Docker, CI, WebSockets, or admin access.

## Why this structure

This structure is based on common industry patterns used in real monorepos:

- A separate **frontend app** and **backend app**.
- Shared code moved into **packages** only when it is truly shared.
- Backend organized by **feature/module** instead of by technical layer only.
- Frontend organized by **route + feature** so pages stay easy to follow.
- UI components split into reusable primitives and feature-specific pieces.

This is inspired by how teams usually structure applications in Turborepo-style monorepos, modular Express services, and modern Next.js apps. The exact naming can vary between companies, but the boundaries are very common:

- `apps/web` → user-facing Next.js application.
- `apps/api` → REST API backend.
- `packages/*` → shared types, validation, configs, and optionally shared UI.

## High-level architecture

```text
Browser (Next.js app)
        ↓
   apps/web
        ↓ HTTP
   apps/api
        ↓
 PostgreSQL
```

The frontend is responsible for rendering pages, forms, tables, filters, and task interactions. The backend is responsible for authentication, authorization, validation, business rules, and database access.

This separation is useful for this assignment because the task explicitly asks for a REST API backend and a connected frontend. Keeping them separate makes that architecture visible and easier to explain.

## Recommended project tree

```text
task-manager/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ (auth)/
│  │  │  │  │  ├─ login/
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ signup/
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ (dashboard)/
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ tasks/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ new/
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ [taskId]/
│  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │     └─ edit/
│  │  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ loading.tsx
│  │  │  │  ├─ not-found.tsx
│  │  │  │  └─ globals.css
│  │  │  ├─ components/
│  │  │  │  ├─ ui/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ tasks/
│  │  │  │  └─ layout/
│  │  │  ├─ features/
│  │  │  │  ├─ auth/
│  │  │  │  │  ├─ api.ts
│  │  │  │  │  ├─ hooks.ts
│  │  │  │  │  ├─ schema.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  └─ tasks/
│  │  │  │     ├─ api.ts
│  │  │  │     ├─ hooks.ts
│  │  │  │     ├─ schema.ts
│  │  │  │     ├─ types.ts
│  │  │  │     └─ utils.ts
│  │  │  ├─ lib/
│  │  │  │  ├─ api/
│  │  │  │  │  ├─ client.ts
│  │  │  │  │  └─ errors.ts
│  │  │  │  ├─ auth/
│  │  │  │  │  ├─ session.ts
│  │  │  │  │  └─ guards.ts
│  │  │  │  ├─ env.ts
│  │  │  │  ├─ constants.ts
│  │  │  │  └─ utils.ts
│  │  │  ├─ providers/
│  │  │  │  ├─ query-provider.tsx
│  │  │  │  └─ theme-provider.tsx
│  │  │  ├─ middleware.ts
│  │  │  └─ tests/
│  │  ├─ public/
│  │  ├─ components.json
│  │  ├─ next.config.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  └─ api/
│     ├─ src/
│     │  ├─ server.ts
│     │  ├─ app.ts
│     │  ├─ config/
│     │  │  ├─ env.ts
│     │  │  ├─ db.ts
│     │  │  └─ logger.ts
│     │  ├─ db/
│     │  │  ├─ prisma/
│     │  │  │  └─ schema.prisma
│     │  │  ├─ migrations/
│     │  │  └─ seed.ts
│     │  ├─ middlewares/
│     │  │  ├─ auth.middleware.ts
│     │  │  ├─ error.middleware.ts
│     │  │  ├─ not-found.middleware.ts
│     │  │  └─ validate.middleware.ts
│     │  ├─ modules/
│     │  │  ├─ auth/
│     │  │  │  ├─ auth.routes.ts
│     │  │  │  ├─ auth.controller.ts
│     │  │  │  ├─ auth.service.ts
│     │  │  │  ├─ auth.repository.ts
│     │  │  │  ├─ auth.schema.ts
│     │  │  │  └─ auth.types.ts
│     │  │  ├─ users/
│     │  │  │  ├─ user.repository.ts
│     │  │  │  └─ user.types.ts
│     │  │  └─ tasks/
│     │  │     ├─ tasks.routes.ts
│     │  │     ├─ tasks.controller.ts
│     │  │     ├─ tasks.service.ts
│     │  │     ├─ tasks.repository.ts
│     │  │     ├─ tasks.schema.ts
│     │  │     ├─ tasks.types.ts
│     │  │     └─ tasks.mapper.ts
│     │  ├─ routes/
│     │  │  └─ index.ts
│     │  ├─ utils/
│     │  │  ├─ api-error.ts
│     │  │  ├─ async-handler.ts
│     │  │  ├─ pagination.ts
│     │  │  └─ response.ts
│     │  └─ tests/
│     ├─ package.json
│     └─ tsconfig.json
│
├─ packages/
│  ├─ shared-types/
│  │  ├─ src/
│  │  │  ├─ auth.ts
│  │  │  ├─ task.ts
│  │  │  └─ api.ts
│  │  └─ package.json
│  ├─ validation/
│  │  ├─ src/
│  │  │  ├─ auth.ts
│  │  │  └─ task.ts
│  │  └─ package.json
│  ├─ eslint-config/
│  ├─ typescript-config/
│  └─ ui/
│
├─ docker-compose.yml
├─ .env.example
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ README.md
```

## Core idea behind the structure

A good folder structure should answer three questions quickly:

1. Where does a page live?
2. Where does an API endpoint live?
3. Where does the real business logic live?

In this structure:

- Pages live in `apps/web/src/app`.
- Express endpoints live in `apps/api/src/modules/*/*.routes.ts`.
- Business logic lives in `service.ts` files.
- Database queries live in `repository.ts` files.
- Shared contracts live in `packages/shared-types` and `packages/validation`.

That separation makes the project easier to explain in an interview and easier to extend without creating accidental coupling.

## Why `apps/web` and `apps/api` are separate

A common beginner mistake is to mix everything into a single Next.js app and then put backend code in many places without a clear boundary. That can work for tiny projects, but for this assignment it makes things harder to reason about.

By separating the apps:

- the frontend stays focused on screens and interactions,
- the backend stays focused on auth, tasks, and database rules,
- tests become easier to write,
- deployment becomes clearer,
- and interviewers can immediately see the architecture.

This also reflects a real-world pattern used in many teams: separate the user interface from the API, even when they live in the same monorepo.

## Frontend structure (`apps/web`)

The frontend uses **Next.js App Router** and **shadcn/ui**.

### `src/app/`

This is the routing layer of the Next.js application.

Use it for:

- route folders,
- layouts,
- loading states,
- error boundaries,
- page-level data orchestration.

Examples:

- `app/(auth)/login/page.tsx` → login screen.
- `app/(dashboard)/tasks/page.tsx` → tasks list screen.
- `app/(dashboard)/tasks/[taskId]/edit/page.tsx` → edit task screen.

Keep pages relatively thin. A page should compose feature logic and UI, not contain every fetch call, schema, and mutation directly.

### Route groups: `(auth)` and `(dashboard)`

These folders are helpful because they group related routes without affecting the URL.

Examples:

- `(auth)` contains login/signup flows.
- `(dashboard)` contains authenticated application pages.

This makes the structure more readable and makes it easier to attach layouts for each area.

### `components/`

This folder contains React UI components.

Suggested split:

- `components/ui/` → shadcn-generated primitives like `button.tsx`, `dialog.tsx`, `input.tsx`, `table.tsx`.
- `components/auth/` → login form, signup form, password input.
- `components/tasks/` → task form, task table, task card, task filters, pagination controls.
- `components/layout/` → navbar, sidebar, header, theme toggle.

Examples:

- `components/ui/button.tsx` → shadcn button primitive.
- `components/tasks/task-form.tsx` → reusable create/edit task form.
- `components/tasks/task-list.tsx` → renders list or table of tasks.

A good rule: if something is clearly UI and reused across one or more pages, it belongs here.

### `features/`

This folder is for feature-specific frontend logic.

This is one of the most useful folders in a growing app because it prevents `lib/` from becoming a junk drawer.

Examples:

- `features/tasks/api.ts` → functions like `getTasks`, `createTask`, `updateTask`.
- `features/tasks/hooks.ts` → React Query hooks like `useTasks`, `useCreateTask`.
- `features/tasks/schema.ts` → client-side form validation for task fields.
- `features/tasks/types.ts` → local feature types when needed.

What belongs here:

- API helpers for one feature.
- React Query hooks.
- feature-specific transformers.
- form schemas.
- feature-specific utility functions.

What does **not** belong here:

- generic helpers used by the whole app.
- primitive UI components.
- backend database logic.

### `lib/`

This folder is for shared frontend utilities and cross-cutting concerns.

Examples:

- `lib/api/client.ts` → configured fetch wrapper or axios instance.
- `lib/auth/session.ts` → helper to fetch current user.
- `lib/env.ts` → validated frontend environment variables.
- `lib/utils.ts` → safe generic helpers like `cn()` for class merging.

A common mistake is to put all logic in `lib/`. Avoid that. If code belongs to one feature only, place it in `features/`.

### `providers/`

Use this folder for React providers that wrap the application.

Examples:

- `query-provider.tsx` → React Query client provider.
- `theme-provider.tsx` → dark mode/theme provider.

This keeps app-wide wiring separate from business features.

### `middleware.ts`

This is useful for route-level checks such as redirecting unauthenticated users away from protected pages.

Example responsibilities:

- redirect `/tasks` to `/login` if no auth cookie exists,
- redirect authenticated users away from `/login` or `/signup`.

Do not put business authorization here. Ownership checks still belong on the backend.

## shadcn/ui usage

Since the project uses **shadcn/ui**, it is important to keep the generated primitives in a predictable place.

Recommended rule:

- Keep all shadcn base components inside `components/ui/`.
- Build app-specific wrappers outside of `components/ui/`.

Examples:

- `components/ui/dialog.tsx` → generated shadcn primitive.
- `components/tasks/delete-task-dialog.tsx` → app-specific composition using `Dialog`.

This keeps generated components clean and makes upgrades easier.

Also keep `components.json` in `apps/web/` because that is where shadcn expects its configuration.

## Backend structure (`apps/api`)

The backend is organized by **module** rather than by giant global folders like `controllers`, `services`, and `models` at the top level.

That means the `tasks` module contains almost everything related to tasks in one place.

This is easier to scale than a flat architecture because all task-related files stay close together.

### `src/app.ts`

This file creates the Express app and wires up global middleware.

Typical responsibilities:

- `express.json()`
- CORS setup
- cookie parser
- route mounting
- not-found middleware
- error middleware

This file should not call `app.listen()`.

### `src/server.ts`

This file boots the server.

Typical responsibilities:

- import app from `app.ts`
- connect to DB if needed
- start listening on a port
- log startup messages

This separation makes testing easier because tests can import the app without starting a real server.

### `config/`

This folder holds setup code for environment, database client, and infrastructure concerns.

Examples:

- `env.ts` → validate environment variables with Zod.
- `db.ts` → Prisma client singleton.
- `logger.ts` → logger config.

This is the right place for application configuration, not business logic.

### `db/`

This folder is for database-specific files.

Examples:

- `prisma/schema.prisma` → Prisma schema for `User` and `Task`.
- `migrations/` → generated migrations.
- `seed.ts` → seed script.

A good rule is simple: anything that changes the shape of the database or initializes data belongs here.

### `modules/`

This is the heart of the backend.

Each module groups files around a business capability.

For this assignment, the important modules are:

- `auth`
- `users`
- `tasks`

#### Example: `modules/tasks/`

- `tasks.routes.ts` → binds URLs to controller methods.
- `tasks.controller.ts` → reads request data and sends responses.
- `tasks.service.ts` → contains business rules.
- `tasks.repository.ts` → performs Prisma queries.
- `tasks.schema.ts` → Zod schemas for create/update/filter validation.
- `tasks.types.ts` → local module types.
- `tasks.mapper.ts` → transforms database models into API response shapes when needed.

This separation is helpful because each file has one main reason to change.

### `routes/index.ts`

This file mounts module routes in one place.

Example:

```ts
router.use("/auth", authRoutes);
router.use("/tasks", authMiddleware, taskRoutes);
```

This gives the app a clear route entry point.

### `middlewares/`

This folder is for Express middlewares that are reused across modules.

Examples:

- `auth.middleware.ts` → verifies JWT/session and attaches user info.
- `validate.middleware.ts` → validates request body/query/params.
- `error.middleware.ts` → formats errors consistently.
- `not-found.middleware.ts` → handles unknown routes.

A common mistake is doing validation and auth checks inline inside every route. Reusable middleware keeps route files smaller and more consistent.

### `utils/`

This folder holds backend helpers that are not tied to a single business module.

Examples:

- `api-error.ts` → custom error class.
- `async-handler.ts` → wrapper for async route handlers.
- `pagination.ts` → parse page and limit.
- `response.ts` → response shape helpers.

Like frontend `lib/`, this should stay disciplined. If a helper belongs only to tasks, keep it in the tasks module.

## Shared packages (`packages/`)

The `packages/` folder is useful when code is genuinely shared between frontend and backend.

### `packages/shared-types`

Use this for shared TypeScript types or DTO-like contracts.

Examples:

- `TaskStatus`
- `TaskPriority`
- `PaginatedResponse<T>`
- `AuthUser`

This helps keep frontend and backend aligned.

### `packages/validation`

Use this for shared validation schemas if both apps need them.

Examples:

- task create/update schema
- login/signup schema

Be practical here. Shared validation is useful, but over-sharing can create unnecessary coupling. If a schema is only useful on the backend, keep it there.

### `packages/ui`

This is optional.

Only create this if UI is genuinely shared across multiple apps, for example if there is both a web app and docs app using the same design system.

For this assignment, if there is only one frontend app, keeping UI in `apps/web/components` is often simpler.

### Config packages

- `eslint-config/` → shared lint rules.
- `typescript-config/` → shared TS configs.

These are common in monorepos and keep tooling consistent.

## Suggested file responsibilities

The table below gives a practical meaning to the most important file types.

| File type         | Purpose                     | What to put there                                          | What not to put there             |
| ----------------- | --------------------------- | ---------------------------------------------------------- | --------------------------------- |
| `page.tsx`        | Route entry UI              | page composition, route-level fetching, layout composition | low-level reusable component code |
| `layout.tsx`      | Shared page chrome          | nav, sidebar, shared wrappers                              | business logic for tasks          |
| `*.routes.ts`     | Route definitions           | method + path + middleware + controller mapping            | real business logic               |
| `*.controller.ts` | HTTP adapter                | read req, call service, return response                    | raw DB queries                    |
| `*.service.ts`    | Business logic              | ownership checks, rules, task workflows                    | Express-specific code             |
| `*.repository.ts` | Data access                 | Prisma queries, filters, pagination queries                | response formatting               |
| `*.schema.ts`     | Validation                  | Zod schemas for body/query/params                          | DB access                         |
| `hooks.ts`        | Frontend hooks              | React Query hooks, state wrappers                          | generic helper clutter            |
| `api.ts`          | Feature API client          | fetch calls for one feature                                | UI rendering                      |
| `middleware.ts`   | Cross-cutting request logic | auth gate, redirects, validation                           | feature business rules            |

## How this maps to the assignment requirements

### Task CRUD

The `tasks` module on the backend handles:

- create task,
- list tasks,
- get one task,
- update task,
- delete task.

The `tasks` feature on the frontend handles:

- list view,
- form submission,
- edit flow,
- filters,
- search,
- sort,
- optimistic updates if added later.

### Authentication and authorization

The `auth` module handles:

- signup,
- login,
- token/session handling,
- password hashing,
- current user lookup.

Authorization checks such as “users can only access their own tasks” belong in the backend service layer, not only in the UI.

### Search, sort, filter, pagination

This should be supported by the backend list endpoint and controlled by frontend query state.

Typical request example:

```text
GET /tasks?status=todo&search=dashboard&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

Typical frontend state sources:

- URL search params,
- React Query cache keys,
- controlled filter components.

### Tests

A practical starting point is:

- backend auth integration test,
- backend tasks CRUD test,
- backend authorization test,
- optionally one frontend form test.

That is enough to show discipline without over-investing in test surface area.

## Example route-to-file mapping

This section shows how a few real flows map into files.

### Example 1: Create task

Frontend:

- `app/(dashboard)/tasks/new/page.tsx`
- `components/tasks/task-form.tsx`
- `features/tasks/schema.ts`
- `features/tasks/api.ts`
- `features/tasks/hooks.ts`

Backend:

- `modules/tasks/tasks.routes.ts`
- `modules/tasks/tasks.controller.ts`
- `modules/tasks/tasks.service.ts`
- `modules/tasks/tasks.repository.ts`
- `modules/tasks/tasks.schema.ts`

### Example 2: Login

Frontend:

- `app/(auth)/login/page.tsx`
- `components/auth/login-form.tsx`
- `features/auth/api.ts`
- `features/auth/hooks.ts`

Backend:

- `modules/auth/auth.routes.ts`
- `modules/auth/auth.controller.ts`
- `modules/auth/auth.service.ts`
- `modules/auth/auth.schema.ts`

### Example 3: Tasks list with filters

Frontend:

- `app/(dashboard)/tasks/page.tsx`
- `components/tasks/task-filters.tsx`
- `components/tasks/task-table.tsx`
- `features/tasks/hooks.ts`

Backend:

- `tasks.routes.ts`
- `tasks.controller.ts`
- `tasks.service.ts`
- `tasks.repository.ts`

The repository handles filtering/pagination/sorting queries, while the service decides which filters are allowed and ensures only the current user’s tasks are returned.

## Why this is interview-friendly

Interview reviewers usually look for more than just working code. They also look for whether the project shows judgment.

This structure communicates good judgment because it shows:

- clear app boundaries,
- clean ownership of responsibilities,
- room for scaling without chaos,
- understanding of modular backend design,
- understanding of modern Next.js structure,
- awareness of shared packages in a monorepo,
- and practical use of shadcn/ui instead of scattering UI primitives randomly.

In other words, the structure itself becomes part of the explanation of the project.

## What can be added later without restructuring

This structure leaves room for bonus features without forcing a rewrite.

Examples:

- **Role-based access** → add `roles` to auth/users modules.
- **Real-time updates** → add `realtime/` or extend the tasks module with SSE/WebSocket support.
- **Attachments** → add `attachments` module and related frontend feature/components.
- **Activity log** → add `activity` module and task history UI.
- **Docker** → add `docker-compose.yml` and service Dockerfiles.
- **CI** → add GitHub Actions under `.github/workflows/`.
- **Dark mode** → keep using `theme-provider.tsx` and shadcn-compatible theming.

That is one of the main reasons this structure is strong: it is simple enough for now, but it does not trap the codebase later.

## Practical implementation notes

### Keep pages thin

A page should answer: “Which screen is this?”

It should usually not contain:

- long mutation logic,
- all fetch code,
- all validation code,
- large reusable JSX blocks.

Move those into `features/` and `components/`.

### Keep repositories boring

Repositories should be boring on purpose.

They should mostly do:

- query database,
- insert/update/delete rows,
- return results.

Do not hide complex business rules inside repositories.

### Keep services smart

Services are where application rules belong.

Examples:

- user can only update own task,
- default status is `todo`,
- archived/deleted behavior,
- allowed sorting fields,
- combining filter logic.

### Keep `lib/` and `utils/` disciplined

Many projects become messy because these folders slowly collect unrelated code.

A good test is:

- if it belongs to one feature, keep it inside that feature,
- if it is truly cross-cutting, then move it to `lib/` or `utils/`.

## If the current repo already has `app/`, `components/`, `hooks/`, and `lib/`

That is fine. It is already moving in the right direction.

The main improvement is to:

- move the frontend under `src/` if desired for consistency,
- add `apps/api`,
- add `features/`,
- make `components/ui` the official home for shadcn primitives,
- and avoid placing backend logic inside the Next.js app.

There is no need to restart the repository from scratch just to get a cleaner structure.

## Final summary

This monorepo structure is a practical, interview-friendly, and extensible setup for a full-stack task manager built with Next.js, Express, PostgreSQL, and shadcn/ui.

It works well because it separates concerns clearly:

- the frontend owns pages and user interactions,
- the backend owns REST endpoints and business rules,
- and shared packages own reusable contracts and configs.

That makes the codebase easier to understand for a reviewer, easier to navigate for an AI IDE, and easier to extend when new features are added.
