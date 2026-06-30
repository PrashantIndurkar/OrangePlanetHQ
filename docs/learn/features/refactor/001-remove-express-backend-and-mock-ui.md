# Feature Overview

## What We Built / Did
We completely deleted the Express.js REST backend API project (`apps/api`), including its PostgreSQL database schema mapping, migrations, and seeder files managed via Prisma ORM. Concurrently, we redirected all API endpoints on the Next.js frontend (`apps/web`) to use a simulated, client-side data mocking layer backed by browser `localStorage`. We also stripped out the "admin" user concept, removing admin badges and all-user filters from the client UI.

## Why We Did It
The existing backend code was a legacy demo using Prisma REST endpoints, which does not match our planned production architecture. Our future goal is to migrate to a highly scalable **tRPC + Drizzle ORM** API layer. In order to prepare the codebase for a fresh start on this new stack without breaking the user interface during the transition, we completely removed the old backend and configured the frontend to run fully offline using browser local storage mock data.

## User Problem It Solves
It enables developers to continue iterating on, testing, and presenting the Next.js UI workflow (creating, viewing, editing, and deleting tasks) locally in the browser with state persistence, even though the database server and backend API application are temporarily offline during the stack transition.

---

# Requirements
*   Remove all database configurations, Prisma ORM schemas, and REST endpoints from the backend repository.
*   Retain a functional Next.js UI on the frontend that behaves as if it is connected to a live database.
*   Implement full CRUD (Create, Read, Update, Delete) capability on tasks with filtering, search queries, and sorting.
*   Simulate authentication login, signup, and session restoration.
*   Remove the "admin" user role concept, including UI components like the admin badge and the "Show All Users" toggle.

---

# Final Architecture

The frontend is now completely self-sufficient and operates without making external API calls:

```
[ Next.js UI Components ]
        ↓
[ Feature Hook Layer (useTasksQuery, etc.) ]
        ↓
[ Mock API Layer (features/tasks/api.ts & features/auth/api.ts) ]
        ↓
[ Browser LocalStorage / Memory Mocks ]
```

---

# Step-by-Step Implementation

### Step 1: Remove apps/api Directory
We deleted all files inside `apps/api` (including Prisma config, REST route handlers, schema controllers, seeders, and tests), leaving only empty system-locked `node_modules` folders. 
*   **Why?** To ensure a clean starting slate for tRPC and Drizzle without legacy REST controllers polluting the project.

### Step 2: Clean Up Root dev Scripts
We updated the `dev` script in the root `package.json` to run only `turbo run dev` instead of referencing `dev:studio` (which launched the Prisma Studio).
*   **Why?** Since Prisma and database schemas were deleted, running the studio would result in console script errors.

### Step 3: Implement Task Mocking Layer
We rewrote [api.ts (Tasks)](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/features/tasks/api.ts) to read from and write to a `localStorage` key named `"orangeplanet_mock_tasks"`. The mock functions replicate the filtering logic (by status and priority), search queries (checking titles and descriptions), sorting, and activity log creations.
*   **Why?** To simulate database writes/reads directly in the user's browser, preventing the UI from throwing network errors.

### Step 4: Implement Auth & Upload Mocks
We rewrote [api.ts (Auth)](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/features/auth/api.ts) and [upload-image.ts](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/lib/upload-image.ts) to handle simulated sessions in `localStorage` and return local `URL.createObjectURL(file)` instances for uploaded files.
*   **Why?** Authentication state is required to access the main task board dashboard, and object URLs allow instant image rendering in tasks without needing a Cloudinary cloud backend.

### Step 5: Remove Admin Badge and Toggle controls
We deleted the Admin status badges in [sidebar-header.tsx](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/components/layout/sidebar/sidebar-header.tsx) and removed the "Show All Users" workspace toggle button and query checks from [workspace-filters.tsx](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/components/workspace/workspace-filters.tsx) and [index.tsx](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/components/workspace/index.tsx).
*   **Why?** To simplify the application structure and align with the requirement to remove admin concept logic.

---

# Technologies Used

## LocalStorage
- **How it was used:** Used as a mock database client inside the frontend API files to persist created tasks and active sessions.
- **Why we used it:** It is a zero-dependency, built-in browser API that persists data across page reloads.
- **What would happen if removed:** Task lists and authentication sessions would reset every time the browser is refreshed.

## URL.createObjectURL
- **How it was used:** Generates a temporary local blob URL representing the selected file to render uploaded attachments.
- **Why we used it:** It allows instant rendering of attachment previews without executing remote cloud uploads.
- **What would happen if removed:** Task description images would not display on the board.

---

# Important Files

- [tasks/api.ts](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/features/tasks/api.ts)
  * **Purpose:** Contains mock implementations of `listTasksApi`, `createTaskApi`, `updateTaskApi`, `deleteTaskApi`.
  * **What happens if deleted:** The tasks features on the dashboard will fail to load.
- [auth/api.ts](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/features/auth/api.ts)
  * **Purpose:** Exposes mock authentication controllers (`loginApi`, `signupApi`, `getMeApi`).
  * **What happens if deleted:** The application will redirect users back to the login screen.

---

# Data Flow

### Retrieving Tasks (Data Flow)
```
1. WorkspaceLayout mounts inside apps/web/components/workspace/index.tsx.
2. calls useTasksQuery hook, triggering listTasksApi() in features/tasks/api.ts.
3. listTasksApi retrieves stringified JSON from localStorage.
4. Filters tasks by search query, status list, priority list, and sorts them.
5. Returns a promise resolving after a simulated 300ms network delay.
6. Next.js components render the task cards.
```

---

# Architecture Decisions

- **Decision:** Client-Side Mocking over mock local API servers.
- **Alternatives:** Maintaining a node mock server (e.g. JSON-server).
- **Why selected:** Client-side mocking requires zero process execution or setup by the developer, runs instantly on standard static hosting (e.g. Vercel), and has no dependency mismatch with build pipelines.

---

# Common Mistakes

- **Mistake:** Attempting to run `localStorage` calls during Server-Side Rendering (SSR).
- **How to avoid:** Always wrap `localStorage` access blocks in `typeof window !== "undefined"` checks to prevent rendering errors on the Node server environment.

---

# Interview Questions

1. **How does `URL.createObjectURL(file)` work and why is it useful for mock uploads?**
   * **Answer:** It creates a temporary string URL mapping to the local file stored in browser memory. It is useful because it allows rendering local media immediately without uploading it to a cloud server first.
2. **Why is it important to wrap `localStorage` reads in window checks in Next.js?**
   * **Answer:** Next.js pre-renders pages on the server where the browser window/localStorage objects do not exist. Accessing them directly throws compilation or runtime execution errors.

---

# Key Takeaways
- Client-side mock APIs allow fully decoupling the frontend development loop from backend database operations.
- Separating API queries into dedicated feature modules makes it straightforward to replace the fetch mechanisms (from REST to tRPC) without modifying UI components.

---

# Mini Challenge
- **Challenge:** Add an `ActivityLog` tab to the Task details panel that displays the simulated activities list stored inside each task object in local storage.
