# 📋 Stride
<img width="1557" height="1026" alt="image" src="https://github.com/user-attachments/assets/aa55b3aa-74f0-4cd3-9700-4075e1fb3ab0" />

Welcome to **Stride**, a production-grade, highly responsive task manager monorepo built using **Next.js (App Router)**, **Express (Node.js)**, **Prisma ORM**, and **PostgreSQL**.

Stride is structured to represent professional software engineering patterns used by scaling SaaS teams (such as **Linear** and **Vercel**), featuring decoupled client-server architecture, database-level tenant isolation, automated CI/CD pipelines, and optimized containerized environments.

---

## Tech Stack

### Frontend

* **Next.js 16** – React framework for building a fast, modern, and responsive UI.
* **React 19** – Component-based frontend architecture.
* **TypeScript** – End-to-end type safety and improved developer experience.
* **Tailwind CSS v4** – Utility-first styling for rapid UI development.
* **shadcn/ui** – Accessible and customizable UI components.
* **TanStack Query** – Server state management, caching, and background data synchronization.
* **React Hook Form + Zod** – Form handling with schema-based validation.
* **next-themes** – Persistent dark/light theme support.
* **Sonner** – User-friendly toast notifications.

### Backend

* **Node.js + Express.js**
* **PostgreSQL** – Relational database for task and user data.
* **Prisma ORM** – Type-safe database access and migrations.
* **JWT Authentication** – Secure stateless authentication.
* **bcrypt** – Password hashing and security.

### Development & Tooling

* **Turborepo** – Monorepo management and optimized builds.
* **pnpm** – Fast and efficient package management.
* **Biome** – Linting and formatting.
* **Husky** – Git hooks for code quality checks.
* **GitHub Actions** – Automated testing and CI pipeline.
* **Docker & Docker Compose** – Consistent local development environment.

## Architecture Decisions

* JWT-based authentication for stateless and scalable session management.
* Repository and service layer separation for maintainable backend code.
* Prisma ORM for type-safe database operations.
* TanStack Query for efficient client-side caching and data synchronization.
* Real-time updates implemented using Server-Sent Events (SSE).
* Activity logging system for task audit history.
* File attachment support for task-related documents and images.
* Optimistic UI updates to improve perceived application performance.
* Monorepo structure using Turborepo for scalability and code organization.

## Beyond Assessment Requirements

In addition to the required features, the project includes:

* Real-time task updates (SSE)
* Activity log tracking
* File attachments
* Dockerized setup
* GitHub Actions CI pipeline
* Dark mode with persisted preference
* Optimistic UI updates
* Monorepo architecture with Turborepo
* Type-safe API contracts
* Responsive mobile-first design

---

## ✨ Features

* JWT Authentication & Authorization
* Task CRUD Operations
* Search, Filtering, Sorting & Pagination
* Responsive Mobile-First UI
* Task Detail View
* Activity Timeline
* Real-Time Updates (SSE)
* Optimistic UI Updates
* Image Attachments
* Admin Role Support
* Dark Mode
* Dockerized Development Environment
* GitHub Actions CI/CD
* Type-Safe Validation

<details>
<summary><strong>View Complete Feature List</strong></summary>

### Task Management

* Create, update, view, and delete tasks
* Status management
* Priority levels
* Due dates
* Issue-style task identifiers (`STR-1`, `STR-2`, ...)
* Dedicated task detail page

### Search & Organization

* Full task search
* Status filtering
* Sorting by due date, priority, and creation date
* Pagination support
* Combined search + filter + sort workflows

### Authentication & Security

* Signup and login
* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* User-specific task isolation
* Persistent authentication sessions

### Real-Time Experience

* Server-Sent Events (SSE)
* Live task synchronization across tabs
* Optimistic UI updates
* Automatic cache synchronization

### Collaboration Features

* Activity history tracking
* Task change timeline
* Image attachment support via Cloudinary

### Administration

* Admin role support
* Global task visibility for administrators

### Developer Experience

* Turborepo monorepo architecture
* Docker Compose setup
* GitHub Actions CI pipeline
* Zod schema validation
* Prisma ORM
* PostgreSQL database
* TypeScript throughout the stack
* Seeded demo accounts

</details>

---

## 🚀 Beyond Assignment Requirements

The assessment requirements focused primarily on CRUD operations, authentication, filtering, search, and pagination.

This project goes significantly beyond those requirements by introducing:

* Real-time task updates using Server-Sent Events (SSE)
* Optimistic UI for instant user feedback
* Activity logging and audit history
* Admin role with elevated permissions
* Image attachment support via Cloudinary
* Dark mode with persisted preferences
* Dockerized local development
* GitHub Actions CI/CD automation
* Turborepo monorepo architecture
* End-to-end type safety using TypeScript, Prisma, and Zod
* Human-readable issue identifiers (`STR-*`)
* Live cache synchronization between detail and list views

---

## 🎯 Engineering Highlights

Key architectural decisions made for scalability and maintainability:

