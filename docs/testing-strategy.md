# OrangePlanetHQ — Testing Strategy & AI Mandate

This document defines the testing frameworks, testing scopes, and rules for writing and running tests in the OrangePlanet monorepo. It serves as the instruction manual for developers and AI assistants to verify code changes before shipping.

---

## 1. The AI Testing Mandate

Any AI coding agent modifying the OrangePlanet codebase must adhere to the following rules:

1. **Write Accompanying Tests:** If you add a new utility function, a database Use-Case Action, a tRPC router procedure, or a shared UI component, you **must** write corresponding tests.
2. **Verify Before Declaring Success:** You are not allowed to mark a task as completed without running the test suite and ensuring all tests pass.
3. **Fix regressions:** If your code modifications break existing tests, you must rewrite the code or adjust the tests to align with the new specifications. Do not skip or disable failing tests.

---

## 2. Testing Stack & Commands

| Scope | Tool | Command (Run from Root) | Target |
|---|---|---|---|
| **Unit & Integration** | `Vitest` | `pnpm run test` | Business logic, Drizzle queries, UI components |
| **E2E / Browser** | `Playwright` | `pnpm run test:e2e` | User workflows, Auth, WebSockets, Calls |

---

## 3. Unit & Integration Testing (Vitest)

We use **Vitest** because it executes tests instantly in memory and integrates natively with our ESM/TypeScript config.

### A. Business Logic & Use-Cases
- Test files must be co-located with their target implementation using the `[name].test.ts` extension.
- **Mocking Database Connections:** Mock the Drizzle database client rather than hitting the live Postgres instance. Verify that transaction boundaries and queries are called with the correct parameters:
```typescript
// src/services/issues/create-issue.test.ts
import { describe, it, expect, vi } from 'vitest';
import { CreateIssueAction } from './create-issue';

describe('CreateIssueAction', () => {
  it('should atomically increment organization issue counter and insert issue', async () => {
    const mockTx = {
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ key: 'PLO', nextIssueNumber: 24 }]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
    };
    
    const dbMock = {
      transaction: vi.fn().mockImplementation((cb) => cb(mockTx)),
    } as any;

    const result = await CreateIssueAction.execute(dbMock, {
      title: 'Fix auth cookie',
      organizationId: 'org-123',
      actorId: 'member-456',
    });

    expect(mockTx.update).toHaveBeenCalled();
    expect(mockTx.insert).toHaveBeenCalled();
  });
});
```

### B. Shared UI Components (`packages/ui`)
- Components containing conditional rendering, dropdown selections, or interactive elements must have a `.test.tsx` file verifying the DOM state (using `@testing-library/react` and `@testing-library/jest-dom`).

---

## 4. End-to-End Testing (Playwright)

We use **Playwright** to test full user journeys inside a real browser environment. E2E tests live in `apps/web/e2e/`.

### A. Authentication State Reuse (Crucial)
To prevent tests from slowing down due to logging in before every single test:
1. Playwright runs a single setup task that logs in an admin user.
2. It saves the Better Auth session cookies to a local file (`playwright/.auth/user.json`).
3. Subsequent tests load this cookie state directly into the browser context, instantly starting as an authenticated user.

### B. WebSocket & Real-time Assertions
Since chat and notifications are WebSocket-driven, write assertions that test asynchronous client updates:
```typescript
// apps/web/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test('should send and receive messages in real time', async ({ page, context }) => {
  // Open two separate browser tabs to simulate two users
  const pageA = page;
  const pageB = await context.newPage();

  await pageA.goto('/org/acme/channel/general');
  await pageB.goto('/org/acme/channel/general');

  // User A sends message
  await pageA.fill('[data-testid="chat-input"]', 'Hello team!');
  await pageA.press('[data-testid="chat-input"]', 'Enter');

  // Verify User B receives it instantly via WebSocket push
  await expect(pageB.locator('text=Hello team!')).toBeVisible();
});
```

### C. Visual Regression Testing
We run visual snapshots to ensure our zero-radius flat visual style does not regress:
- Capture screenshot comparisons for components:
```typescript
await expect(page.locator('[data-testid="sidebar"]')).toHaveScreenshot();
```
