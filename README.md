# ⚡ Stride

A modern full-stack task management platform inspired by Linear, designed for side projects and productivity-focused workflows. Built with Next.js, Express, PostgreSQL, and Prisma, it delivers real-time task updates, JWT authentication, advanced search and filtering, activity logs, file attachments, dark mode, and a responsive user experience. Optimized for speed, simplicity, and developer-friendly workflows.

![Stride](https://github.com/user-attachments/assets/aa55b3aa-74f0-4cd3-9700-4075e1fb3ab0)

🎥 **Demo Video:**  
[Google drive link 🔗](https://drive.google.com/file/d/12-k0vCzGlvKSxsatS2DjUzYobf3vNlk3/view?usp=sharing)

🌐 **Live Demo:**  
[Live URL 🌐](https://stride-web-kldi.onrender.com)

Welcome to **Stride**, a production-grade, highly responsive task manager monorepo built using **Next.js (App Router)**, **Express (Node.js)**, **Prisma ORM**, and **PostgreSQL**.

Stride is structured to represent professional software engineering patterns used by scaling SaaS teams (such as **Linear** and **Vercel**), featuring decoupled client-server architecture, database-level tenant isolation, automated CI/CD pipelines, and optimized containerized environments.

---

---

## 📖 Project Overview

Stride is a fast, keyboard-shortcut-driven issue and task tracker modeled after modern workflows. Designed with visual excellence and responsiveness in mind, it provides a seamless user experience for managing software tasks, tracking audit histories, and organizing collaboration boundaries. The project highlights core engineering values: strict type safety, modular backend design, tenant data isolation, and low latency through local caching and optimistic frontend states.

---

## 🏗️ Architecture Overview

Stride decouples client-side presentation from backend business logic within a Turborepo monorepo:

```text
       ┌──────────────────────────────────────────────────────────┐
       │                   Next.js Frontend                       │
       │                     (apps/web)                           │
       └──────────────────────────┬───────────────────────────────┘
                                  │
                       HTTP REST  │  (JWT Session & SSE)
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

1. **Next.js Web Client (`apps/web`):** Built using the Next.js App Router. Integrates TanStack Query for data caching/synchronization, shadcn/ui for consistent design primitives, and local optimistic hooks for instantaneous UI feedback.
2. **Express API Server (`apps/api`):** Built with Node.js and Express. It follows a Modular Domain Pattern using Controller-Service-Repository (CSR) layers, ensuring strict business and data-access boundaries.
3. **Database Layer:** A PostgreSQL instance queried via Prisma ORM for type-safe database queries.

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

Follow these steps to clone, configure, and boot the entire Stride application stack in under **two minutes**.

### 1. Clone the Repository
Open your terminal and clone the repository, then navigate into the project directory:
```bash
# Clone the repository
git clone https://github.com/PrashantIndurkar/stride.git

# Navigate into the project folder
cd stride
```

### 2. Setup Environment Configuration
Copy the template configuration to create your local `.env` file:
```bash
cp .env.example .env
```
> [!NOTE]
> Our dynamic database configuration automatically translates the database host string depending on where you run the application. There is no need to manually edit `.env` for switching between Docker and local runs!

---

### Option A: The One-Command Docker Setup (Recommended)

This compiles Next.js in production standalone mode, spins up the backend API, boots the PostgreSQL container, applies migrations, and runs seeding automatically.

Run the following command in the root folder:
```bash
docker compose up --build
```

#### What to Expect:
- **Web Frontend:** Accessible at [http://localhost:3000](http://localhost:3000) (Next.js Application).
- **REST API Server:** Running at [http://localhost:3002/api/v1](http://localhost:3002/api/v1).
- **Prisma Studio:** Accessible at [http://localhost:5555](http://localhost:5555) (a visual database GUI).
- **Seeded Accounts:** Default credentials (see below) are automatically seeded.

---

### Option B: Local Development Setup (Fast Hot-Reloads)

Requires Node.js (v22+) and pnpm (v11+).

1. **Install Monorepo Dependencies:**
   Install dependencies across all packages in the Turborepo workspace:
   ```bash
   pnpm install
   ```

2. **Start the Database Container:**
   Spin up the PostgreSQL database container in the background. It will be exposed on port `5433` for your local host machine:
   ```bash
   docker compose up -d db
   ```

3. **Start the Development Workspace:**
   Spins up Next.js client, Express API, and Prisma Studio concurrently:
   ```bash
   pnpm run dev
   ```
   *Note: Our configuration will automatically detect that you are running locally outside Docker and direct connections to the database container via `localhost:5433`.*

4. **What to Expect:**
   - The backend API will boot up on port `3002` (watching for hot reloads).
   - The frontend dev server will start on port `3000`.
   - Prisma Studio will open in the background on port `5555`.

5. **Execute Test Suites (Optional):**
   Run the full HTTP integration test suite to verify the setup:
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

---

## 🔑 Environment Variables

The application is configured using environment variables defined in `.env` (copied from `.env.example`). Below are the primary variables used:

| Variable Name | Description | Default Value | Scope |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Mode of operation (`development`, `production`, `test`) | `development` | Shared |
| `PORT` | Network port for the Express API backend server | `3002` | Backend |
| `JWT_SECRET` | Secret key used to sign and verify JWT sessions | `supersecretjwtkeyassessmentrival123!` | Backend |
| `DATABASE_URL` | Connection URL string for the PostgreSQL database instance | `postgresql://postgres:postgres@db:5432/stride` | Backend |
| `NEXT_PUBLIC_API_URL` | Client-accessible URL endpoint targeting the API server | `http://localhost:3002/api/v1` | Frontend |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name for attachment streaming | *(Optional)* | Backend |
| `CLOUDINARY_API_KEY` | Cloudinary API key for verifying file upload streams | *(Optional)* | Backend |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret for authenticating upload requests | *(Optional)* | Backend |

---

## 🧪 Testing Instructions

Stride features a comprehensive HTTP API integration testing suite using **Vitest** and **Supertest** to test routes, validation logic, controllers, services, and repositories end-to-end against a test database.

### Running Backend Integration Tests

1. Ensure the PostgreSQL container is running:
   ```bash
   docker compose up -d db
   ```
2. Run the full test suite in the root directory:
   ```bash
   pnpm --filter api test
   ```
3. Run Vitest in interactive watch mode for hot-reloaded feedback:
   ```bash
   pnpm --filter api exec vitest
   ```
4. Open the interactive Vitest UI dashboard in your browser:
   ```bash
   pnpm --filter api exec vitest --ui
   ```

---

## ⚖️ Assumptions & Trade-offs

During the architectural design of Stride, several key engineering trade-offs were made:

### 1. Decoupled Client-Server vs. Next.js Monolith
- **Decision:** Split the project into a separate Next.js web app and an Express.js backend API rather than utilizing Next.js Server Actions or inline Route Handlers.
- **Trade-off:** This introduces higher deployment overhead (managing two separate web services and environment configuration) and requires maintaining CORS rules. However, it ensures the frontend can be fully static and CDN-deployed at the Edge, while the backend API can scale independently on standard compute instances without being constrained by Edge runtime limitations.

### 2. Stateless JWT Authentication vs. Database Sessions
- **Decision:** Authenticate requests stateless-ly via JSON Web Tokens (JWT) sent in HTTP Authorization headers.
- **Trade-off:** While stateless JWTs eliminate database lookup latency on every API request (perfect for scalability), they make immediate token invalidation challenging. Without a dedicated blocklist store (e.g., Redis), a compromised token remains valid until it expires.

### 3. Client-Side Optimistic UI vs. Server-State Consistency
- **Decision:** Perform optimistic updates for task operations (creation, updates, deletes) on the client before receiving backend confirmation.
- **Trade-off:** Optimistic updates require duplicating some backend logic on the client (e.g., generating client-side UUIDs, formatting due dates, and manual cache mutations in TanStack Query). If the backend operation fails, the client must safely roll back state, adding complexity to the frontend hooks layer.

### 4. SSE (Server-Sent Events) vs. Full WebSockets
- **Decision:** Use Server-Sent Events (SSE) for unidirectional real-time data sync from the server to the client.
- **Trade-off:** SSE is lightweight, uses standard HTTP, and has built-in browser reconnection support. However, it is strictly server-to-client. Bidirectional operations (e.g., client sending task updates) must still use standard REST API endpoints over HTTP, incurring slightly more packet overhead than persistent duplex WebSockets.

### 5. Prisma ORM vs. Raw SQL / Lightweight Query Builders
- **Decision:** Query PostgreSQL using Prisma ORM.
- **Trade-off:** Prisma significantly improves developer experience, database-agnostic modeling, and schema migrations. However, it carries a larger memory footprint and minor query-building latency overhead compared to raw SQL or lightweight builders like Kysely.

---

## 🌐 Deployment Links

The project is structured to deploy smoothly on **Render** using the configuration in `render.yaml`. 

- **Web Frontend Application:** `https://stride-web.onrender.com`
- **REST API Backend Service:** `https://stride-api.onrender.com/api/v1`
