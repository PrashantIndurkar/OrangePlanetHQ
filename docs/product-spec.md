# OrangePlanet — Product Vision & Specification

> **This is the foundational context document for the entire repository.**  
> Every architecture doc, AGENTS.md, feature spec, and AI session draws from this file.  
> If something is not in this document, it is not part of the product scope.

---

## 1. What Is OrangePlanet?

**OrangePlanet is an all-in-one workspace platform for engineering teams.** It combines project management, team chat, collaborative documents, calendar, video calls, and notifications into a single unified experience.

### Core Thesis

> Modern engineering teams use 5-7 separate tools (Linear, Slack, Notion, Google Calendar, Zoom, GitHub, email). OrangePlanet unifies the core workflows into one workspace where everything is connected — an issue links to a chat thread, a document references a task, a call creates meeting notes, and all of it lives under one organization.

### Product DNA

| Dimension               | OrangePlanet's Position                                                                                                      |
| -------------------------| ------------------------------------------------------------------------------------------------------------------------------|
| **Primary inspiration** | Campsite (architecture + patterns), Linear (issue tracking UX), Slack (real-time communication), Notion (docs + knowledge)   |
| **Tech stack identity** | Node.js / Express / TypeScript / Drizzle — NOT Rails. Same architecture principles as Campsite, different runtime.           |
| **Design language**     | Zero-radius, brand orange (#FF591E), Plus Jakarta Sans, dark-mode-first, semantic token system                               |
| **Build philosophy**    | From-scratch / core-first. No third-party services for core features (realtime, auth, calls). Build to learn, build to ship. |
| **Target fidelity**     | 60-70% of each tool's core — not a toy demo, not a perfect clone. The 60-70% that matters most to daily engineering work.    |

### Why It Exists

1. **Learning** — Become a senior full-stack engineer by building every layer: frontend, backend, database, realtime, infra, CI/CD, Docker, system design
2. **Portfolio** — A comprehensive, interview-ready SaaS that demonstrates production architecture and engineering judgment
3. **Product** — A real, deployable, open-source workspace that teams can self-host or use as cloud SaaS
4. **Teaching** — A source of truth for junior developers on how to build modern applications with AI

---

## 2. Target Users

| Segment | Description |
|---|---|
| **Primary** | Engineering teams inside companies (5-50 people) who want a unified workspace |
| **Secondary** | Remote teams and distributed companies needing async + sync communication |
| **Tertiary** | Solo developers and indie hackers who want one tool instead of five |
| **Meta** | Junior/mid developers studying the codebase to learn production SaaS architecture |

---

## 3. Product Modules (The Full Vision)

OrangePlanet is composed of **6 core modules** that share a unified workspace, auth system, organization model, and real-time layer.

### Module Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        OrangePlanet Workspace                   │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │  📋 Tasks  │ │  💬 Chat  │ │  📝 Docs  │ │ 📅 Calendar│       │
│  │  (Linear)  │ │  (Slack)  │ │ (Notion)  │ │ (Notion   │       │
│  │           │ │           │ │           │ │  Calendar) │       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │  📹 Calls  │ │  📥 Inbox │ │ 👥 People │ │ 🔌 Integr. │       │
│  │  (Native)  │ │(Notific.) │ │(Directory)│ │(GitHub etc)│       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              🏢 Organization / Auth / Billing            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Module 1: 📋 Tasks / Issues (Linear 60-70%)

**Reference:** Linear

| Feature | Priority | Status |
|---|---|---|
| Issue CRUD with title, description (rich text), status, priority, due date | P0 | ✅ Built |
| Status workflow: backlog → todo → in-progress → done → canceled | P0 | ✅ Built |
| Priority levels: urgent, high, medium, low, no-priority | P0 | ✅ Built |
| Auto-incrementing issue numbers per workspace (team slug prefix) | P0 | 🟡 Partial (OPH hardcoded, needs dynamic slug) |
| List view + Board/Kanban view | P0 | ✅ Built |
| Filtering by status, priority, assignee, due date | P0 | ✅ Built |
| Search across issues | P0 | ✅ Built |
| Sorting (by date, priority, status) | P0 | ✅ Built |
| Pagination | P0 | ✅ Built |
| Optimistic UI updates with rollback | P0 | ✅ Built |
| Activity log per issue | P1 | 🟡 Schema exists, partially wired |
| Issue comments with rich text | P1 | ❌ Not started |
| Issue labels/tags | P1 | ❌ Not started |
| Issue relations (blocks, blocked by, relates to) | P2 | ❌ Not started |
| Issue templates | P2 | ❌ Not started |
| Cycles/Sprints | P2 | ❌ Not started |
| Sub-issues | P2 | ❌ Not started |
| Bulk operations | P2 | ❌ Not started |
| Keyboard shortcuts (j/k navigation, cmd+k) | P1 | 🟡 Cmd+K exists |
| Views (saved filters) | P2 | ❌ Not started |

---

### Module 2: 💬 Chat / Messaging (Slack 60-70%)

**Reference:** Slack, Campsite's MessageThread model

| Feature | Priority | Status |
|---|---|---|
| Organization channels (public/private) | P0 | ❌ Not started |
| Direct messages (1:1 and group DMs) | P0 | ❌ Not started |
| Threaded replies | P0 | ❌ Not started |
| Rich text messages (Tiptap editor) | P0 | ❌ Not started |
| File/image attachments in chat | P1 | ❌ Not started |
| Emoji reactions | P1 | ❌ Not started |
| Typing indicators | P1 | ❌ Not started |
| Message editing and deletion | P1 | ❌ Not started |
| Unread message counts and badges | P1 | ❌ Not started |
| Message search | P1 | ❌ Not started |
| Pinned messages | P2 | ❌ Not started |
| Message bookmarks | P2 | ❌ Not started |
| @mentions (users, channels) | P1 | ❌ Not started |
| Online/offline presence indicators | P1 | ❌ Not started |
| Notification preferences per channel | P2 | ❌ Not started |

---

### Module 3: 📝 Docs / Notes (Notion 60-70%)

**Reference:** Notion, Campsite's Note model

| Feature | Priority | Status |
|---|---|---|
| Rich document editor (Tiptap + Yjs for collaboration) | P0 | ❌ Not started |
| Real-time collaborative editing (CRDT/Yjs) | P0 | ❌ Not started |
| Document organization (nested pages/folders or flat with tags) | P1 | ❌ Not started |
| Document sharing and permissions | P1 | ❌ Not started |
| Document comments (inline and page-level) | P1 | ❌ Not started |
| Document history/versions | P2 | ❌ Not started |
| Document templates | P2 | ❌ Not started |
| Public sharing with link | P2 | ❌ Not started |
| Embed support (YouTube, Figma, etc.) | P2 | ❌ Not started |
| Table of contents | P2 | ❌ Not started |
| Export (Markdown, PDF) | P3 | ❌ Not started |

---

### Module 4: 📅 Calendar (Notion Calendar 60-70%)

**Reference:** Notion Calendar, Google Calendar

| Feature | Priority | Status |
|---|---|---|
| Day/week/month views | P1 | ❌ Not started |
| Create/edit/delete events | P1 | ❌ Not started |
| Link events to tasks/issues | P1 | ❌ Not started |
| Recurring events | P2 | ❌ Not started |
| Event reminders/notifications | P2 | ❌ Not started |
| Team availability view | P2 | ❌ Not started |
| Calendar integration (Google Calendar sync) | P3 | ❌ Not started |
| Time zone support | P2 | ❌ Not started |

---

### Module 5: 📹 Calls / Video (Native, No Third Party)

**Reference:** Campsite Calls, Slack Huddles

| Feature | Priority | Status |
|---|---|---|
| Voice calls (1:1 and group) | P1 | ❌ Not started |
| Video calls with camera | P1 | ❌ Not started |
| Screen sharing | P1 | ❌ Not started |
| Call recording | P2 | ❌ Not started |
| Call transcription (AI-generated) | P3 | ❌ Not started |
| Call rooms within projects/channels | P1 | ❌ Not started |
| Quick huddle/instant calls | P2 | ❌ Not started |

> [!NOTE]
> Calls use native WebRTC — no Zoom/Twilio/100ms. This is complex but aligned with the "from-scratch" learning philosophy. A WebRTC signaling server will be needed (built with WebSocket).

---

### Module 6: 📥 Inbox / Notifications

**Reference:** Campsite Inbox, Linear Inbox

| Feature | Priority | Status |
|---|---|---|
| Unified notification inbox | P0 | ❌ Route exists, no backend |
| Notification for: mentions, assignments, comments, DMs | P0 | ❌ Not started |
| Mark as read/unread/archived | P1 | ❌ Not started |
| Notification preferences (per channel/project) | P2 | ❌ Not started |
| Email notification digests | P2 | ❌ Not started |
| Web push notifications | P2 | ❌ Not started |
| Notification schedule (do not disturb) | P3 | ❌ Not started |

---

### Cross-Module Features

| Feature | Scope | Priority |
|---|---|---|
| **Organization model** (Campsite pattern: Org → Membership → User) | Global | P0 |
| **Auth** (signup, login, Better Auth context, sessions) | Global | P0 — partially built |
| **Roles & Permissions** (admin, member, viewer, guest) | Global | P0 |
| **People directory** (member profiles, online status, timezone) | Global | P1 |
| **File uploads** (images, files → cloud storage) | Global | P0 — ✅ Built (Cloudinary) |
| **Real-time infrastructure** (native WebSocket) | Global | P0 — ❌ Not started |
| **Search** (global search across tasks, messages, docs) | Global | P1 |
| **Integrations** (GitHub, Slack, Linear webhooks) | Global | P2 |
| **Billing / Subscriptions** (Stripe, free + paid plans) | Global | P2 |
| **Telemetry & Observability** (Sentry exception tracking + PostHog metrics/flags) | Global | P1 — ❌ Not started |
| **Settings** (org settings, user preferences, theme) | Global | P1 |
| **Dark mode** | Global | P0 — ✅ Built |
| **i18n** (internationalization from the start) | Global | P1 |
| **Command palette** (Cmd+K global search/actions) | Global | P1 — 🟡 Basic exists |
| **Keyboard shortcuts** (vim-style navigation) | Global | P1 |
| **Webhooks** (outgoing webhooks for external integrations) | Global | P3 |
| **API documentation** (public API for integrations) | Global | P3 |

---

## 4. Organization & Data Model (Campsite Pattern)

```
User (global identity — can belong to multiple orgs)
  └── OrganizationMembership (role: admin | member | viewer | guest)
        └── Organization (identified by slug, e.g., /acme)
              ├── Projects (channels/spaces within the org)
              │     ├── Tasks/Issues
              │     ├── Posts (async updates)
              │     ├── Notes/Docs
              │     ├── Call Rooms
              │     └── Project Memberships
              ├── Message Threads (DMs + group chats)
              │     ├── Messages
              │     └── Thread Memberships
              ├── Tags / Labels
              ├── Integrations (GitHub, Slack, Linear)
              ├── Organization Settings
              ├── Organization Invitations
              └── Billing / Subscription
```

**Key design decisions:**
- **Decoupled Identity:** Every database table uses UUIDv7 as its primary key. These UUIDs remain strictly internal for foreign keys and joins, and are never exposed in user-facing routes.
- **Public Human-Readable Identifiers:** User-facing resources use readable identifiers. Issues use the `{WORKSPACE_KEY}-{NUMBER}` format (e.g. `PLO-24`), projects and channels use org-scoped unique slugs (e.g., `/project/mobile-app`), and docs use `slug-shortId`.
- **Soft deletes** — Use `deletedAt` timestamp, not hard DELETE.
- **Everything org-scoped** — Every query filters by organization. No cross-tenant data leaks.
- **Roles** — admin (full access), member (create/edit own), viewer (read only), guest (limited access to specific projects).

---

## 5. Build Order (Phased Roadmap)

### Phase 1 — Foundation (Current → Next)
> Core workspace, organization model, auth, tasks

- [ ] Migrate to Drizzle ORM
- [ ] Implement Organization model (Campsite pattern)
- [ ] Refactor auth for Better Auth integrations (with Org plugin)
- [ ] Refactor tasks to be org-scoped with dynamic team slug prefix
- [ ] Implement roles & permissions (admin, member, viewer, guest)
- [ ] Build `packages/ui` design system (Campsite model — directory-per-component) with Storybook
- [ ] Add service layer (Hybrid pattern: services + use-cases)
- [ ] Add Sentry error telemetry & PostHog configuration placeholders
- [ ] Set up i18n infrastructure

### Phase 2 — Communication
> Chat, messaging, real-time infrastructure

- [ ] Build WebSocket infrastructure (native)
- [ ] Implement message threads (channels + DMs)
- [ ] Implement messages with rich text (Tiptap)
- [ ] Typing indicators, presence, unread counts
- [ ] @mentions system

### Phase 3 — Knowledge
> Documents, notes, collaborative editing

- [ ] Tiptap + Yjs collaborative editor
- [ ] Document CRUD within projects
- [ ] Document permissions and sharing
- [ ] Document comments

### Phase 4 — Meetings & Time
> Calls, calendar, scheduling

- [ ] WebRTC signaling server for calls
- [ ] Voice/video calls within projects
- [ ] Screen sharing
- [ ] Calendar views (day/week/month)
- [ ] Events linked to tasks

### Phase 5 — Intelligence & Integrations
> Notifications, search, integrations, AI features

- [ ] Unified notification inbox
- [ ] Global search (tasks + messages + docs)
- [ ] GitHub integration
- [ ] Webhook system
- [ ] AI-powered features (summarization, search)

### Phase 6 — Business & Scale
> Billing, admin, data export, public API

- [ ] Stripe billing integration
- [ ] Admin panel
- [ ] Data export
- [ ] Public API with documentation
- [ ] Self-hosting guide

---

## 6. Architecture Decisions Approved

- **Monorepo:** Single Monorepo (pnpm workspaces + Turborepo)
- **Frontend App Structure:** Single Next.js app (all features grouped under `src/features`)
- **API Framework:** Express 5 + tRPC Hybrid (tRPC for Next.js internal calls, Express for public routes)
- **Auth Strategy:** Better Auth (with Organization plugin)

---

## 7. Deployment Model

Following the **Cal.com model**:

| Aspect | Strategy |
|---|---|
| **Open Source** | MIT or AGPL license, full source available on GitHub |
| **Cloud SaaS** | Hosted version with free tier + paid plans (Stripe) |
| **Self-Hosted** | Docker Compose for self-hosting, comprehensive setup guide |
| **Interview Portfolio** | Public README explaining architecture decisions, all docs visible |

---

## 8. Tech Stack (Final)

| Layer | Technology |
|---|---|
| **Monorepo** | pnpm workspaces + Turborepo |
| **Frontend** | Next.js (App Router), React 19, TailwindCSS v4, Zustand + TanStack Query |
| **Backend** | Express 5 (ESM), Node.js ≥22, TypeScript |
| **ORM** | Drizzle ORM |
| **Database** | PostgreSQL |
| **Auth** | Better Auth (Drizzle adapter + Org plugin) |
| **Realtime** | Native WebSocket (chat, presence, calls, notifications) |
| **Rich Editor** | Tiptap v3 + Yjs (collaborative editing) |
| **Video/Calls** | WebRTC (native signaling server) |
| **Design System** | `packages/ui` (Campsite model — directory-per-component) with Storybook |
| **File Storage** | S3-compatible (Cloudinary for now) |
| **Background Jobs** | BullMQ + Redis |
| **Telemetry & Flags** | Sentry (Error tracking) + PostHog (Session replays, flags, analytics) |
| **Search** | PostgreSQL full-text search initially, Meilisearch later |
| **Email** | Nodemailer + React Email (using Resend SMTP) |
| **Linting** | Biome (formatting) + ESLint (semantic rules) |
| **Testing** | Vitest (unit/integration) + Playwright (E2E) |
| **CI/CD** | GitHub Actions |
| **Containerization** | Docker Compose |
| **i18n** | From the start (infrastructure in place) |
| **Icons** | HugeIcons |
| **Fonts** | Plus Jakarta Sans (body), Geist Mono (code) |

---

## 9. Reference Codebases

| Codebase | Path | What to Learn |
|---|---|---|
| **Campsite** | `/campsite/` | Architecture, multi-tenancy, UI patterns, component structure, serialization, authorization policies, background jobs, real-time events |
| **Sharkord** | `/sharkord/` | Native WebSocket setups, WebRTC/Mediasoup rooms, chat data models |

---

## 10. Changelog

| Date | Change |
|---|---|
| 2026-06-28 | Initial product spec created from repository audit + user discussions |
| 2026-06-29 | Updated spec to reflect Better Auth, tRPC+Express hybrid API, and Sentry/PostHog integrations |
