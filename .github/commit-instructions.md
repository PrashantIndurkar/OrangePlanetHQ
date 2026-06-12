# Generate Git Branch Name and Conventional Commit Message

Generate a Git branch name and Conventional Commit message based on the staged changes.

## Output Format

Branch: <branch-name>
Commit: <commit-message>

## Rules

### Branch Name

* Output first.
* Lowercase only.
* Use hyphens (`-`) instead of spaces.
* Keep concise and descriptive.
* Format:

  * feat/short-description
  * fix/short-description
  * refactor/short-description
  * chore/short-description
  * docs/short-description
  * test/short-description
  * ci/short-description
  * build/short-description

### Commit Message

* Output second.

* Follow Conventional Commits.

* Use one of:

  * feat
  * fix
  * chore
  * docs
  * refactor
  * test
  * ci
  * build

* Scope is optional:

  * feat(auth): add password reset flow
  * fix(ui): resolve sidebar overflow

* Maximum 150 characters.

* Prefer 50–80 characters.

* Be specific about what changed.

* Mention the main feature, component, file, or tool affected.

* Use present tense.

* Avoid vague messages like:

  * update code
  * fix bug
  * changes
  * cleanup

## Examples

Branch: feat/task-filtering
Commit: feat: add task filtering to project list

Branch: fix/sidebar-scroll
Commit: fix(ui): resolve sidebar scrolling issue

Branch: chore/release-workflow
Commit: chore(ci): add automated release workflow

Branch: docs/changelog-guide
Commit: docs: update changelog and release workflow guide

Branch: refactor/button-props
Commit: refactor(ui): simplify button component props

Branch: ci/biome-checks
Commit: ci: run biome checks on pull requests

## Important

Output only:

Branch: <branch-name>
Commit: <commit-message>

Do not include explanations, markdown, code blocks, reasoning, or additional text.
