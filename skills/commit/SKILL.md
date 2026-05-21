---
name: commit
description: Stages relevant changes based on user context, commits with a structured name, and pushes to GitHub. Use when the user says "commit X" or "let's commit the X feature".
allowed-tools: Read, Grep, Glob, Bash
---

!`node "${CLAUDE_SKILL_DIR}/../../scripts/load-settings.js"`

## Phase 1 — Analyze

1. **Identify the working directory and project name.**
   - If unsure which project or directory you are in, ask before proceeding.
   - The project name is the name of the current directory (e.g. `add-numbers`).

2. **Determine the next commit number.**
   - Run `git log --oneline` to count existing commits. The next commit number is count + 1.
   - If there are no commits yet, the number is 1.

3. **Review all current changes.**
   - Run `git diff` and `git diff --cached` to see everything uncommitted.
   - Assess whether the changes form **one logical unit** or **multiple distinct groups**.

4. **Decide the flow:**
   - If the user named a specific thing to commit (e.g. "commit the auth changes") → **Single-commit flow**
   - If the changes are one logical unit → **Single-commit flow**
   - If the changes clearly belong to multiple unrelated features or concerns → **Multi-commit flow**

---

## Phase 2a — Single-Commit Flow

5. **Stage the relevant changes.**
   - If relevant changes are isolated to specific files, stage those files with `git add <file>`.
   - If relevant changes are mixed with unrelated changes in the same file, inspect the diff to check if the hunks are separable (i.e. there are unchanged context lines between the relevant and irrelevant changes).
   - If they are separable, use `git add -p <file>` and use `s` to split hunks and `y/n` to stage only the relevant ones.
   - If the changes **cannot be cleanly separated**, **stop and notify the user** — explain what is mixed together and ask how they want to proceed.

6. **Generate the commit name** in this exact format:
   `<commit#>_<PROJECT-NAME>_<short-description>: <description>`
   - `<commit#>`: the next commit number
   - `<PROJECT-NAME>`: current directory name in UPPERCASE with spaces as hyphens
   - `<short-description>`: kebab-case slug of the description
   - `<description>`: a single human-readable sentence summarizing what is committed
   - Example: `3_MY-PROJECT_add-login-flow: Added login flow with JWT auth and session handling`

7. **Commit**, then send a summary and handle push — see **Push Behavior** below.

---

## Phase 2b — Multi-Commit Flow

5. **Group the changes into logical commits.**
   - Analyze all changed files and diff hunks
   - Propose a commit plan: a numbered list where each entry has:
     - The files to be staged
     - A draft commit name (following the same format as single-commit)
     - Commit numbers increment sequentially (e.g. if last commit was #3, plan is #4, #5, #6...)
   - Present the full plan to the user and ask for confirmation before proceeding
   - Allow the user to reorder, rename, merge, or remove groups before confirming

   Example plan format:
   ```
   Proposed commit plan:

   Commit 4 — feat/add-auth-middleware
   Files: src/middleware/auth.js, src/middleware/index.js
   Name: 4_MY-PROJECT_add-auth-middleware: Added JWT auth middleware with token validation

   Commit 5 — fix/login-redirect
   Files: src/pages/login.jsx
   Name: 5_MY-PROJECT_fix-login-redirect: Fixed post-login redirect to return to previous page

   Proceed with this plan?
   ```

6. **Execute each commit in sequence.**
   - For each group: stage the relevant files, run `git commit -m "<name>"`, relay the post-commit hook output
   - If any commit fails, stop and report the error before continuing

7. **Send a final summary** of all commits made, then handle push — see **Push Behavior** below.

---

## Push Behavior

After all commits are done, handle push based on the `autoPush` setting:
- `"always"` — push immediately without asking. Follow the steps in `push-reference.md`.
- `"never"` — do not mention pushing.
- `"ask"` — ask whether to push. If yes, follow the steps in `push-reference.md`.

If the user explicitly mentioned pushing in their request, always push regardless of `autoPush`.
