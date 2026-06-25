# 📋 OrangePlanet: Implementation Review & Verification Checklist

This document provides a comprehensive audit of the **OrangePlanet** codebase against the requirements listed in the assignment (`Assesment Rival.txt`). It details what has been implemented, what is missing/needs improvement, and a step-by-step guide for manual verification.

---

## 🔍 Part 1: Implementation Status Audit

### 1. Task 1: Backend API
*   **POST /tasks** (Create Task): **Implemented** (Creates task with issue number, title, description, status, priority, and due date).
*   **GET /tasks** (List Tasks with filtering/pagination): **Implemented** (Supports multi-select status and priority filtering, search, pagination limit/page, and date query parameters).
*   **GET /tasks/:id** (Fetch Single Task): **Implemented** (Supports resolving task by UUID, custom ID like `OPH-123`, or shortened UUID prefix).
*   **PATCH /tasks/:id** (Update Task): **Implemented** (Validates and updates properties, automatically appending to the activity log).
*   **DELETE /tasks/:id** (Delete Task): **Implemented** (Soft/Hard delete handling with cascading activity logs).
*   **PostgreSQL Persistence**: **Implemented** (Using Prisma ORM v7 with schema in `apps/api/prisma/schema.prisma`).
*   **Input Validation on Write Endpoints**: **Implemented** (Zod schemas validation in `tasks.schema.ts` coupled with validation middleware).
*   **Proper HTTP Status Codes & Error Envelopes**: **Implemented** (Uses a custom `ApiError` class and middleware returning formatted JSON errors).

### 2. Task 2: Authentication and Authorization
*   **Signup & Login API**: **Implemented** (Uses JWT tokens, tokens stored securely).
*   **Password Hashing**: **Implemented** (Uses bcrypt to hash passwords securely).
*   **Route Protection**: **Implemented** (Custom `authMiddleware` shields all `/tasks` API routes).
*   **User Task Isolation**: **Implemented** (Regular users can only view, list, modify, or delete their own tasks; database actions verify ownership).
*   **Frontend Session Persistence**: **Implemented** (LocalStorage stores the JWT token, resolved with a initial `/me` fetch on page load).

### 3. Task 3: Frontend (Next.js)
*   **Task List View**: **Implemented** (Linear-like clean interface with list & kanban board views).
*   **Status Filter & Pagination**: **Implemented** (Status filter pills and pagination controls).
*   **Create and Edit Task Forms**: **Implemented** (Dialog inputs for creating, and auto-saving inline edits on task details view).
*   **Mark Complete & Delete from UI**: **Implemented** (Change status dropdown to "done" or click the delete trash bin icon).
*   **Graceful States**: **Implemented** (Shimmer/loading skeletons, blank empty boards, and toast message error states).
*   **Responsive Layout**: **Implemented** (Flex grids, collapsible sidebars, and tailored mobile views).

### 4. Task 4: Search and Sort
*   **Search by Title**: **Implemented** (Matches title/description on database level case-insensitively).
*   **Sort options**: **Implemented** (Supports sorting by due date, priority, and creation date).
*   **Combined Filters/Search/Sort**: **Implemented** (All query params are handled together dynamically in `tasks.repository.ts`).

