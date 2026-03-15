---
title: "Announcing Cook: Because Your Agent Wasn't Actually Done"
date: 2026-03-15
slug: announcing-cook
tags: [ai, agents, tools, cook]
excerpt: Coding agents say "done" when they're not, and every run is a roll of the dice. Cook is a CLI that addresses both problems with review loops and parallel racing.
---

# Announcing Cook: Because Your Agent Wasn't Actually Done

You've been here. The agent says "Done! I've implemented the feature as requested." You review the code and find a half-finished error handler, a TODO comment where validation should be, and a function that technically exists but doesn't actually work. The agent declared victory and moved on.

This is the fundamental problem with coding agents right now: **they say done when they're not done.**

## The "done" problem

If you've ever tried one of those free online code review bots, you already know the pattern. The agent produces something, announces completion, and you discover it deferred half the work to "a future PR" or just quietly skipped the hard parts. The bugs aren't mysterious — the agent ran out of patience (or context) and decided close enough was good enough.

Why does this happen? The agent has no incentive to self-critique. It executed your prompt, produced output, and from its perspective the job is finished. There's no second pass asking "wait, did I actually handle the edge cases?" There's no reviewer pushing back on the shortcuts.

So what do you do? You write another prompt: "Review the code you just wrote and fix the issues." Then you review *that* output and find more problems. So you write another prompt. You're now doing manual QA on an assembly line, and the overhead is eating the productivity gains that made you reach for an agent in the first place.

The models and agent harnesses will get better. This is a transient problem. But right now, today, you need a stopgap — something that automates the review loop so you only get notified when the work is actually done, not when the agent *thinks* it's done.

## The roll of the dice

Here's the other thing: LLMs are non-deterministic. Every run is a roll of the dice.

Same prompt, same codebase, same Tuesday afternoon — and sometimes the agent decides to refactor your entire authentication system when you asked it to fix a typo in a tooltip. It goes down a rabbit hole, blows up scope, introduces a critical regression, and delivers the result with the same confidence as if it had done exactly what you asked.

This isn't a bug you can prompt-engineer away. It's a property of the system. Most of the time the output is good. Sometimes it's unhinged. And when you're shipping code, "sometimes unhinged" is not an acceptable failure mode.

A recent example I hit before building cook: I was building an MCP server. I kicked off two agent instances with the same prompt. Run A used the MCP framework — the obvious, correct approach. Run B decided to write its own MCP framework from scratch. Same prompt, same codebase, completely different interpretation of the task. I only discovered the divergence because I happened to have Claude compare the two PRs afterward. If I'd only run one instance, whichever version I got would have shipped without me realizing there was a fundamentally different (and in one case, fundamentally better) approach.

If you only run one attempt, you're exposed to whatever the model rolls. You have no baseline to compare against. The bad roll ships, and you discover the repercussions later. But the flip side is also true — sometimes the roll of the dice is a *good* thing. An unexpected outlier that's actually better than what you would have specified. You don't want to eliminate variance. You want to see it, compare it, and choose.

## Cook

[Cook](https://github.com/rjcorwin/cook) is a CLI that addresses both problems.

Install it:

```bash
npm install -g @let-it-cook/cli
```

### Review loops: actually done means actually done

Cook automates the work-review-gate cycle. You give it a prompt:

```bash
cook "Add input validation to the signup form per the spec in plans/signup/plan.md"
```

Cook runs three steps in a loop:

1. **Work** — the agent executes your prompt
2. **Review** — a second pass reviews what changed and flags issues by severity
3. **Gate** — a third pass decides: DONE or ITERATE

If the gate says ITERATE, cook loops back to Work with the review findings. If it says DONE, you get notified. Default max iterations is 3 — enough to catch the "I said done but I wasn't" problem without burning tokens on infinite loops.

The point is simple: **you review when the work is actually done.** Not when the agent first claims it's done. Not after you've manually prompted a review and then manually prompted a fix. Cook handles that overhead so you can go do something else and come back to finished work.

### Racing: harness the roll of the dice

For the non-determinism problem, cook has race mode:

```bash
cook "Add dark mode toggle to the settings page" x3
```

This spins up three independent runs of the same prompt, each in its own git worktree branched from HEAD. Each run goes through the full work-review-gate loop independently. When they're all finished, you choose the best result.

In ML, the standard fix for non-determinism is majority voting — run it N times and pick the most common answer. But code isn't a classification task. Sometimes the outlier roll is the one that found a better architecture, a cleaner abstraction, or an approach you hadn't considered. Majority vote would throw that away.

So instead of majority vote, cook gives you two modes for picking the winner:

1. **Prompt-based judging** — you define what "better" means, and a judge agent reads every session log side-by-side and picks. You can make it as specific as you want:

```bash
cook "Add dark mode" x3 "least code wins"
```

2. **Manual pick with automated comparison** — you decide which result is best, and cook automates the comparison review for you, saving you the time of digging through each diff yourself.

Sometimes multiple runs produce good results with different strengths. Pick the one you want and kick off another cook loop to incorporate an aspect from one of the other variants. The dice work for you instead of against you.

### What it supports

Cook works with Claude Code, Codex, and OpenCode. You can configure different agents and models per step — use a fast model for the gate check, a strong model for the work, whatever makes sense for your project. Sandboxing options range from native agent sandboxes to full Docker isolation.

Run `cook init` in your project to scaffold a `COOK.md` template and `.cook/config.json`, then `cook doctor` to verify everything's wired up.

## The bigger picture

Cook isn't a replacement for engineering judgment. You still decide what to build, review the final output, and make the calls the agent can't. What it replaces is the mechanical overhead of running the agent loop yourself — the tedious cycle of "review, prompt to fix, review again" that eats your afternoon.

The models will improve. The agents will get better at knowing when they're actually done. But until that happens, cook is the loop that keeps them honest.

[github.com/rjcorwin/cook](https://github.com/rjcorwin/cook)
