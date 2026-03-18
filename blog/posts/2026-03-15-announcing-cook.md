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

If you've ever tried one of those free online code review bots, you already know the pattern. The agent produces something, announces completion, and you discover it deferred half the work to "a future PR" or just quietly skipped the hard parts. The bugs aren't mysterious. The agent ran out of patience (or context) and decided close enough was good enough.

Why does this happen? Two things. First, LLMs are trained to reach a stopping point. Something about the fine-tuning process, likely the stop token conditioning, biases them toward wrapping up rather than pushing through the hard parts. They'd rather declare done and move on than keep digging. Second, the agent harnesses themselves don't have any built-in automation to check the agent's work. There's no second agent reviewing the output, no gate that says "wait, you skipped the error handling." The agent runs, it stops, and that's it.

So what do you do? You write another prompt: "Review the code you just wrote and fix the issues." Then you review *that* output and find more problems. So you write another prompt. This is a waste of your time. Human time is the bottleneck. Every minute you spend manually shepherding the agent through review cycles is a minute you're not spending on the work that actually requires your judgment.

Agent harnesses will eventually build review automation in. Until then, you need something that keeps the agent in a loop so you only get notified when the work is actually done, not when the agent *thinks* it's done.

## The roll of the dice

Here's the other thing: LLMs are non-deterministic. Every run is a roll of the dice.

Same prompt, same codebase, same Tuesday afternoon, and sometimes the agent decides to refactor your entire authentication system when you asked it to fix a typo in a tooltip. It goes down a rabbit hole, blows up scope, introduces a critical regression, and delivers the result with the same confidence as if it had done exactly what you asked.

This isn't a bug you can prompt-engineer away. It's a property of the system. Most of the time the output is good. Sometimes it's unhinged. And when you're shipping code, "sometimes unhinged" is not an acceptable failure mode.

A recent example I hit before building cook: I was building an MCP server. I kicked off two agent instances with the same prompt. Run A used the MCP framework, the obvious, correct approach. Run B decided to write its own MCP framework from scratch. Same prompt, same codebase, completely different interpretation of the task. I only discovered the divergence because I happened to have Claude compare the two PRs afterward. If I'd only run one instance, whichever version I got would have shipped without me realizing there was a fundamentally different (and in one case, fundamentally better) approach.

If you only run one attempt, you're exposed to whatever the model rolls. A bad roll means you waste your time in review trying to figure out why the code looks wrong, or worse, you don't catch it and ship it. But the flip side is also true. Sometimes the roll of the dice is a *good* thing. An unexpected outlier that's actually better than what you would have specified. You don't want to eliminate variance. You want to see it, compare it, and choose. In ML, the standard fix for non-determinism is majority voting, but code isn't a classification task. Sometimes the outlier roll is the one that found the better architecture. Majority vote would throw that away.

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

1. **Work**: the agent executes your prompt
2. **Review**: a second pass reviews what changed and flags issues by severity
3. **Gate**: a third pass decides DONE or ITERATE

If the gate says ITERATE, cook loops back to Work with the review findings. If it says DONE, you get notified. Default max iterations is 3, enough to catch the "I said done but I wasn't" problem without burning tokens on infinite loops.

The point is simple: **you review when the work is actually done.** Not when the agent first claims it's done. Not after you've manually prompted a review and then manually prompted a fix. Cook handles that overhead so you can go do something else and come back to finished work. Your time goes where it matters: the final review and the decisions only you can make.

### Racing: harness the roll of the dice

For the non-determinism problem, cook has race mode:

```bash
cook "Add dark mode toggle to the settings page" x3
```

This spins up three independent runs of the same prompt, each in its own git worktree branched from HEAD. Each run goes through the full work-review-gate loop independently. When they're all finished, you choose the best result.

Instead of majority vote, cook lets you define what "better" means. You can use it in two modes:

1. **Prompt-based judging**: you give it a definition of better, and a judge agent reads every session log side-by-side and picks.

```bash
cook "Add dark mode" x3 "least code wins"
```

2. **Manual pick with automated comparison**: you decide which result is best, and cook automates the comparison review for you, saving you the time of digging through each diff yourself.

Sometimes multiple runs produce good results with different strengths. Pick the one you want and kick off another cook loop to incorporate an aspect from one of the other variants. The dice work for you instead of against you.

### What it supports

Cook works with Claude Code, Codex, and OpenCode. You can configure different agents and models per step. Use a fast model for the gate check, a strong model for the work, whatever makes sense for your project. Sandboxing options range from native agent sandboxes to full Docker isolation.

Run `cook init` in your project to scaffold a `COOK.md` template and `.cook/config.json`, then `cook doctor` to verify everything's wired up.

## The bigger picture

Human time is the bottleneck. Cook exists to protect it. Instead of manually running review cycles and hoping one agent run didn't go off the rails, you get automated review loops and parallel runs that surface the best result. You spend your time on decisions and final review, not on babysitting.

[github.com/rjcorwin/cook](https://github.com/rjcorwin/cook)
