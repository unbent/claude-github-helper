---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR, or when the user asks to summarize changes for a pull request.
allowed-tools: Read, Grep, Glob, bash
---

<!-- 
  AUTHOR NOTE: this section is for humans, not the model

  A good description for a claude skill answers 2 questions: 
  1. What does this skill do?
  2. When should claude use this skill?
-->

!`node "${CLAUDE_SKILL_DIR}/../../scripts/load-settings.js"`

When writing a PR description:

1. Run `git diff <defaultBranch>...HEAD` to see all changes on this branch, where `<defaultBranch>` comes from the injected settings (default: `main`)
2. Write a description following this format:
   - If `ghCli` is a version string, offer to push the description directly to GitHub using `gh pr create` or `gh pr edit` after writing it.

## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed
