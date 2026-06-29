# Feature Completion Workflow

Whenever I say **"Complete this feature"** or **"Run the feature completion workflow"**, follow these steps exactly.

## 1. Code Quality

Run every quality check available in the project.

* Install dependencies if required
* Format code using Biome
* Run Biome lint
* Run type checking
* Run unit tests
* Run integration tests (if available)
* Run production build
* Run any additional project validation scripts

Fix every issue until all checks pass successfully.

Do not continue until everything is green.

---

## 2. Review the Feature

Before committing:

* Review every file changed
* Remove dead code
* Remove debugging logs
* Remove unused imports
* Remove commented code
* Improve naming where needed
* Ensure consistency with project architecture
* Ensure coding standards are followed

---

## 4. Create Git Branch

Branch format:

feature/<short-name>

bugfix/<short-name>

fix/<short-name>

refactor/<short-name>

docs/<short-name>

chore/<short-name>

hotfix/<short-name>

Use the correct prefix depending on the work completed.

Switch to the new branch.

---

## 5. Git Commit

Stage all changes.

Create a Conventional Commit.

Examples:

feat: add workspace invitation flow

fix: resolve login redirect issue

refactor: simplify issue service

docs: update backend architecture

chore: configure biome

The commit message must accurately describe the change.

---

## 6. Push to GitHub

Push the branch to origin.

Set upstream if needed.

Do not push directly to main or master.

---

## 7. Final Report

Return a report in this format.

# ✅ Feature Completed

## Branch

feature/example-feature

## Commit

feat: add example feature

## Validation

✅ Biome Format

✅ Biome Lint

✅ Type Check

✅ Tests

✅ Build

## Summary

* Added ...
* Implemented ...
* Refactored ...
* Improved ...
* Fixed ...

## Files Modified

* app/...
* components/...
* lib/...
* ...

## Notes

Mention anything important that future developers should know.

If any validation fails, DO NOT commit or push.

Instead, fix the issue and rerun every validation until everything passes.
