# RPI Guide: Intermediate

The [beginner track](../1-beginner/) gave you the shape of RPI — research, plan, implement — with you reviewing the output at each phase. The intermediate track builds on that with three additions:

- **Decision docs** — when an open question is too complex to answer off the top of your head, you ask the agent to write a decision doc laying out the options with pros and cons before you commit
- **Structured plan folders** — the repo gets a CONTRIBUTING.md defining the workflow and templates, and every feature gets a plan folder to keep its research, decisions, and implementation history together
- **Implementation review loop** — after the agent implements, it reviews its own code and decides if it's ready before you spend time on it

## Prerequisites

- Complete the [beginner track](../1-beginner/) or understand the basics of Research, Plan, Implement
- Read CONTRIBUTING.md (in this folder) — it defines the full file structure, workflow steps, and templates used in this track

## Step 0: Generate the todo app

If you haven't already, generate the todo app:

**Prompt:**
```
Create a simple todo app using HTML, CSS, and vanilla JavaScript in a single index.html file. It should support adding, completing, and deleting todos. Keep it simple — no frameworks, no build tools.
```

## Step 1: Set up the plan folder

Every feature gets its own plan folder and git branch. This keeps research, planning, and implementation artifacts organized and tied to a PR.

```bash
mkdir -p plans/x7k-dark-mode
git checkout -b x7k-dark-mode
```

## Research

### AI:Work — Write research.md

**Prompt:**
```
We're going to add a dark mode / light mode toggle to our todo app.

Requirements:
- User can switch between dark and light themes
- The toggle should be visible and accessible
- Theme preference should persist across page reloads

Read the existing codebase first, then write plans/x7k-dark-mode/research.md per CONTRIBUTING.md.
```

Same output expectations as the beginner track, but now following the structured template from CONTRIBUTING.md.

**Run `/clear`.**

### Human:Review — Your turn

Read the research document. For straightforward questions, just pick an option and record it:

**Prompt:**
```
Go with localStorage. Update plans/x7k-dark-mode/research.md to record this decision under the open questions section.
```

For harder questions, ask the agent to write a decision doc first so you can explore the options in depth:

**Prompt:**
```
Write a decision doc in plans/x7k-dark-mode/ for the toggle placement question per CONTRIBUTING.md.
```

Read the decision doc, pick an option, then record it in research.md. Repeat for each open question until every decision is resolved.

**Run `/clear`.**

## Plan

### AI:Work — Write plan.md

**Prompt:**
```
Read plans/x7k-dark-mode/research.md for decisions and context. Write plans/x7k-dark-mode/plan.md per CONTRIBUTING.md.
```

**Run `/clear`.**

### Human:Review — Approve the plan

Read the plan. Does it match your research decisions? Is anything overcomplicated or missing? Edit and approve before moving on.

**Run `/clear`.**

## Implement

This is where the cook loop comes in. Each step runs in a fresh context — run `/clear` between them.

### AI:Work — Implement and write devlog

**Prompt:**
```
Read plans/x7k-dark-mode/plan.md. Implement the plan. When done, write a new devlog in the plan folder per CONTRIBUTING.md covering what was done, tricky parts, and any decisions made.
```

The devlog replaces the manual debrief from the beginner track — instead of asking "what was tricky?" after the fact, the agent documents it as a persistent artifact.

**Run `/clear`.**

### AI:Review — Write code review

**Prompt:**
```
Review the implementation against plans/x7k-dark-mode/plan.md, read the latest devlog in the plan for context on how implementation went, read through the implementation's code changes, and then write a code review file in the plan folder per CONTRIBUTING.md.
```

**Run `/clear`.**

### AI:Gate — Ship it?

**Prompt:**
```
Read the latest devlog and latest code review in plans/x7k-dark-mode/. Are there any High issues? If yes, write a new plan in the plan folder with fixes needed per CONTRIBUTING.md. If no, write plans/x7k-dark-mode/pr.md and confirm ready for human review.
```

If the gate says revision is needed, run `/clear`, go back to AI:Work with the new plan, and loop again. If it passes, move on.

### Human:Review — Final approval

Test the implementation. Review the PR description. Merge when satisfied.

Ready to automate the loops? Move on to the [Advanced Guide](../3-advanced/).
