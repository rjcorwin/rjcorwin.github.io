---
title: How Coding Agents Work (And Why You're Still the Engineer)
date: 2026-03-11
slug: how-coding-agents-work
tags: [ai, workflow, agents]
excerpt: Coding agents are powerful but they don't know your organization, your constraints, or anything truly novel. Here's how I think about the split.
---

# How Coding Agents Work (And Why You're Still the Engineer)

The framing I keep coming back to: a coding agent is a very capable new hire who has read every public codebase on the internet but has never worked at your company, doesn't know your team's conventions, and has no memory of what you decided last Tuesday.

That framing changes how you use them.

## The slot machine problem

Prompting an agent to just implement something has been compared to pulling a slot machine. You prompt, hope for the right output, and when it's wrong you pull again — "no, not that, do this instead." The agent responds "Of course!" and tries again.

Here's what's happening during that spiral:

- The codebase is getting more complex with each pull (spaghettification)
- The context window is filling up, so the agent is getting progressively dumber
- Some evidence suggests it in-context learns to give you worse results the longer you go

The goal of doing some upfront planning is to minimize rework and avoid the spiral entirely.

## Research, Plan, Implement

The methodology I use is called RPI: Research, Plan, Implement. Instead of jumping straight to implementation, you break the work into phases.

1. **Research** — With the agent's help, document the work before any code is written: the request, the relevant parts of the codebase, and the decisions that need to be made.
2. **Plan** — Document the specific code changes required to implement the feature.
3. **Implement** — Have the agent execute the plan.

The key insight is that you reset context between phases. Each phase starts fresh with only the relevant documents loaded. This keeps the agent sharp and the output focused.

## What agents are actually good at

Agents are exceptional at pattern matching against what they've been trained on. Give them a clear, specific task with good context and they'll execute it faster and more thoroughly than you could.

They're also good at documentation, at exploring a codebase you hand them, and at writing boilerplate you'd rather not write yourself.

## What you have to bring

**Organizational context.** The agent doesn't know your team conventions, your business constraints, your historical decisions, your user needs, or why that one weird thing in the codebase is the way it is. You do. You have to provide that context — either directly in the prompt or in structured documents the agent can read.

**Engineering judgment.** LLMs pattern-match against their training data. If the solution you need exists somewhere in that distribution, they can find it. But anything truly novel — architecture the world hasn't built yet, creative leaps, decisions that require weighing tradeoffs your organization cares about — that's yours. The agent can help with the parts that look like things it's seen. The rest is engineering.

**Decisions.** Every non-trivial software decision requires context the agent doesn't have. You keep the decision authority. The agent helps you think through options and execute the one you pick.

---

This is the theory behind the three levels in [How RJ Codes With AI](/school/). Each level is the same todo app feature, implemented with increasing structure and automation — so you can see concretely what changes as the methodology gets more rigorous.
