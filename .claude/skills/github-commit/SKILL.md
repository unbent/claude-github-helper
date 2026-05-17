---
name: github-commit
description: Stages relevant changes based on user context, commits with a structured name, and pushes to GitHub. Use when the user says "commit X" or "let's commit the X feature".
allowed-tools: Read, Grep, Glob, Bash
---

When committing changes:

1. **Identify the working directory and project name.**
   - If you are not sure which project or directory you are in, ask the user before proceeding.
   - The project name is the name of the current directory (e.g. `add-numbers`).

2. **Determine the next commit number.**
   - Run `git log --oneline` to count existing commits. The next commit number is count + 1.
   - If there are no commits yet, the number is 1.

3. **Understand what to stage based on the user's context.**
   - The user may say something like "commit the addition function" — only stage changes relevant to that feature.
   - Run `git diff` and `git diff --cached` to review all current changes.
   - If relevant changes are isolated to specific files, stage those files with `git add <file>`.
   - If relevant changes are mixed with unrelated changes in the same file, inspect the diff to check if the hunks are separable (i.e. there are unchanged context lines between the relevant and irrelevant changes).
   - If they are separable, use `git add -p <file>` and use `s` to split hunks and `y/n` to stage only the relevant ones.
   - If the changes **cannot be cleanly separated** (e.g. all in one contiguous hunk), **stop and notify the user** — explain what is mixed together and ask how they want to proceed before continuing.

4. **Generate the commit description** — a single human-readable sentence summarizing what is being committed (e.g. `Created the add-numbers script with input validation and CLI argument parsing`). This description is used in both the commit message and the summary.

5. **Generate the commit name** in this exact format:
   `<commit#>_<project_name>_<short-description>: <description>`
   - `<commit#>`: the next commit number (e.g. `1`, `2`)
   - `<project_name>`: current directory name (e.g. `ADD-NUMBERS`)
     - Convert to uppercase and replace spaces with hyphens
   - `<short-description>`: a kebab-case slug derived from the description (e.g. `create-add-numbers-function`)
   - `<description>`: the full human-readable description from step 4
   - Example: `1_add-numbers_create-add-numbers-file-and-function: Created the add-numbers script with input validation and CLI argument parsing`

6. **Commit** with the generated name:
   `git commit -m "<generated-commit-name>"`

7. **Send a summary message** to the user:
   - The commit name used
   - A bulleted list of all files changed in the commit
   - A brief description of what was committed
   - The unpushed commits list is handled automatically by the post-commit hook — relay it from the hook's injected context rather than running `git log` yourself
   - Ask whether to push

   If the user mentioned pushing in their request, follow the steps in `push-reference.md`.

   Example format (when not auto-pushing):
   ```
   Committed: 1_add-numbers_create-add-numbers-file-and-function

   Files changed:
   - adding-numbers.js

   Description: Created the add-numbers script with input validation and CLI argument parsing.

   Unpushed commits: (from hook)

   Would you like me to push?
   ```
