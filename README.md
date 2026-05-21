# GitHub Helper

A Claude Code plugin that automates GitHub workflows directly from your Claude Code session — structured commits, branch creation, pull requests, and more.

---

## Requirements

- [Claude Code](https://claude.ai/code)
- [Node.js](https://nodejs.org) — required for hooks and settings
- [GitHub CLI](https://cli.github.com) *(optional)* — enables PR creation and branch number auto-increment

---

## Installation

```bash
claude /plugin install git@github.com:unbent/claude-github-helper.git
```

After installing, run the setup skill to configure your preferences:

```
/github-helper:setup
```

---

## Skills

### `/github-helper:status`
Runs a health check on your current repo and plugin configuration. Reports the state of your git repo, remote connection, upstream branch, GitHub CLI auth, and plugin settings — all as a clean ✅ / ⚠️ / ❌ checklist with suggested fixes.

Run this anytime to confirm everything is configured correctly before starting work.

---

### `/github-helper:setup`
Interactive setup wizard that walks you through configuring your global settings at `~/.github-helper/settings.json`. Detects whether GitHub CLI is installed, and lets you set your preferred push behavior and default branch.

You can re-run this anytime to update your settings, or edit the file directly.

---

### `/github-helper:commit`
Stages relevant changes, generates a structured commit name, and handles pushing — for both single changes and multiple logical groups.

**Commit name format:**
```
<#>_<PROJECT>_<short-description>: <full description>
```
Example: `3_MY-PROJECT_add-auth-flow: Added JWT authentication with session handling`

**Single-commit flow:** Tell Claude what to commit (e.g. "commit the login changes") and it stages only the relevant files, generates the name, and commits.

**Multi-commit flow:** When changes span multiple unrelated features, Claude analyzes all changes, proposes a full commit plan with names and file groupings, and asks for confirmation before executing each commit in sequence.

Push behavior after committing is controlled by the `autoPush` setting.

---

### `/github-helper:pull-request`
Generates a structured pull request title and description, then creates or updates the PR on GitHub if the GitHub CLI is installed.

**What it does:**
- Diffs your branch against `defaultBranch` to understand what changed
- Checks for an existing PR on the branch — creates one if not, edits if so
- Detects a `.github/PULL_REQUEST_TEMPLATE.md` and uses it if found
- Identifies UI file changes and adds a Screenshots section when relevant
- Scans branch names and commit messages for issue references (`#123`, `PROJ-123`)

**PR description format:**
```
## What
## Why
## Changes
## Test Plan
## Breaking Changes  (only when applicable)
## Screenshots       (only when UI files changed)
## Related Issues    (only when references found)
```

---

### `/github-helper:create-branch`
Creates and names a new git branch following a consistent convention.

**Branch name format:**
```
<prefix>/<number>-<description>
```
Example: `feature/42-add-dark-mode`

**Prefixes:** `feature/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`

Claude infers the prefix from context and asks to confirm if unsure. The branch number is auto-incremented from your total PR count via `gh pr list` (requires GitHub CLI). If you provide a ticket number (e.g. `PROJ-123`), it's used instead. If GitHub CLI is not available, the number is omitted.

Push behavior is controlled by the `autoPush` setting.

---

## Hooks

GitHub Helper ships with two automatic hooks that fire during your Claude Code session — no manual setup required.

### Pre-commit guard
Runs before every `git commit`. If you're on a protected branch (`main`, `master`, or your configured `defaultBranch`), Claude injects a warning so you can confirm before proceeding.

### Post-commit summary
Runs after every `git commit`. Automatically injects a summary of what was committed and lists all unpushed commits, so Claude can relay it without running extra commands.

Both hooks work on macOS, Linux, and Windows.

---

## Configuration

Settings are loaded from two locations, with project-level values taking precedence over global:

| File | Scope |
|------|-------|
| `~/.github-helper/settings.json` | Global — applies to all repos |
| `.github-helper.json` | Project — applies to the current repo only |

| Setting | Default | Description |
|---------|---------|-------------|
| `autoPush` | `"ask"` | Push behavior after committing or creating a branch: `"ask"` prompts each time, `"always"` pushes immediately, `"never"` skips pushing entirely |
| `ghCli` | `null` | Cached GitHub CLI version string, or `false` if not installed. Set back to `null` to force re-detection. |
| `defaultBranch` | `"main"` | Base branch for PR diffs and the protected branch warning |

See [settings.md](settings.md) for the full reference.
