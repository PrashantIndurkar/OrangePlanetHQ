# OrangePlanetHQ — Design System Guidelines

This document defines the visual design system, token guidelines, and component rules for the OrangePlanet workspace. It is based directly on the variables defined in **[globals.css](file:///Users/prashantindurkar/Code/open-source/orangeplanetHQ/OrangePlanetHQ/apps/web/app/globals.css)**.

---

## 1. Visual DNA & Aesthetic Rules

OrangePlanet uses a completely flat, high-contrast, zero-radius design language.

- **Zero-Radius Standard:** Every component must have completely square edges. Rounded corners are strictly forbidden. The system configuration overrides all radius utility variables to zero:
  - `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` are all set to `0`.
  - Tailwind utilities like `rounded`, `rounded-md`, or `rounded-lg` effectively render as `rounded-none`.
- **Campsite Color Tokens:** Use the semantic OKLCH and Hex variables defined in `globals.css`:
  - **Main Background:** `bg-bg-main` (resolves to light gray `#FCFCFC` in light mode, `#0D0D0D` in dark mode).
  - **Primary Surface:** `bg-bg-primary` (resolves to pure white `#FFFFFF` in light mode, `#0D0D0D` in dark mode).
  - **Action Surface:** `bg-bg-primary-action` (resolves to `#171717` in light mode, `#FFFFFF` in dark mode).
- **Hairline Borders:** Use `border-border-primary` which resolves to a crisp, translucent hairline border (`color-mix(in srgb, #000000 10%, transparent)`). Do not use dark, heavy borders.
- **Brand Colors:** The primary branding accent is `brand-primary` (`#FF591E`) and `brand-secondary` (`#FB432C`).

---

## 2. Spacing & Sizing Rule (No Custom Brackets)

To maintain consistency and clean code, **never use arbitrary square-bracket values for spacing, sizes, padding, or margins.**

- **Incorrect:** `p-[17px]`, `w-[64px]`, `gap-[9px]`, `mt-[20px]`
- **Correct:** Match the nearest native Tailwind scale value (`p-4`, `w-16`, `gap-2`, `mt-5`).
- If a custom layout spacing is required, it must be mapped to a standard theme token or handled using native flex/grid distributions rather than ad-hoc pixel values.

---

## 3. Centralized Iconography (HugeIcons)

All icons (`hugeicons-react`) must be centralized and exported from `packages/ui`. Do not import icon libraries directly in features or application routing.

### Structure
```
packages/ui/src/components/Icons/
├── index.ts                  # Barrel export for all icons
└── CustomIcons.tsx           # Custom SVG overrides (if needed)
```

### Consumption Pattern
```typescript
// Correct - Unified import from design system
import { IssueIcon, ChatIcon } from '@orangeplanet/ui/icons';

// Incorrect - Direct library import
import { TicketIcon, MessageIconButton } from 'hugeicons-react';
```

---

## 4. Animation Guidelines (Framer Motion)

We use **Framer Motion** for all client-side micro-animations, transitions, and state feedback. Animations must remain fast and unobtrusive.

### Rules
1. **Transition Speed:** Standard transition duration should be fast, defaulting to `100ms` or `150ms`.
2. **Spring Config:** Use `type: "spring"` with high stiffness and damping for a snappy, responsive feel, rather than slow ease-in-out curves.
3. **No Layout Shift:** Ensure animated elements (like dropdown reveals or sidebar expands) use `layout` props or starting styles that do not trigger layout shifts in neighboring blocks.

Example:
```typescript
import { motion } from 'framer-motion';

export function DropdownItem({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -2 }}
      transition={{ duration: 0.1 }}
      className="px-2 py-1.5 text-sm"
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Component Library Rules (`packages/ui`)

Every component inside `packages/ui` must satisfy the following constraints:
1. **Storybook Story:** Must have a `.stories.tsx` file co-located inside the component folder, covering default, active, disabled, and loading states.
2. **Zero Data Dependencies:** Components cannot import from `apps/web`, `apps/api`, or tRPC contexts. They are strictly presentation layers.
3. **Vitest Unit Test:** Components containing layout logic or interaction triggers must have a `.test.tsx` file verifying interaction output.
