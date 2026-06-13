# Generate Git Branch Name and Conventional Commit Message

Analyze the staged git diff and determine the PRIMARY change.

Focus on:

* What feature was added?
* What bug was fixed?
* What component/module was changed?
* What user-visible behavior changed?
* Ignore formatting, linting, imports, comments, and minor refactors unless they are the main change.

## Output

Branch: <branch-name>
Commit: <commit-message>

## Branch Rules

* Lowercase only
* Use hyphens
* Maximum 4 words after type
* Format:

feat/<description>
fix/<description>
refactor/<description>
chore/<description>
docs/<description>
test/<description>
ci/<description>
build/<description>

Examples:

* feat/task-context-menu
* fix/sidebar-scroll
* refactor/task-card-layout

## Commit Rules

* Follow Conventional Commits
* Be specific to the actual change
* Mention the affected feature/component
* Describe the result, not the implementation

Good:

* feat(tasks): add nested status and priority menus
* fix(board): prevent task cards from overflowing column width
* refactor(ui): simplify task card metadata layout
* feat(sidebar): add project navigation section

Bad:

* feat: update task management
* fix: resolve issues
* refactor: cleanup code
* chore: changes

## Priority

1. User-facing feature
2. Bug fix
3. Component behavior
4. Internal refactor

Generate the most specific branch name and commit message possible from the staged changes.

Output only:

Branch: <branch-name>
Commit: <commit-message>
