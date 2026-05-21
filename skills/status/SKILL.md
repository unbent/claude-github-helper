---
name: status
description: Runs a health check on the current repo and GitHub Helper setup. Use when the user says "status", "check setup", "is everything configured", or "am I ready to use github-helper".
allowed-tools: Bash, Read
---

!`node "${CLAUDE_SKILL_DIR}/../../scripts/load-settings.js"`

Run a read-only diagnostic and report results as a checklist. Never modify any files or settings.

## Checks

Run each check below using Bash, then present a single consolidated report at the end.

### 1. Git Repository
- Run `git rev-parse --is-inside-work-tree 2>/dev/null`
- ✅ Inside a git repo
- ❌ Not a git repo — run `git init` to initialize one

### 2. Remote Configured
- Run `git remote -v`
- ✅ Remote is configured (show the URL)
- ⚠️ No remote — run `git remote add origin <url>` to connect to GitHub

### 3. Remote Reachable
- Run `git ls-remote --exit-code origin HEAD 2>/dev/null`
- ✅ Remote is reachable
- ❌ Cannot reach remote — check your SSH key or network connection

### 4. Upstream Branch
- Run `git rev-parse --abbrev-ref @{u} 2>/dev/null`
- ✅ Upstream is set (show branch name)
- ⚠️ No upstream set — run `git push -u origin <branch>` to set one

### 5. Current Branch
- Run `git branch --show-current`
- ✅ On a feature branch (show name)
- ⚠️ On a protected branch (`main` / `master` / `defaultBranch`) — consider creating a feature branch before committing

### 6. Uncommitted Changes
- Run `git status --porcelain`
- ✅ Working tree is clean
- ⚠️ Uncommitted changes exist (show count of files)

### 7. GitHub CLI Installed
- Check `ghCli` from injected settings
- ✅ GitHub CLI detected (show version)
- ❌ GitHub CLI not found — install from https://cli.github.com to unlock PR features

### 8. GitHub CLI Authenticated
- Only run if `ghCli` is a version string
- Run `gh auth status 2>&1`
- ✅ Authenticated (show account)
- ❌ Not authenticated — run `gh auth login`

### 9. Plugin Settings
- Check if `~/.github-helper/settings.json` exists
- ✅ Global settings found (show current values)
- ⚠️ No global settings — run `/github-helper:setup` to configure

### 10. Project Settings
- Check if `.github-helper.json` exists in the current directory
- ✅ Project settings found (show values)
- ℹ️ No project settings (this is fine — global settings apply)

---

## Report Format

Present the results as a clean checklist grouped by category:

```
GitHub Helper Status

Git
  ✅ Inside a git repo
  ✅ Remote configured (git@github.com:user/repo.git)
  ✅ Remote reachable
  ⚠️  No upstream set — run: git push -u origin <branch>
  ⚠️  On protected branch `main`

Working Tree
  ⚠️  3 files with uncommitted changes

GitHub CLI
  ✅ Installed (v2.50.0)
  ✅ Authenticated as @username

Plugin
  ✅ Global settings configured
     autoPush: ask | defaultBranch: main
  ℹ️  No project-level settings
```

After the report, suggest the most important action to take if anything is ❌ or ⚠️.
