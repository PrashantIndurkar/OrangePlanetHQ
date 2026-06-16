# 🏗️ Monorepo Architecture & Software Design Guide

This document provides a highly technical explanation of the architectural paradigms, patterns, and design decisions underpinning the Stride codebase. It is written to serve as a guide for engineering interviewers and onboarding developers, explaining how the stack is structured, why these choices were made, and how to scale the application.

---

## 🗺️ High-Level Architecture Overview

Stride is built as a decoupled full-stack application structured inside a **Turborepo Monorepo** managed by **pnpm workspaces**. 
<img width="1536" height="1024" alt="download" src="https://github.com/user-attachments/assets/bebe5aab-24e6-4a6a-a59c-00d0dbdfad9e" />
```text
       ┌──────────────────────────────────────────────────────────┐
       │                   Next.js Frontend                       │
       │                     (apps/web)                           │
       └──────────────────────────┬───────────────────────────────┘
                                  │
                       HTTP REST  │  (JWT Session)
                       Requests   │
                                  ▼
       ┌──────────────────────────────────────────────────────────┐
       │                   Express API Backend                    │
       │                     (apps/api)                           │
       └──────────────────────────┬───────────────────────────────┘
                                  │
                         Prisma   │  (Postgres Client)
                         Client   │
                                  ▼
       ┌──────────────────────────────────────────────────────────┐
       │                   PostgreSQL Database                    │
       │                      (Prisma ORM)                        │
       └──────────────────────────────────────────────────────────┘
```

### Decoupled Separation of Concerns
Unlike monolithic setups that blend server-side rendering and database queries into a single Next.js app, Stride decouples the **Frontend (Next.js)** and **Backend (Express)**.
- **Why?** This reflects the industry-standard architecture of premium SaaS apps like **Linear**, **Vercel**, and **Cal.com**. 
- **Benefits:**
  - **Edge-Ready Frontend:** The frontend can be compiled statically and deployed to global Edge networks/CDNs (like Vercel or Cloudflare Pages) for immediate response times.
  - **Independent Scaling:** The backend API container runs on standard compute nodes (e.g., Docker, AWS ECS, Fly.io) to support persistent database pools, long-lived computations, or WebSocket subscriptions without exhausting Edge runtime resources.
  - **tooling isolation:** frontend and backend run independent TypeScript, bundler, and compiler environments, eliminating version clashes.

---

## 📦 Monorepo Architecture (Turborepo & pnpm)

Monorepos can become sluggish as they grow. Stride solves this by using **pnpm workspaces** for package management and **Turborepo** for build caching.

### Workspace Structure
- `apps/web`: Next.js web client.
- `apps/api`: Express REST API.
- `packages/eslint-config`: Shared linting configurations (for Next.js, Express, and packages).
- `packages/typescript-config`: Shared `tsconfig.json` configurations.
- `packages/ui`: Shared UI components and React primitives.

### Remote Caching and Task Orchestration
Turborepo reads the dependency tree defined in `package.json` files and creates a task execution pipeline. By defining tasks in `turbo.json`, builds, tests, and lints are cached locally or shared across developers and CI workflows.
- If a file in `apps/web` is modified, running `pnpm run build` will build the frontend but reuse the cached output for `apps/api`, saving minutes of build time.

---

## ⚡ Backend Architecture (Express + Prisma)

The backend (`apps/api`) uses a **Modular Domain Pattern** coupled with the **Controller-Service-Repository (CSR)** architecture. 

### Why Modular over Layered?
In traditional layered architectures, controllers, services, and models live in separate global directories. As the app grows, developers must jump between folders far apart to add a single feature.
Stride packages all domain-specific files inside modular directories:
- `modules/auth/`
- `modules/users/`
- `modules/tasks/`

### The Controller-Service-Repository Pattern

Each module maintains a strict hierarchy of data-flow and responsibility boundaries:

```text
  HTTP Request ────► [Controller] ────► [Service] ────► [Repository] ────► Database
                       (Zod Valid)      (Biz Logic)    (Prisma Queries)
```

#### 1. Controller (`*.controller.ts`)
- **Responsibility:** Adapts the HTTP request envelope to the application.
- **Rules:** Reads parameters, calls the appropriate service, handles HTTP response codes, and handles pagination formatting. It contains **no business rules** and **no direct database queries**.
- **Input Validation:** Integrates Zod schema validation via `validateMiddleware` before the controller logic is executed.

#### 2. Service (`*.service.ts`)
- **Responsibility:** Houses core application workflows and domain rules.
- **Rules:** Enforces permission checks (e.g., validating user roles, verifying owner boundaries), decides default fallbacks, and triggers auxiliary actions like logging events.

#### 3. Repository (`*.repository.ts`)
- **Responsibility:** Acts as a data access boundary, isolating the service from the database query technology (Prisma ORM).
- **Rules:** Directly executes database client calls (`prisma.task.findMany`, etc.).

---

## 🎨 Frontend Architecture (Next.js App Router)

The frontend client (`apps/web`) leverages Next.js App Router, TailwindCSS, and shadcn/ui. Its files are split into three layers: Routing, Components, and Features.

