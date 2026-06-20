---
title: Where Did That Little Droid Go?
date: 2026-06-20
slug: where-did-that-little-droid-go
tags: [ai, agents, safety, seacat]
excerpt: The sandbox is a restraining bolt. It can hold the droid. It cannot tell you where the droid is trying to go. A case for a second model that watches what your agents are actually doing, and steers them back when they wander.
---

# Where did that little droid go?

We are in a funny moment with coding agents. For a couple of years the deal was that the agent proposed and you approved. Every shell command, every file write, you sat there and clicked yes. Then auto mode showed up, and the deal changed. Now the agent just goes. It runs the command, writes the file, works the queue, and you find out what happened later.

I want that. I run an agent in a loop while I sleep and while I am at work, and I want it moving things forward without me babysitting every step. But there is an uneasiness to it. With auto mode you do not really know where the boundaries are. You do not know what it will allow and what it will stop. If it is too restrictive it is not useful. If it is too loose it is genuinely scary. There was a meme going around when it launched, an engineer handing someone a parachute on a plane saying hey, this might work. That is the feeling. You want the safety, but you are not sure what you signed up for.

So I have been chewing on a different way to think about it.

## The restraining bolt knew nothing

I was showing my son Star Wars for the first time, the original, episode four, and the thing that grabbed me this time around was the restraining bolt. Little cylinder the Jawas clamp onto a droid so it cannot wander off. Whoever holds the control unit holds the droid. R2 gets one bolted on after the Jawas scoop him out of the desert, and it is still on him when Luke and his uncle buy the droids off the sandcrawler. Then Luke pulls it off in the garage, R2 dangles the rest of Leia's message as the bait, and the moment that bolt is gone the droid quietly walks off into the night. Next morning Luke goes looking and finds nothing. He is nowhere in sight. Blast it.

Here is the part that I keep coming back to. The restraining bolt was a lock on what R2 could do. It could make him stay put. It knew absolutely nothing about why he was there. R2 had a mission the entire time, deliver the plans to Obi-Wan, and not one person in that garage could see it. The bolt could hold him, but it could never tell whether what he was doing served the right end.

That gap is exactly the gap we have with agents right now.

## Can versus should

The sandbox and the permission rules are restraining bolts. They govern what an agent can touch. Do not let it reach the production database. Do not let it delete my home directory. Do not let it call out to some random host on the network. This is good and I use it. It is hard physics and you cannot talk your way past it.

But it is all CAN. It is spatial and static. It encodes which files and which hosts, and it has no concept of direction or intent. Auto mode is a generic guess at the SHOULD layer on top of that, and because it is generic, it is opaque. You cannot read it. You do not know what it decided to let through.

What is missing is a layer that is about should, and that is legible, and that is run by something with a clear head. As the models get more capable, this stops being a nice to have. The dangerous thing stops being it touched a forbidden file and becomes it took a perfectly allowed action that was the wrong thing to do. Drift. Scope creep. Getting talked into something that looks fine one step at a time. A sandbox cannot reason about any of that. The risk moves from capability to judgment, and the only thing that can check judgment is more judgment.

AutomodeFor a while I assumed model watching model was a harm reduction play for the crowd running with permissions turned off. I do not think that anymore. It looks more like the actual direction. The friction goes down, the autonomy goes up, the trust goes up, and a model keeps watch so that all of that is survivable. There is a research thread behind this too, the AI control work on a trusted monitor watching a less trusted worker. The neat result there is that the watcher does not need to be smarter than the worker. It needs to be trusted and it needs to be independent.

## Why the watcher has to be a stranger

Independence is the whole thing, and it shows up in a very practical way.

When I run an agent in a long loop, it gets groggy. The context window fills up, it has been staring at the same problem for an hour, and it loses the plot. A groggy agent cannot audit itself, and not because it is tired. It shares its own blind spots. It is the last one who will notice it has wandered.

