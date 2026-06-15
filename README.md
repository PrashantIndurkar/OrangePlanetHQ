# 📋 Stride

Welcome to **Stride**, a production-grade, highly responsive task manager monorepo built using **Next.js (App Router)**, **Express (Node.js)**, **Prisma ORM**, and **PostgreSQL**.

Stride is structured to represent professional software engineering patterns used by scaling SaaS teams (such as **Linear** and **Vercel**), featuring decoupled client-server architecture, database-level tenant isolation, automated CI/CD pipelines, and optimized containerized environments.

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

## 🛠️ The Stride Technology Stack

Stride is built as a single monorepo utilizing **pnpm workspaces** and **Turborepo** to orchestrate tasks.

| Layer | Component | Technology | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend** | User Interface | Next.js 16 (App Router) | High-performance page routing, server-side performance hooks, edge-readiness. |
| **Frontend** | Styling & UI | TailwindCSS + shadcn/ui | Atomic utility styling with highly-customizable accessible component primitives. |
| **Frontend** | Client State | TanStack React Query 5 | Manages client caching, request synchronization, and Optimistic UI updates. |
| **Backend** | API Server | Express.js 5 | Lightweight, highly-extensible HTTP routing framework with modular middleware layers. |
| **Database** | ORM Layer | Prisma 7 | Type-safe schema definition, clean model migrations, and native client generation. |
| **Database** | Database Engine | PostgreSQL 16 | Relational reliability, compound indexes, and foreign key cascades. |
| **Storage** | Media Storage | Cloudinary + Multer | Multipart upload ingestion and secure CDN-backed cloud image storage. |
| **Infrastructure** | Containerization | Docker & Compose | Multi-stage image build isolation and local service container linking. |
| **Pipeline** | Automation | GitHub Actions | automated unit/integration runs with Vitest + Supertest and semantic release logs. |

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
2. **Start Dev Workspace:**
   Spins up Next.js client, Express API, and Prisma Studio concurrently using Turborepo filters:
   ```bash
   pnpm run dev
   ```
3. **Execute Test Suites:**
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
