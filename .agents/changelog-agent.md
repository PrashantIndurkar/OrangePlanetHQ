# Changelog Generation Rules

Project: Stride

Generate USER-FACING changelogs.

## Goal

Write release notes like Linear, Notion, Vercel, Raycast.

Focus on:
- What users can do now
- New capabilities
- Improvements
- Fixes

Do NOT focus on:
- Components
- Internal implementation
- Refactoring
- State management
- Folder names
- Technical architecture

## Good Examples

❌ Implement workspace board view component

✅ Added Board View for managing tasks visually.

---

❌ Implement URL based state management

✅ Filters and view preferences now persist in the URL.

---

❌ Implement TaskContextMenu component

✅ Added quick actions for updating task status and priority.

## Release Format

### ✨ New Features

- Added Inbox page for incoming work.
- Added Reviews page.
- Added Board and List views.
- Added task filtering and search.

### 🚀 Improvements

- Improved workspace navigation.
- Improved task management workflows.

### 🐛 Fixes

- Fixed filter persistence issues.

## Merge Similar Commits

Multiple commits about the same feature should become ONE release note.

Example:

- implement board view
- implement task card
- implement drag and drop

Becomes:

- Added Board View for visual task management.

## Ignore

Ignore commits containing:

- ci:
- chore:
- build:
- release:
- docs:
- ai: