# OrangePlanet — UI Package Operational Rules (packages/ui)

> **CRITICAL: READ BEFORE WORKING IN THIS PACKAGE**
> This file contains the strict rules for all AI coding agents modifying components inside `packages/ui`.

## 1. Scope & Purpose
`packages/ui` is the shared, stateless design system component library for OrangePlanet. It governs presentation only.

## 2. Strict Limitations (No Data/Queries)
- **No Data Fetching:** You are strictly forbidden from importing `@trpc/client`, `@tanstack/react-query`, or writing native `fetch` requests inside this package.
- **Stateless/Presentation Only:** Components should only receive data via props. They cannot call API routers or understand database structures.
- **No Shared Features Import:** Never import files from `apps/web/src/features/` or `apps/api/`.

## 3. Storybook Rule (MANDATORY)
Every component added or modified in this package must have a corresponding `.stories.tsx` file co-located in its directory.
- Stories must cover all visual states: `Default`, `Hover`, `Active`, `Disabled`, and `Loading`.
- Stories must use standard Storybook export conventions.

## 4. Styling Conventions
- **The Sharp Edge Directive:** Always use `rounded-none` or ensure border radius resolves to `0` (per custom `globals.css` overrides). Never introduce rounded layouts.
- **Tailwind Scale Constraints:** Always use native Tailwind spacing/size values (`p-4`, `w-16`) instead of arbitrary custom pixel brackets (`p-[17px]`).
- **Semantic Tokens:** Use Campsite variables like `bg-bg-main`, `text-text-primary`, and `border-border-primary` instead of raw hex codes.
