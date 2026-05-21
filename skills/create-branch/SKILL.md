---
name: create-branch
description: Creates and names a new git branch following the project convention. Use when the user says "create a branch", "new branch", or "branch for X".
allowed-tools: Read, Bash
---

!`node "${CLAUDE_SKILL_DIR}/../../scripts/load-settings.js"`

## Steps

1. **Determine the prefix**
   Infer the appropriate prefix from the user's context:

   | Prefix | When to use |
   |--------|-------------|
   | `feature/` | New functionality |
   | `fix/` | Bug fixes |
   | `chore/` | Maintenance, dependencies, config |
   | `docs/` | Documentation only |
   | `refactor/` | Code restructure with no new features |
   | `test/` | Adding or fixing tests |

   If unsure, ask the user to confirm before continuing.

2. **Get the branch number**
   - If `ghCli` is a version string: run `gh pr list --state all --json number` and count the results. The branch number is count + 1.
   - If `ghCli` is `false` or `null`: skip the number — branch name will be `<prefix>/<description>` only.

   > In a future version this number will be replaced by a ticket number from project management integrations (Jira, Trello, etc.) when configured.

3. **Check for a ticket number**
   - If the user mentioned a ticket number (e.g. `PROJ-123`, `#42`), use that instead of the auto-incremented number.

4. **Generate the branch name**
   - Convert the description to kebab-case (lowercase, spaces → hyphens, no special characters)
   - With number: `<prefix>/<number>-<description>` — e.g. `feature/42-add-dark-mode`
   - With ticket: `<prefix>/<ticket>-<description>` — e.g. `feature/PROJ-123-add-dark-mode`
   - Without number: `<prefix>/<description>` — e.g. `feature/add-dark-mode`
   - Show the generated name to the user and ask for confirmation before creating

5. **Create the branch**
   - Run `git checkout -b <branch-name>`

6. **Push to remote**
   - Ask if the user wants to push and set the upstream: `git push -u origin <branch-name>`
   - If `autoPush` is `"always"`, push without asking
   - If `autoPush` is `"never"`, skip pushing entirely