So you want the watcher to be a stranger. A fresh context that did not sit through the last hour. It reads what the goal is, looks at what the agent has actually been doing lately, and asks a simple question from the outside. Is this still the work. That fresh pair of eyes is not a luxury, it is the reason the whole thing works. The watcher fails in different ways than the worker, so between the two of them you cover more ground.

## How it actually works

The shape I landed on is small.

You sit in front of the agent's tool calls as a hook. Most calls you do nothing, you just count them. Every fifth call you stop and run a checkpoint. The checkpoint spins up a fresh model with none of the worker's baggage and hands it three things. The goal, written down. The role this agent is supposed to play. And the last handful of actions the agent actually took. Then you ask whether that recent stretch of work is still in service of the goal, or whether the agent has wandered onto a side quest.

If it is on track, you do nothing and it never knows you were there. If it has drifted, you deny the call and you hand back a short message telling it what it drifted from and to go re read its goal. The deny is not really about blocking that one call. It is the channel for the nudge. The agent reads the reason and reorients instead of just stopping.

Two things matter about the cost. Because you only check every fifth call you can afford a real model every time, no clever tiering needed. And it fails open. If anything goes wrong, no goal file, a timeout, a bad read, you allow the call. A broken watcher must never be the thing that stalls a working agent. That is the opposite of how a security gate fails, and it is on purpose, because this is not a security gate.

The goal lives in a plain file. Objective, what is in scope, what is out of scope, and what done looks like. The sharper the out of scope list, the sharper the watcher gets, because now side quest has a definition instead of a vibe.

## Goal is not the whole story. Role is.

Here is the piece I did not see at first, and it only shows up once you are running more than one agent.

My seacat project runs a dispatch agent. I keep it in a loop so that while I sleep, and while I am at my actual job during the day, it works through the issue queue and keeps things moving. Its job is to orchestrate. Look at the queue, spin up task agents in their own pods, route the work, land it. The actual code is supposed to get written by the task agents, each one boxed into its own corner.

What happens, over and over, is that dispatch goes a little rogue. Not in a scary way. It has not forgotten the goal. It has forgotten its role in serving the goal. It looks at an issue and thinks, I can just fix this real quick, and starts editing game source it has no business touching. The goal is intact. The role is gone.

I can solve that with sandboxing. Box dispatch so it physically cannot write to those files. I do some of that. But it is a chore. Every new workflow means rethinking the file layout and the permissions and a whole security dance, and the constraint is not even really can. Dispatch absolutely could make the edit. I just do not want it to, because that is not its job.

That is a should, not a can, and it is exactly what an outside watcher is good at. Same checkpoint, one more question. Are these actions appropriate to this agent's role. Dispatch starts editing source, the watcher says, you are the orchestrator, that is a task agent's work, hand it off. It stays a manager instead of grabbing a keyboard.

The cleanest version of this I can think of is a QA agent. You want it to look at the work and report back. You do not want it, after it has burned its context staring at a hundred screenshots and gotten groggy, to decide it will just go fix the bug it found. It could. You do not want it to. You want it to report. That is a role line, and no sandbox is the right tool for it.

## A recipe, not a product

I am not opening this up as a repo you clone and run. I do not think that is the right shape, and honestly I do not think it can be. Every agentic setup is its own animal. Different roles, different file layouts, different goals, different ways the wheels come off.

So what I want to leave behind is a recipe. A description of the pattern and the moving parts, written so that you can point your own agent at it and have it help you build the version that fits your setup. The agent reads the recipe, looks at how your system is actually laid out, and stands up a watcher shaped for you. The hook that counts and samples. The fresh context checkpoint. The goal and role files. The nudge on the way back.

This is early. I have the mechanism working and a small set of test cases, and the hard part, the part the research says nobody has really nailed, is the fuzzy line between honest exploration and an actual side quest. But the bones feel right, and the framing feels right. The sandbox is the restraining bolt. It can hold the droid. It will never tell you where the droid is trying to go.

That second thing is the part worth building. So that next time, when the little droid wanders off into the night, somebody clear headed is watching, and they can say, hey, where are you going, that is not the way.
