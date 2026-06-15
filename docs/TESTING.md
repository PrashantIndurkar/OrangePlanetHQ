# 🧪 Stride Test Suite & Automation Guide

This document details the testing architecture, tools, setup/cleanup strategies, and test coverage configurations for the Stride task manager codebase.

---

## 🎯 Testing Architecture & Strategy

Stride focuses on **HTTP API Integration Testing** as its primary quality gate. 
- **Framework:** **Vitest** (modern, ESM-native test runner).
- **HTTP Assertion:** **Supertest** (allows running real HTTP request/response lifecycles against the Express application instance without listening on a TCP port).

### Why Integration Tests Over Mocked Unit Tests?
For full-stack SaaS apps, bugs rarely happen in isolated functions. Instead, they occur during:
- Database constraint violations (e.g., UUID validation failure).
- Authentication guard failures (e.g., token parsing errors).
- Route serialization/mapping errors.

By booting the actual Express router and hitting endpoints with Supertest, we test the entire request cycle (Middleware -> Zod Validation -> Router -> Controller -> Service -> Repository -> PostgreSQL Database) in milliseconds.

---

## 🧼 Test Database Lifecycle & Cleanups

To ensure tests are deterministic and do not pollute production/development databases:

1. **Environment Separation:** The test script runs using `.env.test` as its environment.
2. **Dedicated Test Schema:** The database URL points to a separate test database:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stride_test?schema=public
   ```
3. **Cascading Cleanups (`apps/api/test/setup.ts`):** 
   - Before running the test suites, Prisma migrations are deployed to the test database.
   - At the end of the test run, the hook executes `cleanDb()`, which deletes all users:
     ```ts
     // apps/api/test/setup.ts
     export async function cleanDb() {
       await prisma.user.deleteMany({});
     }
     ```
   - Because of the Prisma schema definitions (`onDelete: Cascade` on the `userId` relations), deleting users instantly and safely cascade-deletes all associated tasks and activity logs in a single query.

---

## 🔍 Detailed Breakdown of Test Suites

The test files reside inside [apps/api/test/](file:///Users/prashantindurkar/Code/Interviews/Assesment%20Rival/stride/apps/api/test) and are organized into four core integration boundaries:

### 1. Authentication Suite (`test/auth/auth.test.ts`)
- **What it tests:**
  - `POST /api/v1/auth/signup`: Validates correct creation of user records, password hashing verification, and Zod input constraint rejections (e.g., weak passwords, invalid emails).
  - `POST /api/v1/auth/login`: Asserts that correct email/password pairs return a valid JWT, while incorrect pairs return `401 Unauthorized`.
  - `GET /api/v1/auth/me`: Verifies the authentication middleware correctly extracts user details from incoming Bearer tokens.

### 2. Task Creation Suite (`test/tasks/create.test.ts`)
- **What it tests:**
  - Verifies that authenticated requests can create tasks.
  - Asserts that default values (status defaults to `todo`, priority defaults to `no-priority`) are set automatically.
  - Verifies that task titles cannot be empty (Zod validation validation) and returns `400 Bad Request` with structured error messages.

### 3. Tenant Isolation & Stealth Suite (`test/tasks/isolation.test.ts`)
- **What it tests:**
  - Creates Task A for User A, and Task B for User B.
  - **Stealth Verification:** Asserts that when User B requests/updates/deletes Task A (`GET /tasks/:id_a`), the API returns **`404 Not Found`** instead of `403 Forbidden`.
  - Asserts that User B cannot modify User A's task status, priority, or details, confirming database-level isolation.

### 4. Pagination & Filtering Suite (`test/tasks/pagination.test.ts`)
- **What it tests:**
  - Verifies pagination arithmetic: requesting page 2 with limit 2 returns the correct slice of data.
  - Verifies keyword search: filters tasks dynamically by checking titles or descriptions (case-insensitive).
  - Verifies multi-value filters: passing `status=todo,in-progress` successfully retrieves matching tasks.

### 5. Role-Based Admin Suite (`test/tasks/admin.test.ts`)
- **What it tests:**
  - Verifies that users with the `admin` role bypass standard tenant isolation rules.
  - Asserts that an admin can read or delete tasks belonging to other users, while regular users cannot.

---

## 🚀 How to Run the Test Suite

### Local Run Commands

Run all tests once:
```bash
# In the stride root directory
pnpm --filter api test
```

Run tests in interactive Watch Mode (ideal during development):
```bash
pnpm --filter api exec vitest
```

Open the visual Vitest UI (rich browser test reporter dashboard):
```bash
pnpm --filter api exec vitest --ui
```

---

## ✍️ Guidelines for Writing New API Tests

When adding new endpoints (e.g., attachments or comment systems), write tests following this structure:

```ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { generateTestUserAndToken } from "../helpers"; // Helper utility

describe("POST /api/v1/attachments", () => {
  it("should block unauthenticated requests", async () => {
    const response = await request(app)
      .post("/api/v1/attachments")
      .send({ name: "plan.pdf", url: "https://example.com/plan.pdf" });

    expect(response.status).toBe(401);
  });

  it("should create attachment for owner task", async () => {
    const { token, user } = await generateTestUserAndToken();
    // 1. Create task
    // 2. Post attachment linked to task
    // 3. Assert response code is 201
  });
});
```
