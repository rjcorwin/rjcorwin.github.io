# Cook Multi-Direction Exploration

Cook currently runs a single-path loop: work → review → gate → iterate. This spec adds a **fork-join pattern** — spawn parallel explorations in git worktrees, then compare results.

## Why

You're adding date formatting and see two paths: use `date-fns` or roll your own. Today you'd manually run cook twice, eyeball both branches, and decide. This feature makes that a single command.

## Grammar

```
cook <work> <review> <gate> [max-iterations]
     [vs <work> <review> <gate> [max-iterations]]+
     [judge <criteria> | merge <criteria> | summarize]
     [x<N> [criteria]]
```

### Tokens

| Token | Role | Required |
|---|---|---|
| `"work" "review" "gate"` | The standard cook triple — defines one branch | Yes (at least one) |
| `5` (number after gate) | Max iterations for that branch's cook loop | No (default: 3) |
| `vs` | Separates branches — everything after `vs` until the next `vs` or join keyword is a new branch | No |
| `judge <criteria>` | Pick a winner from the branches | No* |
| `merge <criteria>` | Synthesize the best parts of all branches into new code | No* |
| `summarize` | Produce a comparison doc, human decides | No* |
| `x<N>` | Run N instances of the entire pipeline in parallel, pick the best | No |
| `x<N> <criteria>` | Same, with explicit criteria for the meta-judge | No |

*One join keyword required when `vs` is used.

### Rules

1. `vs` requires a join keyword (`judge`, `merge`, or `summarize`)
2. `summarize` is terminal — `x<N>` after `summarize` is an error
3. `judge` and `merge` produce a single output, so they compose with `x<N>`
4. `x<N>` without criteria inherits the criteria from `judge` or `merge`
5. `x<N>` with criteria overrides the join criteria for the meta-judge
6. Each branch runs in its own git worktree
7. When `x<N>` is used, each instance gets its own set of worktrees

## How it works

### Without `x<N>` — single instance

```
cook "use date-fns for formatting" "review" "gate" 5
  vs "roll your own formatter" "review" "gate" 5
  judge "which is easiest to understand?"
```

Execution:

```
worktree-a/  Branch A cook loop (up to 5 iterations)
worktree-b/  Branch B cook loop (up to 5 iterations)
             ↓ both complete
             judge sees both outputs → picks winner
```

1. Cook creates two git worktrees from the current HEAD
2. Branch A and Branch B run their cook loops in parallel
3. Each branch produces its standard cook output (code changes + review files)
4. The judge sees the diffs and review files from both branches
5. Judge picks a winner based on the criteria
6. Winner's worktree is presented to the human for final review

### With `x<N>` — multiple parallel instances

```
cook "use date-fns" "review" "gate" 5
  vs "roll your own" "review" "gate" 5
  judge "easiest to understand"
  x3 "least code wins"
```

Execution:

```
Instance 1:  worktree-1a (5 iter) ─┐
             worktree-1b (5 iter) ─┤→ judge → winner 1
                                   │
Instance 2:  worktree-2a (5 iter) ─┐
             worktree-2b (5 iter) ─┤→ judge → winner 2
                                   │
Instance 3:  worktree-3a (5 iter) ─┐
             worktree-3b (5 iter) ─┤→ judge → winner 3

winners 1, 2, 3 → meta-judge "least code wins" → final pick
```

6 cook loops, 3 judges, 1 meta-judge. The meta-judge criteria ("least code wins") overrides the per-instance judge criteria ("easiest to understand") for the final pick.

## Join strategies

### `judge` — pick a winner

The judge sees:
- The git diff from each branch (relative to the starting HEAD)
- The review/gate files each branch produced
- The judge criteria string

Output: picks one branch as the winner with a short rationale. The winning worktree is preserved; losers are cleaned up.

### `merge` — synthesize the best parts

The merge agent sees the same inputs as judge, plus the criteria for what to combine. It runs its own cook loop (work → review → gate) to produce a merged result. Because merge produces new code, it supports its own iteration cap:

```
merge "take the simpler architecture but keep the error handling" 5
```

And it composes with `x<N>` — each instance produces a merged result, the meta-judge picks the best merge.

### `summarize` — human decides

Produces a `comparison.md` with:
- What each branch did (summary of changes)
- Key differences between approaches
- Trade-offs observed

No winner is picked. The human reads the summary and manually merges the worktree they prefer. Because there's no single output to rank, `x<N>` after `summarize` is an error.

## Examples

### Simple A/B comparison, human decides
```bash
cook "implement auth using passport.js" "review" "does it handle session expiry?" \
  vs "implement auth using custom middleware" "review" "does it handle session expiry?" \
  summarize
```

### Pick a winner
```bash
cook "implement caching with redis" "review" "gate" \
  vs "implement caching with in-memory LRU" "review" "gate" \
  judge "which has fewer dependencies and is easier to deploy?"
```

### Pick a winner, 3 parallel runs
```bash
cook "implement the parser with a state machine" "review" "gate" 5 \
  vs "implement the parser with regex" "review" "gate" 5 \
  judge "which handles edge cases better?" \
  x3
```

### Merge the best parts
```bash
cook "build the UI with raw CSS" "review" "gate" \
  vs "build the UI with tailwind" "review" "gate" \
  merge "use the layout from whichever is cleaner but keep it dependency-free"
```

### Full fat — 6 cook loops, 3 judges, 1 meta-judge
```bash
cook "implement date formatting using date-fns" "review for correctness" "are all edge cases handled?" 5 \
  vs "implement date formatting from scratch" "review for correctness" "are all edge cases handled?" 5 \
  judge "which is easiest to understand?" \
  x3 "least code wins"
```

## Implementation steps

### Step 1: Parse the new grammar

Extend cook's CLI argument parser to recognize `vs`, `judge`, `merge`, `summarize`, and `x<N>`. Validate the rules (summarize + x<N> = error, vs requires a join keyword, etc.). Output a structured config object:

```js
{
  branches: [
    { work, review, gate, maxIterations },
    { work, review, gate, maxIterations }
  ],
  join: { type: 'judge' | 'merge' | 'summarize', criteria: string },
  parallel: { count: 3, criteria: string | null }  // from x<N>
}
```

### Step 2: Worktree management

Add functions to:
- Create N worktrees from current HEAD (`git worktree add`)
- Name them predictably (e.g., `cook-<run-id>-branch-a`, `cook-<run-id>-branch-b`)
- Clean up worktrees when done (preserve the winner)
- Handle the case where worktrees already exist (error or clean up stale ones)

### Step 3: Parallel branch execution

Run cook loops in parallel across worktrees. Each branch is a standard cook loop (work → review → gate → iterate) scoped to its worktree. Use the existing cook loop implementation — just change the working directory.

### Step 4: Implement join strategies

**Judge:** After all branches complete, run a new agent that sees the diffs and reviews from all branches + the judge criteria. It outputs a winner and rationale.

**Merge:** Same inputs as judge, but the agent writes new code in a fresh worktree. This runs its own cook loop (work → review → gate) since it's producing code.

**Summarize:** Same inputs as judge, but outputs a `comparison.md` in the original working directory. No winner picked.

### Step 5: Implement `x<N>` meta-parallelism

Wrap steps 2-4 in a parallel executor that runs N instances. After all instances complete, run a meta-judge that sees the N winners (or N merged results) and picks the best one using the x<N> criteria (or inherited join criteria).

### Step 6: Output and cleanup

- Print the winner's rationale and the path to its worktree
- Offer to merge the winner into the current branch (or leave it for the human)
- Clean up all non-winning worktrees
- For `summarize`, just print the path to `comparison.md`
