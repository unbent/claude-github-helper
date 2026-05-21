---
name: setup
description: Walk the user through initial GitHub Helper configuration. Use when the user says "setup github-helper", "configure github-helper", or runs this for the first time.
allowed-tools: Read, Write, Bash
---

Walk the user through setting up GitHub Helper by configuring their global settings file at `~/.github-helper/settings.json`.

## Steps

1. **Check current state**
   - Run `node "${CLAUDE_SKILL_DIR}/../../scripts/load-settings.js"` to read existing settings
   - Note which settings already have non-default values

2. **Check for gh CLI**
   - If `ghCli` is `null`, run `gh --version` to detect it
   - Inform the user of the result:
     - Found: "GitHub CLI detected (v{version}) — PR features will be available"
     - Not found: "GitHub CLI not found — install it from https://cli.github.com to unlock PR features"
   - Cache the result in the settings

3. **Walk through each setting interactively**

   For each setting below, show the current value and ask if they want to change it. Accept the new value if they do.

   ### `autoPush`
   Options: `ask` / `always` / `never`
   > "After committing, should I automatically push, always ask, or never push?"

   ### `defaultBranch`
   > "What is your default base branch? (e.g. main, master, or a custom branch name)"

4. **Write the settings**
   - Build the final settings object and write it to `~/.github-helper/settings.json`
   - Create the `~/.github-helper/` directory if it doesn't exist

5. **Confirm**
   - Show a summary of the saved settings
   - Let the user know they can re-run this skill anytime to update settings, or edit `~/.github-helper/settings.json` directly
   - Mention that project-level overrides can be added in `.github-helper.json` at the repo root (see `settings.md` for the full reference)
