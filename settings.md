# GitHub Helper Settings

Settings are loaded from two locations, with project settings taking precedence over global:

- **Global:** `~/.github-helper/settings.json`
- **Project:** `.github-helper.json` in the repo root

## Schema

```json
{
  "autoPush": "ask",
  "ghCli": null,
  "defaultBranch": "main"
}
```

## Options

### `autoPush`
Controls push behavior after a commit.

| Value | Behavior |
|-------|----------|
| `"ask"` | Prompt after every commit *(default)* |
| `"always"` | Push immediately without prompting |
| `"never"` | Never push — commit only |

### `ghCli`
Cached result of GitHub CLI availability. Checked once on first skill invocation, then stored.

| Value | Meaning |
|-------|---------|
| `null` | Not yet checked — will be detected on next invocation |
| `"2.50.0"` *(version string)* | gh is installed at this version |
| `false` | gh is not installed |

To re-trigger detection, set this back to `null`.

### `defaultBranch`
The base branch used for PR description diffs.

| Value | Behavior |
|-------|----------|
| `"main"` | Diffs against `main` *(default)* |
| `"master"` | Diffs against `master` |
| Any branch name | Diffs against that branch |
