---
name: Do not run git commits in this project — user commits manually
description: User handles all git commits in the Calories Counting App project; do not run `git commit` even when changes are obviously commit-ready
type: feedback
originSessionId: b0c6162c-fc40-4546-a9de-6d021f1648e3
---
Do not run `git commit` in this project. The user creates commits manually.

**Why:** User stated preference on 2026-05-06: "don't do commits, I will do it manually" — given after I had offered/started a commit for the IA + user-flows docs.

**How to apply:**
- Don't execute `git commit`, `git commit --amend`, or any push/merge operations on the user's behalf.
- It's still fine to: read git state (`git status`, `git diff`, `git log`), stage files when explicitly asked, and *draft* commit messages for the user to use. Just stop short of running the commit.
- If a workflow naturally ends in a commit (e.g. finishing a coding task), wrap up by summarizing what changed and noting "ready for you to commit", rather than committing yourself.
- This applies to this project specifically; do not generalize to other projects unless similar feedback shows up there.
