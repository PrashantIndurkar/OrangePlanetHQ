# Commit & Changelog Generation Rules

## Commit Messages

Generate Conventional Commits that describe the user-visible outcome.

Prioritize:

1. User-facing features
2. Bug fixes
3. UX improvements
4. Refactors

Avoid generic messages such as:

* update task management
* cleanup code
* various fixes
* improve UI

Use specific scope names:

* workspace
* tasks
* board
* list
* sidebar
* dashboard
* reviews
* inbox
* filters

Examples:

feat(workspace): add board and list views
feat(filters): add multi-select filtering
feat(tasks): add status and priority quick actions
fix(board): prevent task cards from overflowing
fix(filters): preserve selected filters in URL

---

## Changelog Generation

Read .agents/changelog-agent.md

Generate USER-FACING release notes.

Rules:

* Focus on what users can do.
* Merge related commits into a single release note.
* Avoid implementation details.
* Avoid words:

  * implement
  * component
  * state management
  * refactor
  * architecture
  * internal

Group output into:

### ✨ New Features

### 🚀 Improvements

### 🐛 Fixes

Ignore commits starting with:

* ci:
* chore:
* build:
* docs:
* release:
* ai:

unless they directly affect users.
