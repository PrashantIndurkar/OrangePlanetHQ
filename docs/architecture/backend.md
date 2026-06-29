# OrangePlanetHQ — Backend Architecture & API Flow

This document details the backend architecture for OrangePlanetHQ using Express 5, tRPC, and Better Auth. It outlines the request lifecycle, authentication checks, multi-tenancy verification, and the Use-Case / Action pattern.

---

## 1. Request Lifecycle & Routing Layout

The backend server operates in a **Hybrid API Mode**:
- **Internal API:** Handles all interactive web client requests using `tRPC` mounted on `/trpc`.
- **External API:** Handles webhooks, auth callbacks, and future public integrations using standard `Express REST` endpoints mounted on `/api`.

```
                        ┌──────────────────────────────┐
                        │   Incoming HTTP Request      │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │    Express Core Middlewares  │
                        │ (CORS, Cookie Parser, Body)  │
                        └──────────────┬───────────────┘
                                       │
                      ┌────────────────┴────────────────┐
             /trpc    │                                 │    /api
      ┌───────────────▼──────────────┐           ┌──────▼───────────────────────┐
      │     tRPC Express Middleware  │           │    Express REST Router       │
      │   (Resolves auth context)    │           │ (OAuth callbacks, webhooks)  │
      └───────────────┬──────────────┘           └──────────────────────────────┘
                      │
                      ▼
      ┌──────────────────────────────┐
      │   tRPC Router & Procedures   │
      │  (orgProcedure, input checks)│
      └──────────────────────────────┘
```

---

## 2. Authentication Context (`createContext`)

Our tRPC context builder extracts the authentication token from the request cookie and parses the organization context from the HTTP headers.

```typescript
// apps/api/src/trpc/context.ts
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { auth } from '../auth'; // Better Auth instance
import { db } from '../db';
import { memberships, organizations } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  // 1. Resolve Session from Better Auth cookie
  const session = await auth.api.getSession({ headers: req.headers });
  
  // 2. Extract Organization Context from Headers
  const orgSlug = req.headers['x-organization-slug'] as string | undefined;

  let membership = null;
  let organization = null;

  // 3. Resolve Organization and Membership if orgSlug is provided
  if (session && orgSlug) {
    const [foundOrg] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (foundOrg) {
      organization = foundOrg;
      const [foundMember] = await db
        .select()
        .from(memberships)
        .where(
          and(
            eq(memberships.userId, session.user.id),
            eq(memberships.organizationId, foundOrg.id)
          )
        )
        .limit(1);
      
      if (foundMember) {
        membership = foundMember;
      }
    }
  }

  return {
    db,
    session,
    organization,
    membership,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

---

## 3. tRPC Procedure Builders

Procedures enforce authorization boundaries at the API gateway layer, preventing data leaks.

- **`publicProcedure`:** Unauthenticated endpoints (e.g. login, system checks).
- **`protectedProcedure`:** Authenticated endpoints requiring a valid session.
- **`orgProcedure`:** Authenticated and scoped to a specific organization. Requires a valid membership.
- **`orgAdminProcedure`:** Requiring administrative rights inside the scoped organization.

```typescript
// apps/api/src/trpc/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Enforce Session Authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

// Enforce Organization Membership
export const orgProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.organization || !ctx.membership) {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'You are not a member of this organization' 
    });
  }
  return next({
    ctx: {
      ...ctx,
      organization: ctx.organization,
      membership: ctx.membership,
    },
  });
});

// Enforce Administrative Permissions
export const orgAdminProcedure = orgProcedure.use(({ ctx, next }) => {
  if (ctx.membership.role !== 'admin' && ctx.membership.role !== 'owner') {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'Admin privileges required' 
    });
  }
  return next({ ctx });
});
```

---

## 4. WebSocket Upgrade Handshake Authentication

For real-time transport (e.g. Chat WebSockets), authentication must happen during the HTTP upgrade handshake using standard browser cookies. We do not pass session tokens as URL queries unless cookies are disabled (mobile/CLI/API clients).

```typescript
// apps/api/src/realtime/websocket.ts
import { WebSocketServer } from 'ws';
import { parse as parseCookie } from 'cookie';
import { auth } from '../auth';

export function setupWebSocketServer(httpServer: any) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', async (request: any, socket: any, head: any) => {
    // 1. Parse Cookies from Request Headers
    const cookies = parseCookie(request.headers.cookie || '');
    
    // Better Auth session cookie name defaults to "better-auth.session_token"
    const sessionToken = cookies['better-auth.session_token'];

    if (!sessionToken) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    try {
      // 2. Validate Session directly with Better Auth engine
      const session = await auth.api.validateSession({
        token: sessionToken,
      });

      if (!session) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      // 3. Complete Handshake and attach User to connection socket
      wss.handleUpgrade(request, socket, head, (ws) => {
        (ws as any).user = session.user;
        wss.emit('connection', ws, request);
      });

    } catch (err) {
      socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
      socket.destroy();
    }
  });
}
```

---

## 5. Use-Case / Action Separation

To keep tRPC procedures readable and maintainable, we separate orchestration (authorization, request parsing) from execution (business logic, database mutations).

- **tRPC Procedure Role:** Authenticates request, parses headers, runs input validation (Zod), and handles transaction boundaries.
- **Use-Case Action Role:** A single-purpose service class or function that performs database updates, dispatches events, and sends notifications.

Example Flow:
```typescript
// apps/api/src/trpc/routers/issues.ts
import { orgProcedure } from '../trpc';
import { createIssueSchema } from '../../db/schema/issues';
import { CreateIssueAction } from '../../services/issues/create-issue';

export const issuesRouter = router({
  create: orgProcedure
    .input(createIssueSchema.omit({ organizationId: true }))
    .mutation(async ({ ctx, input }) => {
      // Logic belongs in Action layer
      return await CreateIssueAction.execute(ctx.db, {
        ...input,
        organizationId: ctx.organization.id,
        actorId: ctx.membership.id,
      });
    }),
});
```
This guarantees backend modularity and simplifies standalone unit-testing of core business workflows.