* Type-safe frontend and backend contracts
* PostgreSQL + Prisma for reliable relational data modeling
* TanStack Query for caching and synchronization
* Server-Sent Events for lightweight real-time updates
* Monorepo structure for easier scaling and shared tooling
* Docker-based local development consistency
* Automated CI pipeline for quality assurance
* Separation of concerns through modular architecture

---

## 🌟 What Makes This Stand Out

Compared to a typical assessment submission, this project includes:

* Production-style architecture
* Real-time functionality
* Audit history tracking
* Optimistic updates
* CI/CD automation
* Containerized development
* Admin capabilities
* Advanced developer tooling
* Strong focus on type safety and maintainability

The goal was not only to satisfy the assignment requirements, but to demonstrate how the application could evolve into a production-ready task management platform inspired by modern tools such as Linear.

---

## 🚀 X-Factor / Extra Mile

Beyond the core assignment requirements, this project was built with a strong focus on engineering quality, developer experience, automation, and production readiness.

### Engineering & Delivery Enhancements

* 📝 Automated changelog generation for release tracking and project history
* 🔒 Husky + Commitlint for enforcing conventional commits and repository standards
* ⚙️ GitHub Actions CI for automated quality checks and validation
* 🐳 Docker & Docker Compose for one-command local setup and environment consistency
* 🎨 Biome-based linting and formatting for strict code quality enforcement
* 🚀 Render deployment configuration for deployment readiness
* 🤖 CodeRabbit integration for automated code review and feedback
* 🏗️ Turborepo monorepo architecture for scalability and maintainability
* 📂 Clean repository structure with supporting tooling and configuration
* 🔧 Developer-focused workflows designed for easier onboarding and long-term maintenance

### Why It Matters

Rather than treating this as a simple take-home assignment, the goal was to build a codebase that reflects real-world SaaS and production engineering practices—focusing not only on features, but also on maintainability, scalability, automation, and developer experience.

---

## 📖 Complete Documentation Index

To make exploring the codebase as clean as possible, we have split our documentation into focused guides:

| Guide　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　| Description                                                                    | Key Focus Area                                               |
| :---------------------------------------------------------------------| :-------------------------------------------------------------------------------| :-------------------------------------------------------------|
| **🏗️ [Architecture & Software Design](docs/ARCHITECTURE.md)**　　　　| Explains monorepos, modular backend architecture, and frontend state patterns. | Modular Domain pattern, CSR flow, stealth boundaries.        |
| **🗄️ [Database Design & Schemas](docs/DATABASE.md)**　　　　　　　　 | Details PostgreSQL models, constraints, and seeding operations.                | Cascade configurations, unique indexes, seed accounts.       |
| **🧪 [Testing Architecture & Guides](docs/TESTING.md)**　　　　　　　| Covers HTTP integration test structures and assertions.                        | Vitest, Supertest, boundary testing, clean-up strategies.    |
| **🚀 [CI/CD & GitHub Workflows](docs/CICD_WORKFLOWS.md)**　　　　　　 | Explains GitHub Actions setups for linting, testing, and releasing.            | Service containers, test reporting, conventional changelogs. |
| **🐳 [Docker & Compose Environments](docs/DOCKER_SETUP.md)**　　　　 | Walkthrough of container configurations and build pipelines.                   | Multi-stage Next.js standalone builds, non-root users.       |
| **🔑 [API Testing & Endpoint Reference](docs/API_TESTING_GUIDE.md)** | Detailed payload examples and testing flows for all endpoints.                 | JSON structures, error validation envelopes, URL params.     |
| **📂 [Folder Structure Reference](docs/folder-str.md)**　　　　　　　| Layout catalog mapping every directory to its architectural role.              | Monorepo apps and packages.                                  |

---

## 🚀 Quick Start Guide

You can boot the entire application stack in under **two minutes** using either Docker or a local pnpm dev workspace.

### Setup Environment Configuration
Copy the configuration template to `.env`:
```bash
cp .env.example .env
```

### Option A: The One-Command Docker Setup (Recommended)
This boots PostgreSQL, runs database migrations, seeds test accounts, compiles Next.js in production standalone mode, and starts the API:
```bash
docker compose up --build
```
- **Web Frontend:** [http://localhost:3000](http://localhost:3000)
- **REST API Server:** [http://localhost:3002/api/v1](http://localhost:3002/api/v1)
- **Prisma Studio:** [http://localhost:5555](http://localhost:5555)

### Option B: Local Development Setup
Requires Node.js (v22+) and pnpm (v11+).

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```
2. **Start the Database Container:**
   Spins up the PostgreSQL database container in the background (exposed at `localhost:5433` for your host machine):
   ```bash
   docker compose up -d db
   ```
3. **Start Dev Workspace:**
   Spins up Next.js client, Express API, and Prisma Studio concurrently using Turborepo filters:
   ```bash
   pnpm run dev
   ```
4. **Execute Test Suites:**
   Runs the integration test suites:
   ```bash
   pnpm --filter api test
   ```

---

## 🔒 Default Credentials (Seeded Data)

The following local accounts are seeded automatically for testing:

- **Standard Workspace User:**
  - **Email:** `test@example.com`
  - **Password:** `password123`
- **Administrator User:**
  - **Email:** `admin@example.com`
  - **Password:** `password123`
