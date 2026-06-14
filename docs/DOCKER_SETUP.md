# Docker & Compose Setup Guide 🐳

This guide walks you through setting up, configuring, and running the containerized Stried application stack using Docker Compose.

---

## 📋 System Requirements
Before starting, ensure you have the following installed on your machine:
* **Docker Desktop** (version 20.10+ or higher)
* Free local ports: `3000` (Frontend), `3002` (Backend API), `5555` (Prisma Studio), and `5433` (PostgreSQL Host Port)

---

## ⚙️ Step 1: Environment Setup

1. Open your terminal at the root of the project (`stried/`).
2. Copy the sample environment profile:
   ```bash
   cp .env.sample .env
   ```
3. Configure your database provider inside `.env`:

### Option A: Local Container Database (Default - Recommended)
Leave the default settings as-is. Docker Compose will automatically boot a local PostgreSQL instance, apply migrations, generate the client, auto-seed the database if it's empty, and hook up the backend:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/stried
```

### Option B: Cloud Database Provider (Neon, Supabase, etc.)
Paste your cloud provider connection URL. The application will automatically connect to it and deploy the schema:
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-blue-flower-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 🚀 Step 2: Running the Stack (One Command Workflow)

Run the single docker command to build images, configure services, and spin up all processes concurrently:
```bash
docker compose up --build
```
> **Note:** There is **no need** to install Node.js modules or run `pnpm run dev` on your host machine. Docker will manage all dependencies, run migrations, and automatically seed the database on its first startup.

---

## 🌐 Ports & Access Endpoints

Once the containers are booted successfully, you can access all components of the application stack using the following addresses:

| Component | Host URL / Port | Accessible From | Description |
| :--- | :--- | :--- | :--- |
| 💻 **Frontend Web App** | **[http://localhost:3000](http://localhost:3000)** | Web Browser | Next.js Stried UI application |
| ⚡ **Backend REST API** | **[http://localhost:3002](http://localhost:3002)** | API Clients / Postman | Express REST API server (`/api/v1`) |
| 📸 **Prisma Studio (GUI)** | **[http://localhost:5555](http://localhost:5555)** | Web Browser | Interactive Database viewer/editor |
| 🐘 **PostgreSQL Database** | **`localhost:5433`** | DB Clients (DBeaver/pgAdmin) | Mapped database port (maps `5433` -> `5432`) |

---

## 🔒 SaaS Production Optimizations Built-In

Our configuration is built with professional enterprise-grade SaaS practices:
1. **Ultra-Lightweight Builds (Next.js Standalone):** We leverage Next.js `standalone` build output, reducing the web production image size from **1.2GB+ down to ~150MB** by copying only the dependency traces.
2. **Non-Root Execution:** For enhanced security compliance, all runner images execute under non-root users (`nodejs` / `nextjs`) instead of root.
3. **Smart Seeding:** The backend container automatically detects if the database contains existing users. If empty, it runs the seeder script. If data already exists, it skips seeding to protect your development data.
4. **Prisma 7 Compatibility:** The entrypoint executes commands in filtered package contexts so Prisma 7 can successfully resolve the `prisma.config.js` file.

---

## 🧪 Step 3: Verification Checklist

Verify that the stack is 100% operational:
1. **Access the Web App:** Open [http://localhost:3000](http://localhost:3000).
2. **Log In:** Use one of the automatically seeded test accounts:
   * **Standard User:**
     * **Email:** `test@example.com`
     * **Password:** `password123`
   * **Admin User:**
     * **Email:** `admin@example.com`
     * **Password:** `password123`
3. **Inspect the Database:** Open [http://localhost:5555](http://localhost:5555) to view Prisma Studio and inspect the `User`, `Task`, and `ActivityLog` tables.

---

## 🛠️ Troubleshooting & Commands

### How to Stop the Containers:
Press `Ctrl+C` in the running terminal, or run:
```bash
docker compose down
```

### How to Wipe Data / Reset Database:
To perform a clean reset of the local PostgreSQL container volume:
```bash
docker compose down -v
```

### How to Restart (Without Rebuilding):
If you have already built the containers, you can start them up instantly (in ~1 second) without running the long build process:
```bash
docker compose up
```
*(Any local code edits you make are automatically synced inside the running containers without needing a rebuild, thanks to Docker volumes).*

---

## 💻 Local Development (Outside Docker)

If you prefer to run the application directly on your host machine:

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development workspace:
   ```bash
   pnpm run dev
   ```
   *This command leverages **Turborepo** to launch the **Next.js Frontend**, the **Express API**, and **Prisma Studio** concurrently with a single command!*
3. Open **[http://localhost:5555](http://localhost:5555)** to view Prisma Studio locally.

