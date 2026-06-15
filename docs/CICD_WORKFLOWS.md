# 🚀 CI/CD Pipelines & GitHub Actions Workflows Guide

This document details the configuration, capabilities, and execution design of the automated integration pipelines and release processes in Stride.

---

## 🏗️ 1. Continuous Integration Pipeline (`ci.yml`)

The [ci.yml](file:///Users/prashantindurkar/Code/Interviews/Assesment%20Rival/stride/.github/workflows/ci.yml) workflow runs automatically on every pull request and push to critical branches (`main`, `master`, `dev`). It acts as the primary quality gate ensuring that code builds, lint rules pass, and all database integration tests succeed.

```text
[PR / Push Trigger]
       │
       ▼
 ┌───────────┐
 │ Biome Lint│
 └─────┬─────┘
       │ (Pass)
       ▼
 ┌───────────┐      ┌─────────────────────────────┐
 │ Generate  ├─────►│ Spin up PostgreSQL Service  │
 │ Prisma    │      │ (Docker Alpine Container)   │
 └─────┬─────┘      └──────────────┬──────────────┘
       │                           │
       ▼                           ▼
 ┌───────────┐              ┌──────────────┐
 │ Build Web │              │ Run Database │
 │ & API     │              │ Migrations   │
 └─────┬─────┘              └──────┬───────┘
       │                           │
       └─────────────┬─────────────┘
                     │
                     ▼
             ┌──────────────┐
             │ Run Vitest   │ (Generate JUnit reports)
             └──────┬───────┘
                     │
                     ▼
             ┌──────────────┐
             │ PR Check     │ (Inject test status annotations)
             │ Annotation   │
             └──────────────┘
```

### Key Workflow Mechanisms:

#### A. PostgreSQL Service Container (Docker-in-Github)
Rather than mocking the database engine, the CI runner spins up an ephemeral PostgreSQL instance side-car container inside the runner network:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: stride_test
    ports:
      - 5432:5432
    options: >-
      --health-cmd "pg_isready -U postgres -d stride_test"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```
The workflow holds execution until the `pg_isready` command returns a healthy status, guaranteeing that DB queries won't fail due to initial socket boot-up delays.

#### B. Cache Layer Optimization
To keep execution times under **2 minutes**, the workflow caches both pnpm package stores and Turborepo build steps:
1. **pnpm Store Cache:** Caches installed node modules mapped against `pnpm-lock.yaml` hash checks.
2. **Turborepo Build Cache:** Persists `.turbo/` build traces. If a pull request only changes backend test code, Turborepo skips compiling the Next.js frontend, returning the cached build immediately.

#### C. Database Migration Deployment
Before tests are executed, the schema is applied to the PostgreSQL container using Prisma's deploy command:
```bash
pnpm --filter api exec prisma migrate deploy
```
This applies the migration SQL history cleanly, matching what would happen in a production deployment.

#### D. Visual PR Test annotations (`dorny/test-reporter`)
When Vitest runs, the output is generated as a JUnit XML file:
```bash
pnpm --filter api test -- --reporter=default --reporter=junit --outputFile.junit=test-results.xml
```
The action `dorny/test-reporter` reads this XML and posts it as a detailed check run directly onto the GitHub PR. 
- **Reviewer Experience:** Interviewers reviewing the Pull Request see an interactive tree of all passing/failing tests, along with assertion tracebacks directly inline, without opening terminal logs.

---

## 📦 2. Release & Versioning Automation (`release.yml`)

The [release.yml](file:///Users/prashantindurkar/Code/Interviews/Assesment%20Rival/stride/.github/workflows/release.yml) workflow is triggered manually via **workflow_dispatch**. It automates semantic versioning upgrades, changelog creation, git tagging, and GitHub Releases.

### Release Workflow Steps:

#### 1. Conventional Commits Parser
The pipeline calculates the next version bump dynamically using `conventional-recommended-bump` based on standard **Angular Commit Conventions**:
- If commits contain `feat(...)`, it proposes a **Minor** bump.
- If commits contain `fix(...)`, it proposes a **Patch** bump.
- If commits contain `BREAKING CHANGE:`, it proposes a **Major** bump.

#### 2. Synchronized Version Upgrades
It programmatically increments the versions across:
- The root project `package.json`.
- The Next.js client `apps/web/package.json`.

#### 3. Automatic Changelog generation
Uses `conventional-changelog` to extract all commits added since the last release tag. It generates an updated list inside `CHANGELOG.md` grouping modifications by feature, fixes, and chore categories.

#### 4. Git Push & Release Creation
1. Commits the changes with `chore(release): vX.Y.Z`.
2. Creates the Git tag `vX.Y.Z`.
3. Pushes the tag and changes to the repository.
4. Spins up a new GitHub Release with the auto-generated changelog notes.
