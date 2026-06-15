# 🗄️ Database Design & Schema Specifications

This document outlines the schema design, tables, relationships, integrity rules, and database seeding strategy of Stride.

---

## 🗺️ Schema Design (Entity-Relationship Model)

Stride uses **PostgreSQL** configured via the **Prisma ORM**. The database is structured into three primary tables: `User`, `Task`, and `ActivityLog`.

```text
  ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
  │      User       │             │      Task       │             │   ActivityLog   │
  ├─────────────────┤             ├─────────────────┤             ├─────────────────┤
  │ PK id (UUID)    ├─┐           │ PK id (UUID)    ├─┐           │ PK id (UUID)    │
  │ email (Unique)  │ │           │ issueNumber     │ │           │ taskId (FK)     │
  │ passwordHash    │ │           │ title           │ └──────────►│ userId          │
  │ name            │ └──────────►│ userId (FK)     │             │ userName        │
  │ role (user/admin)│             │ status          │             │ userInitials    │
  │ createdAt       │             │ priority        │             │ actionText      │
  │ updatedAt       │             │ dueDate         │             │ timestamp       │
  └─────────────────┘             │ createdAt       │             └─────────────────┘
                                  │ updatedAt       │
                                  └─────────────────┘
```

---

## 🗂️ Model Definitions & Constraints

### 1. The `User` Model
Represents the accounts registered on the platform.
- **`id`**: String, UUID format. Primary Key.
- **`email`**: String, unique index. Used during login.
- **`passwordHash`**: String. Hashed representation of passwords (using `bcryptjs` with 10 salt rounds).
- **`role`**: String, defaults to `"user"`. Determines access level. Can be `"user"` or `"admin"`.

### 2. The `Task` Model
Represents the individual tasks or issues created by users.
- **`id`**: String, UUID. Primary Key.
- **`issueNumber`**: Integer. Used to render task identifiers like `STR-1`, `STR-2` in the UI.
- **`title`**: String. Form validated (minimum 1 character).
- **`status`**: String, defaults to `"todo"`. Enum constraint: `backlog` | `todo` | `in-progress` | `in-review` | `done` | `canceled`.
- **`priority`**: String, defaults to `"no-priority"`. Enum constraint: `urgent` | `high` | `medium` | `low` | `no-priority`.
- **`dueDate`**: DateTime, optional.
- **`userId`**: String. Foreign Key linking to `User`.

#### Database-Level Integrity Constraints:
- **`@@unique([userId, issueNumber])`**: A unique constraint applied across the user ID and task issue number. This ensures that every user has a separate, non-overlapping task counter starting at `1`. Task numbers cannot conflict between different users.
- **Cascading Delete (`onDelete: Cascade`)**: When a User record is deleted, the database automatically cascades the delete to remove all associated Task records. This prevents orphaned records and speeds up test database cleanups.

### 3. The `ActivityLog` Model
Represents audit logs tracking property changes made to a task (e.g., status changes or assignments).
- **`id`**: String, UUID. Primary Key.
- **`taskId`**: String. Foreign Key linking to `Task`.
- **`userId`**: String. ID of the user who performed the action.
- **`userName`**: String. Name of the actor.
- **`userInitials`**: String. Extracted initials used for rendering avatars.
- **`actionText`**: String. Description of the mutation (e.g., `changed status to in-progress`).
- **`timestamp`**: DateTime. Defaults to `now()`.

#### Database-Level Integrity Constraints:
- **Cascading Delete (`onDelete: Cascade`)**: When a Task is deleted, the database automatically cascades to delete all linked ActivityLog entries.

---

## 🌱 Database Seeding & Development Accounts

The database seed script is located at [seed.ts](file:///Users/prashantindurkar/Code/Interviews/Assesment%20Rival/stride/apps/api/prisma/seed.ts).

### Idempotent Seeding Guard (Protection Strategy)
Running seeders in Docker environments can cause duplicate entries or primary key crashes if the container restarts. To prevent this, Stride implements an **idempotent check** at the entry of the seeder script:
```ts
// apps/api/prisma/seed.ts
const userCount = await prisma.user.count();
if (userCount > 0) {
  console.log("⚠️ Database already seeded. Skipping seeder run.");
  return;
}
```
If the database contains any users, the script stops execution immediately. 

### Seed Accounts Created:

| Email | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| **`test@example.com`** | `password123` | `user` | Standard workspace user account |
| **`admin@example.com`** | `password123` | `admin` | Admin override account |

---

## 🔄 Database Command Reference

Run these commands inside the `apps/api` folder:

- **Generate Client:** Re-compiles types after schema edits.
  ```bash
  npx prisma generate
  ```
- **Apply Migration (Development):** Creates and runs SQL migrations locally.
  ```bash
  npx prisma migrate dev
  ```
- **Deploy Migrations (Production/CI):** Runs migrations against target databases.
  ```bash
  npx prisma migrate deploy
  ```
- **Open Prisma Studio:** Interactively view/edit records inside the browser.
  ```bash
  npx prisma studio --port 5555
  ```
