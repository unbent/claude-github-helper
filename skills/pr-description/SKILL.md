---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR, or when the user asks to summarize changes for a pull request.
allowed-tools: Read, Grep, Glob, Bash
---

<!-- 
  AUTHOR NOTE: this section is for humans, not the model

  A good description for a claude skill answers 2 questions: 
  1. What does this skill do?
  2. When should claude use this skill?
-->

!`node "${CLAUDE_SKILL_DIR}/../../scripts/load-settings.js"`

## Steps

1. **Gather context**
   - Run `git diff <defaultBranch>...HEAD` using the `defaultBranch` from injected settings (default: `main`)
   - Run `git log <defaultBranch>...HEAD --oneline` to see all commits on this branch
   - Run `git branch --show-current` to get the current branch name

2. **Check for a PR template**
   - Check if `.github/PULL_REQUEST_TEMPLATE.md` exists in the repo
   - If found, use it as the base format instead of the default format below
   - If not found, use the default format

3. **Check for an existing PR** *(only if `ghCli` is a version string)*
   - Run `gh pr view --json title,body,number 2>/dev/null` to check if a PR already exists for this branch
   - Note whether you will be **creating** or **editing** — affects which `gh` command to use later

4. **Detect UI changes**
   - Check if any changed files have extensions: `.jsx`, `.tsx`, `.vue`, `.html`, `.css`, `.scss`, `.sass`
   - If yes, include a Screenshots section in the description

5. **Detect related issues**
   - Scan the branch name and commit messages for GitHub issue references (`#123`) or ticket patterns (`[A-Z]+-[0-9]+` e.g. `PROJ-123`)
   - Include any found references in the Related Issues section

6. **Generate a PR title**
   - Write a concise title (under 70 characters) summarizing what the PR does
   - If the branch name contains a ticket number, include it: e.g. `[PROJ-123] Add dark mode toggle`

7. **Write the PR description** using this format:

## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed.

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed

## Test Plan
- Bulleted checklist of how to verify this works
- Include edge cases worth checking

## Breaking Changes
*Only include this section if there are breaking changes. Remove it otherwise.*
- List any breaking changes and migration steps

## Screenshots
*Only include this section if UI files were changed. Remove it otherwise.*
- Add screenshots or screen recordings here

## Related Issues
*Only include this section if issue references were found. Remove it otherwise.*
- Closes #123
- PROJ-456

---

8. **Handle push behavior** *(only if `ghCli` is a version string)*
   - If a PR **already exists**: run `gh pr edit --title "<title>" --body "<description>"`
   - If **no PR exists**: run `gh pr create --title "<title>" --body "<description>"`
   - After pushing, output the PR URL
   - If `ghCli` is `false` or `null`: display the title and description for the user to copy-paste manually
