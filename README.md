# GitHub Helper

A Claude Code plugin that automates GitHub workflows — structured commits, PR descriptions, and branch naming — directly from your Claude Code session.

## Requirements

- [Claude Code](https://claude.ai/code)
- [Node.js](https://nodejs.org) (for hooks and settings)
- [GitHub CLI](https://cli.github.com) *(optional — enables pushing PR descriptions directly to GitHub)*

## Installation

```bash
claude /plugin install git@github.com:unbent/claude-github-helper.git
```

Then run the setup skill to configure your preferences:

```
/github-helper:setup
```

## Skills

### `/github-helper:github-commit`
Stages relevant changes, generates a structured commit name, and handles pushing.

Commit format: `<#>_<PROJECT>_<short-description>: <description>`

### `/github-helper:pr-description`
Diffs your branch against the base branch and writes a structured PR description. If GitHub CLI is installed, can push the description directly to GitHub.

### `/github-helper:setup`
Interactive setup wizard. Configures your global `~/.github-helper/settings.json` — detects GitHub CLI, sets your preferred push behavior and default branch.

## Configuration

Settings are loaded from two locations, with project-level overrides taking precedence:

| File | Scope |
|------|-------|
| `~/.github-helper/settings.json` | Global (all repos) |
| `.github-helper.json` | Project (current repo only) |

| Setting | Default | Description |
|---------|---------|-------------|
| `autoPush` | `"ask"` | Push behavior after commit: `"ask"`, `"always"`, or `"never"` |
| `ghCli` | `null` | Cached GitHub CLI version. Set to `null` to re-detect. |
| `defaultBranch` | `"main"` | Base branch used for PR description diffs |

See [settings.md](settings.md) for full details.
