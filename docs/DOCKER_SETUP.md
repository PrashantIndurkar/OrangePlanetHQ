# 🐳 Docker & Compose Containerization Setup Guide

This guide walks you through configuring, building, running, and troubleshooting the containerized Stried application stack using Docker Compose.

---

## 🏗️ Docker Services Architecture

The application is containerized using three main services defined in the root [docker-compose.yml](file:///Users/prashantindurkar/Code/Interviews/Assesment%20Rival/stried/docker-compose.yml):

```text
                       [Browser Access: http://localhost:3000]
                                         │
                                         ▼
                            ┌────────────────────────┐
                            │     web Container      │
                            │   (Next.js Web App)    │
                            └────────────┬───────────┘
                                         │
                        HTTP requests    │ (Private Network)
                                         ▼
                            ┌────────────────────────┐
                            │     api Container      │
                            │   (Express REST API)   │
                            └────────────┬───────────┘
                                         │
                      Prisma queries     │ (Private Network)
                                         ▼
                            ┌────────────────────────┐
                            │      db Container      │
                            │  (Postgres Database)   │
                            └────────────────────────┘
```

1. **`db` (Postgres Database):** Ephemeral database container using the official PostgreSQL 16 image. It maps local data volumes to persist databases across container shutdowns.
2. **`api` (Express REST API):** Containerizes the backend service. It automatically waits for the database, runs schema migrations, generates the Prisma client, and seeds initial data.
3. **`web` (Next.js Frontend):** Containerizes the frontend client. Configured to run in production mode to test production-like runtime behavior.

---

## ⚡ SaaS Production Optimizations Built-In

Stried's Dockerfiles are built following industry-best production SaaS containerization practices:

### A. Next.js Standalone Multi-Stage Builds (`apps/web/Dockerfile`)
Standard Next.js builds include large packages, development compiler files, and tooling assets, resulting in images exceeding **1.2GB**.
Stried utilizes Next.js **Standalone Build Output**:
1. It analyzes the dependency graph during the build stage and traces only the files required to run in production.
2. It outputs a lightweight server file in `.next/standalone`.
3. The runner stage only copies this standalone output, reducing the final image size to **~150MB** (an 85%+ decrease).

### B. Non-Root Execution Security compliance
To prevent host system takeover in case of container escape vulnerabilities, all service images execute under non-root users:
- The `web` container runs under the `nextjs` system user group.
- The `api` container runs under the `nodejs` system user group.

### C. Automatic Health Verification and Seeding
The backend container entrypoint script (`apps/api/docker-entrypoint.sh`):
1. Polls the PostgreSQL socket until database handshakes succeed.
2. Automatically deploys missing database schema migrations.
3. Checks if the database is blank. If it has no users, it runs the seeder script. If it already contains records, it skips seeding to protect active development data.

---

## ⚙️ Quick Start Guide (One-Command Boot)

### 1. Configure the Environment
Copy the configuration template to `.env`:
```bash
# Run at the root of the stried/ directory
cp .env.example .env
```
Leave the default settings as-is. The defaults are already optimized to bind the backend to the database and link the frontend to the backend inside the Docker network.

### 2. Boot the Application Stack
Execute the build and run command:
```bash
docker compose up --build
```
> [!TIP]
> **No host dependencies required:** There is no need to run `pnpm install` or have Node.js installed on your computer. Docker downloads, configures, compiles, and links all dependencies inside the container network.

### 3. Verify Endpoints
Once the build concludes and containers start, access the services:

- **Web Frontend:** [http://localhost:3000](http://localhost:3000)
- **REST API Server:** [http://localhost:3002/api/v1](http://localhost:3002/api/v1)
- **Prisma Studio (GUI):** [http://localhost:5555](http://localhost:5555)

Log in using the seeded test accounts:
- **Standard Account:** `test@example.com` / `password123`
- **Admin Account:** `admin@example.com` / `password123`

---

## 🛠️ Docker Compose Command Reference

- **Stop Services:** Stops containers without losing database data.
  ```bash
  docker compose down
  ```
- **Wipe Database & Reset:** Shuts down containers and deletes the Postgres persistent volume. Useful to test seed scripts or migrate schemas from scratch.
  ```bash
  docker compose down -v
  ```
- **Instant Restart (No Rebuilding):** If dependencies have not changed, boot in 1 second.
  ```bash
  docker compose up
  ```
- **View Container Logs:**
  ```bash
  docker compose logs -f
  ```