### 1. Routing Layer (`app/`)
Uses file-based routing. Keep page controllers thin:
- **`app/(dashboard)/tasks/page.tsx`** loads layout, triggers state hooks, and displays components. It does not parse fetch calls, format JSON arrays, or validate form schemas directly.

### 2. Feature Layer (`features/`)
Located in `src/features/` or `features/`, this represents feature-specific state and API integrations:
- **`features/tasks/api.ts`**: Contains basic fetch configurations for task endpoints.
- **`features/tasks/hooks.ts`**: Houses TanStack React Query mutations (`useCreateTask`, `useUpdateTask`). This is where **Optimistic UI Updates** are orchestrated, immediately rendering status changes while verifying the update in the background.

### 3. Component Layer (`components/`)
Separates styling primitives from complex compositions:
- **`components/ui/`**: Unmodified shadcn/ui atomic elements (e.g., `button.tsx`, `dialog.tsx`).
- **`components/tasks/`**: Domain compositions that use primitive UI components (e.g., `task-card.tsx` or `task-filters.tsx`).

---

## 🔒 Security & Stealth Boundary Guarding

For security, Stride uses a **Stealth Boundary Guarding** pattern.

### The Metadata Leak Vulnerability
In task managers, tasks are referenced by UUIDs. If User B queries User A's task (`GET /tasks/abc-123-xyz`), a standard API returns a `403 Forbidden` response.
- **The Problem:** Returning `403` leaks information. It confirms to an attacker that task `abc-123-xyz` exists in the system. Attackers can scrape UUIDs to build user maps.

### Stealth Guarding Implementation
In `tasks.repository.ts`, every database call is scoped under the active session user ID:
```ts
// In tasks.repository.ts
async findById(id: string, userId: string) {
  return prisma.task.findFirst({
    where: { id, userId } // Enforced user boundary
  });
}
```
If User B requests User A's task, the repository returns `null`. The service receives a missing record, and the controller returns a **`404 Not Found`** instead of a `403`. 
- **Security Benefit:** The API makes unauthorized resources invisible. It prevents ID scanning, protecting tenant metadata.

---

## 🛠️ Developer Guide: How to Add a New Feature

To add a new capability (e.g., **Task Attachments**) to Stride, follow this step-by-step checklist:

### Step 1: Update the Database Schema
1. Open [schema.prisma](file:///Users/prashantindurkar/Code/Interviews/Assesment%20Rival/stride/apps/api/prisma/schema.prisma).
2. Add the new model:
   ```prisma
   model Attachment {
     id        String   @id @default(uuid())
     name      String
     url       String
     taskId    String
     task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
     createdAt DateTime @default(now())
   }
   ```
3. Run migrations locally:
   ```bash
   pnpm --filter api exec prisma migrate dev --name add_attachments
   ```

### Step 2: Create the Backend Module
Create the directory `/apps/api/src/modules/attachments/` containing:
1. `attachments.schema.ts` (Zod validation schemas).
2. `attachments.repository.ts` (Prisma queries).
3. `attachments.service.ts` (Ownership rules and business logic).
4. `attachments.controller.ts` (HTTP input extraction).
5. `attachments.routes.ts` (HTTP mapping).

Register the route inside `apps/api/src/routes/index.ts`:
```ts
import { attachmentRoutes } from "../modules/attachments/attachments.routes";
router.use("/attachments", authMiddleware, attachmentRoutes);
```

### Step 3: Integrate the Frontend feature
1. Add API request client calls in `apps/web/features/attachments/api.ts`.
2. Add TanStack Query React hooks in `apps/web/features/attachments/hooks.ts`.
3. Create composition components in `apps/web/components/attachments/` (e.g., `attachment-list.tsx`).
4. Import and mount components inside the task detail layouts in `apps/web/app/(dashboard)/tasks/[taskId]/page.tsx`.

---

## 🖼️ Media & File Upload Architecture (Tiptap + Cloudinary)

Stride implements a secure, headless media upload pipeline to handle inline images and assets in task descriptions.

### Data Flow Pipeline
```text
  User Dropped/Pasted Image 
    ────► [Tiptap Editor] 
    ────► [Next.js Upload API Client] 
    ────► Express API (POST /api/v1/uploads/image) 
    ────► Multer (MemoryBuffer Validation) 
    ────► Cloudinary (Stream Ingestion) 
    ────► Secure CDN URL returned to Editor 
    ────► Persisted in Task Description HTML
```

### Architectural Decisions
1. **Headless Rich Editor (Tiptap):** Stride uses `Tiptap` with `@tiptap/extension-image` rather than heavyweight, pre-styled editor widgets. This gives the application direct control over paste events (`handlePaste`) and drag-and-drop actions (`handleDrop`) inside the layout workspace.
2. **Buffer Stream Ingestion:** Files are parsed on the Express API server using **Multer** (`memoryStorage`), validated for maximum file size (10MB) and MIME type (`jpeg`, `png`, `webp`, `gif`), and immediately streamed to **Cloudinary** using Node.js buffers. 
3. **No Database Binaries:** Task attachments are stored as secure, compressed Cloudinary URL strings within the description HTML rather than raw Base64 strings or binary BLObs in PostgreSQL. This keeps the database lean and leverages Cloudinary's fast CDN edge for content delivery.

