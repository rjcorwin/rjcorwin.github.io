# RPI Guide: Advanced

Builds on the [intermediate track](../2-intermediate/) with two additions:

- **Review loops on every phase** — The intermediate track introduced the work-review-gate loop for implementation. Here, we extend the same pattern to research and plan. The CONTRIBUTING.md for this track adds `research-review-NNN.md`, `plan-review-NNN.md`, and their corresponding gate steps.
- **Cook automation** — Instead of manually running three prompts (work, review, gate) per phase, the [cook](https://github.com/rjcorwin/cook) CLI runs one command and loops the agent through the cycle until it's satisfied.

## Prerequisites

- Complete the [intermediate track](../2-intermediate/) (or at least read it — you need to understand the plan folder structure and the implementation review loop you saw there)
- Read [CONTRIBUTING.md](https://gist.github.com/rjcorwin/296885590dc8a4ebc64e70879dc04a0f) — note the new review/gate steps on Research and Plan compared to the intermediate version
- Install [cook](https://github.com/rjcorwin/cook): `npm install -g @let-it-cook/cli`
- Run `cook doctor` to verify your setup

## Step 0: Generate the todo app

If you haven't already, generate the todo app:

**Prompt:**
```
Create a simple todo app using HTML, CSS, and vanilla JavaScript in a single index.html file. It should support adding, completing, and deleting todos. Keep it simple — no frameworks, no build tools.
```

## Step 1: Set up the plan folder

```bash
curl https://gist.githubusercontent.com/rjcorwin/296885590dc8a4ebc64e70879dc04a0f/raw/46035954b5a0423c0c62b96c3ff8e9295169bf4f/CONTRIBUTING.md > CONTRIBUTING.md
mkdir -p plans/x7k-dark-mode
git checkout -b x7k-dark-mode
```

This is the same plan folder setup from the intermediate track. The difference is the CONTRIBUTING.md you're downloading — it now defines review and gate steps for all three phases, not just implementation.

## Research — One cook command

In the intermediate track, research was a single AI:Work prompt followed by your review. Now CONTRIBUTING.md defines a full work-review-gate cycle for research too — the AI writes `research.md`, reviews it in `research-review-001.md`, and gates whether it needs another pass. This matters because research is where the system architecture gets documented and open questions get surfaced — it's not worth your time to review until the AI has had a chance to double-check its own work. The review loop lets it catch incomplete architecture analysis or missing questions before it reaches you. Cook automates this entire cycle:

```bash
cook "We're going to add a dark mode / light mode toggle to our todo app.

Requirements:
- User can switch between dark and light themes
- The toggle should be visible and accessible
- Theme preference should persist across page reloads

Read the existing codebase first, then write plans/x7k-dark-mode/research.md per CONTRIBUTING.md."
```

Cook will:
1. **Work** — The agent writes `research.md`
2. **Review** — A second pass reviews the output in `research-review-001.md` and flags gaps
3. **Gate** — A third pass decides if the review passes or if the agent needs to iterate

If the gate says "ITERATE", cook loops back automatically. When it says "DONE", you get the result.

**Human:Review** — You still make the decisions. For each open question, ask the AI to present options with pros and cons, pick one, and have the agent update `research.md` with your decision. (Same process as the [beginner](../1-beginner/#making-decisions) and [intermediate](../2-intermediate/#humanreview--your-turn) tracks.)

## Plan — One cook command

Same expansion here. In the intermediate track, planning was a single AI:Work prompt. Now it gets the full work-review-gate cycle too — the AI writes `plan.md`, reviews it in `plan-review-001.md`, and gates whether it needs revision.

```bash
cook "Read plans/x7k-dark-mode/research.md for decisions and context. Write plans/x7k-dark-mode/plan.md per CONTRIBUTING.md."
```

**Human:Review** — Read the plan, approve or edit.

## Implement — Cook loop over plan phases

You already saw the implementation review loop in the intermediate track — work, review, gate with `devlog-NNN.md` and `code-review-NNN.md`. The loop is the same here, but now cook runs it for you.

If your plan has multiple phases or steps, you can run cook once per phase, letting it handle the iteration within each:

```bash
cook "Read CONTRIBUTING.md for context. Read plans/x7k-dark-mode/plan.md. Implement step 1: [description]. When done, write plans/x7k-dark-mode/devlog-001.md."
```

```bash
cook "Read CONTRIBUTING.md for context. Read plans/x7k-dark-mode/plan.md and plans/x7k-dark-mode/devlog-001.md. Implement step 2: [description]. When done, update devlog-001.md."
```

Each cook command handles the work-review-gate cycle for that step. You review between steps — checking the devlog and the code — and move on when satisfied.

For a plan with N steps, this becomes a simple loop if you want to let it run and review the results of all phases. This is referred to as a "Ralph Wiggum Loop", or simply ralph loop:

```bash
for step in {1..3}; do cook "Read plans/x7k-dark-mode/plan.md. Implement step $step and then write a devlog per CONTRIBUTING.md"; done
```

`{1..3}` is bash brace expansion — it generates `1 2 3`. Change the range to match however many steps your plan has (e.g., `{1..7}`). If cook hits its max iterations (default is 3) without the gate passing, it exits with an error and the loop breaks — this prevents moving on from a step with a broken implementation. When that happens, review the devlogs and review files to find out what went wrong.

## What changed from intermediate?

| | Intermediate | Advanced |
|---|---|---|
| Research review loop | None — AI:Work then Human:Review | Work-review-gate, automated by cook |
| Plan review loop | None — AI:Work then Human:Review | Work-review-gate, automated by cook |
| Implementation review loop | 3 manual prompts (work, review, gate) | 1 cook command per phase |
| Iteration on failures | You re-run prompts manually | Cook loops automatically |
| Human checkpoints | Same | Same — you still review between phases |
| Plan execution | One big implement prompt | One cook command per plan step |

The human checkpoints don't change. You still make the decisions, review the research, approve the plan, and test the implementation. Cook just removes the mechanical overhead of running the agent loop yourself — and now that overhead extends to research and planning too, where the intermediate track didn't have review loops at all.

## Iterating back to Research

Sometimes implementation reveals decisions that were never made explicitly — they got made on the fly, buried in code. When the debrief surfaces judgment calls you didn't anticipate, don't patch over it. Reset and run the loop with what you learned.

### Step 1: Extract the implicit decisions

Read the debrief. For each judgment call the agent made, add it to `research.md` as a resolved open question.

```bash
cook "Based on the devlog, add any decisions you made during implementation to plans/x7k-dark-mode/research.md as resolved open questions."
```

Review what it added. Correct any decisions you'd make differently.

### Step 2: Revert the implementation and delete the plan

```bash
git checkout .
rm plans/x7k-dark-mode/plan.md
```

`research.md` is untracked or committed separately — only the code changes get discarded.

### Step 3: Re-run the loop

Run `/clear`, then go straight to the Plan phase. Research is already done — `research.md` now has the full picture including decisions from the first pass. The second implementation starts with a complete picture, so the agent isn't guessing and neither are you.
