---
title: What's on the Box vs. What's in the Box
date: 2026-09-13
slug: whats-on-the-box-vs-whats-in-the-box
tags: [ai, agents, code-review]
excerpt: Blast radius tells you when to read AI-written code. It doesn't tell you what reading it gives you that a plan and the output can't. A few analogies I've been thinking with.
---

# What's on the box vs. what's in the box

Boris Cherny, the original author of Claude Code, recently [shared an email](https://x.com/bcherny/status/2098217571153838124) laying out two views on AI-written code. View 1: code is accelerated by AI but stays reviewable, the submitter can explain it, and it's built to be maintained. View 2: vibe code, treat it as a black box, just check the output. His answer: room for both. Prototypes can be black boxes; production needs a higher bar. Someone added that the bar should scale with blast radius, read every line if it touches credit cards or logins. Boris: "exactly."

I agree with all of that, but blast radius only tells you *when* to read the code. It doesn't answer the question underneath: what does reading code give you that reviewing the plan and the output can't?

Here's the analogy I keep coming back to. The plan and the description of the code are the picture on the toy box. Open the box and the thing inside can have a different shape. Sometimes it's the shape that fails: we've all seen the bug report that produces a test we didn't know we needed. If you don't know the shape of the code, you don't know how it can fail. And sometimes it's extra shape, the stuff we never asked for. You asked for a knife, and now a customer is complaining about the corkscrew. You didn't even know you were shipping a corkscrew.

**The plan tells us what's on the box. The code tells us what's actually in the box.**

When I review a PR, I'm asking three questions: does it *Work* as expected, can we *Own* it, and now that we can try it, do we *Want* it? Agentic engineering is making the first and third cheaper: better harnesses for testing, more directions explored before we commit. But Own is the constraint between them. Work and Want tell you what's possible; Own tells you what you can afford. If we give up understanding the code, our ability to answer the other two questions erodes with it, because we no longer know what shape we've taken on.

That's where my head's at. Interested in what analogies others are using.
