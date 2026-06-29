# ADR 0002: Campsite Baseline as Reference

* **Status:** Approved
* **Date:** 2026-06-28
* **Authors:** Antigravity Workflow Architect

---

## 1. Context

We need a baseline open-source codebase to map data relationships, UI patterns, and layout structures. This baseline helps us avoid reinventing solved problems in communication platforms.

---

## 2. Decision

We will use **Campsite** (`../campsite/`) as our north-star reference architecture.

- When mapping tables (Organizations, Memberships, Channels, Docs), we will mimic Campsite's schema layouts.
- When creating UI components (Avatar, Dialog, Popover), we will follow Campsite's `packages/ui` structure.

---

## 3. Rationale & Trade-offs

### Pros
- **High Design Quality:** Campsite is built with premium UI, snappy micro-animations, and minimal aesthetics.
- **Production-Grade Schemas:** Their database schema manages complex features like organization memberships, read states, and integrations.

### Cons
- **Technology Difference:** Campsite is built with Ruby on Rails on the backend. We must manually translate their Rails models and controller logics into TypeScript (Node.js/Express/tRPC/Drizzle). We will use **Sharkord** as a helper reference for WebRTC and Node/TypeScript patterns.