### 5. Plus Features (Bonus)
*   **Role-Based Access (Admin Mode)**: **Implemented** (Admin role sees and updates all users' tasks via the `allUsers` query parameter).
*   **Real-Time Live Updates**: **Implemented** (WebSockets server implemented via standard `ws` on the API, and the client listens for changes to invalidate TanStack query caches automatically).
*   **Optimistic UI Updates**: **Implemented** (Updates status/priority immediately in the UI before API confirmation, with error rollbacks).
*   **Task Attachments**: ⚠️ **Partially Implemented (Frontend Only)**
    *   *What works:* The UI includes an attachment button that reads files. If it is an image, it converts it to a Base64 string and embeds it directly in the description field markdown as `![filename](data:image/...)`.
    *   *What is missing:* A dedicated, dedicated file-upload endpoint (`POST /api/v1/attachments`), database attachment tables/relations, and support for non-image file uploads (e.g. PDFs, documents) which can't be easily inline-rendered.
*   **Activity Log**: **Implemented** (Tracks actions like creation, title changes, priority updates, and status updates, showing them on a timeline in the task detail sidebar).
*   **Dockerized Setup**: **Implemented** (Multi-stage builds in `docker-compose.yml` linking Postgres, Next.js, and Express).
*   **CI Pipeline**: **Implemented** (GitHub actions linting/testing in `.github/workflows`).
*   **Dark Mode**: **Implemented** (Uses `next-themes` with a persist toggle).

---

## 🧪 Part 2: Manual Testing & Verification Guide

Follow these steps to manually test the application and verify each feature:

### 1. Authentication & Signup
*   **Step 1:** Go to `http://localhost:3000`. If not logged in, you should be redirected to the sign-in page.
*   **Step 2:** Click **Sign Up**, create a new account, and press submit.
*   **Expectation:** You are logged in immediately and redirected to `/tasks`.
*   **Step 3:** Refresh the page.
*   **Expectation:** The session persists, and you remain logged in without returning to the login page.
*   **Step 4:** Click **Logout** in the bottom-left sidebar.
*   **Expectation:** Token is cleared, and you are redirected to the homepage/sign-in page.

### 2. Task Management CRUD
*   **Step 1:** Click **New Issue** (or press `C`).
*   **Step 2:** Fill out the title, add a description, set a status, priority, and due date. Click **Create**.
*   **Expectation:** The task is created, a unique ID is assigned (e.g. `OPH-1`), and it immediately displays on the list/board.
*   **Step 3:** Click on the task in the list/board to open the Details panel.
*   **Step 4:** Modify the title or description and click outside (blur). Change the status/priority/due date.
*   **Expectation:** Updates auto-save immediately. An entry is created in the **Activity** log timeline at the bottom showing exactly what changed (e.g., *"changed status from todo to in-progress"*).

### 3. Task Isolation & Admin View
*   **Step 1:** Log in with the standard user `test@example.com` / `password123`. Create a few tasks.
*   **Step 2:** Log out and log in with a different registered user.
*   **Expectation:** You cannot see the first user's tasks.
*   **Step 3:** Log out and log in as the Administrator (`admin@example.com` / `password123`).
*   **Step 4:** Navigate to tasks and toggle the **All Users** filter.
*   **Expectation:** You can now see and update tasks belonging to all users across the system.

### 4. Search, Sort, and Filters
*   **Step 1:** In the Search bar, type a unique word present in one of your tasks' titles.
*   **Expectation:** The list/board filters to show only matching tasks.
*   **Step 2:** Apply status filters (e.g., check `Todo` and `In Progress`) and priority filters.
*   **Expectation:** Filters work cumulatively with your active search query.
*   **Step 3:** Change sorting order to **Due Date** or **Priority**.
*   **Expectation:** Order updates instantly, persisting selected filter parameters.

### 5. WebSockets Real-Time Sync
*   **Step 1:** Open two different browser tabs (or normal + incognito window) logged into the same account.
*   **Step 2:** In window A, create a new task or change a task's status.
*   **Expectation:** In window B, the list/board updates in real-time to reflect the new task or property change without requiring a page refresh.

### 6. Optimistic UI
*   **Step 1:** Disconnect your internet connection (or throttle speed in DevTools network tab to offline).
*   **Step 2:** Drag a task card to another column or change its status dropdown.
*   **Expectation:** The UI moves/updates instantly (optimistic update). Since the network request fails, after a few seconds the UI rolls back to its original state, showing an error toast.

---

## 🐞 Bugs, Code Improvements & Enhancements List

Here is a list of items to improve, address, or implement to secure a perfect score:

1.  **Backend Task Attachments Capability (Bonus Requirement)**
    *   *Issue:* The backend doesn't support file uploads. Base64 images are embedded directly in the description. This can bloat database records and doesn't support PDF/Word document attachments.
    *   *Fix:* Implement `POST /api/v1/attachments` endpoint with multer/local storage, a database `Attachment` model, and display the attachment list in the details sidebar.
2.  **Date Coercion timezone mismatches**
    *   *Issue:* Due date conversion is localized to 12:00 PM on UTC, which might offset due dates by one day depending on client browser timezones.
    *   *Fix:* Save date strings using standard date format without forcing UTC mid-days, or let client-side handle ISO formatting fully.
3.  **Real-time WebSocket connection state toast**
    *   *Issue:* If the WebSocket connection drops, the UI fails silently, meaning real-time updates stop without warning.
    *   *Fix:* Show a small connection status indicator or a toast indicating reconnecting state.
