# Push Reference

Use this reference only when the user mentions pushing in their request (e.g. "commit and push", "push commit 3").

## Steps

1. Run `git log --oneline @{u}..HEAD 2>/dev/null || git log --oneline` to list all unpushed commits.

2. If the user asked to push everything, or there is only one unpushed commit:
   - `git push` (or `git push -u origin <branch>` if no upstream is set)

3. If the user named specific commits to push:
   - Git history is linear — you can only push *up to* a specific commit, which includes all commits before it
   - Identify the latest of the named commits and run: `git push origin <hash>:refs/heads/<branch>`
   - If the user named non-contiguous commits (e.g. "push 1 and 3 but not 2"), explain that this isn't possible without pushing everything in between, and ask how they'd like to proceed

4. If the user asked to push but there are multiple unpushed commits and they did not say to push everything:
   - List the unpushed commits and confirm which ones they want to push before proceeding
