# Workflow — How Claude Code Operates Here

Applies to every task, regardless of domain. Kept short on purpose — this is a loop to follow, not a manual to study.

## The loop

1. **Plan** — before writing any code, lay out the plan (plan mode is on by default). Read only the skill(s) and docs relevant to the feature at hand, inferred from the request and `CLAUDE.md`'s skill summary — not the whole docs folder, and not by developer enumeration. Pull in `workflow.md` or `progress-tracker.md` only when the task is itself about process or status.
2. **Confirm** — wait for explicit developer confirmation before executing. No plan, no build.
3. **Execute** — implement exactly what was confirmed. If something during execution requires deviating from the confirmed plan, stop and flag it — don't silently improvise past it.
4. **Review** — after execution, the developer checks the result. One of two outcomes:
   - **Update** — changes requested, loop back to Plan for the delta
   - **Confirmed** — the developer accepts the result, proceed to Build

## On confirmation

- Run `pnpm astro build`
- Update `progress-tracker.md` — check off what was completed
- Provide a brief, accurate commit message for the developer to use — do not commit it yourself

## Git

Claude Code can freely run read-only git commands (`status`, `diff`, `log`, `show`, `blame`, etc.) at any time for its own analysis — it should never be blocked on checking what it needs. The developer handles everything that mutates repo state: `add`, `commit`, `push`, branches, merges, resets. On confirmation, Claude Code's only git-adjacent step is the build above, unless directly asked to do more for a specific task.

## Errors

If Claude Code identifies an error — in its own output, in existing code, in a decision made earlier — raise it to the developer immediately. Do not quietly work around it, absorb it into the current task, or defer mentioning it until the next review point.

## Staying in scope

Build exactly what was confirmed in the plan — nothing broader, nothing "while I'm in here." If a good adjacent improvement becomes obvious mid-task, name it to the developer rather than including it unasked; scope creep is a plan-stage decision, not an execution-stage one.

## When something's ambiguous

Check the relevant skill and `fallback-reference.md` first — most schema- and pattern-level ambiguity is already resolved there. If it's genuinely undecided, raise it as a question at the Plan stage, not a guess made silently during Execute.
