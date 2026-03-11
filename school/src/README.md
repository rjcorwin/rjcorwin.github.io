# RPI with Coding Agents

Research, Plan, Implement (RPI) is a methodology for writing software with Agentic Coding Tools. Instead of prompting an AI to implement and hoping for the best, we break the work into phases where the AI helps us understand, decide, and then build.

1. **Research** — With AI's help, we create what equates to the ultimate ticket:
    1. The request
    2. Documentation for the related parts of the code
    3. Decisions we need to make
2. **Plan** — We document the code changes required.
3. **Implement** — We have the AI coding agent implement the plan.

## Why not just prompt and implement?

Prompting to implement has been equated to a slot machine. You keep pulling hoping to get lucky. When it doesn't give you the results you want, you start pulling again with prompts like "No not that, this", and the agent responds, "Of course!".

What is happening during this spiral:
0. The models are trained to do what you request, and their praise of the request is sycophantic.
1. Complexity of the code base is increasing on each pull (spaghettification)
2. Context window of the agent is filling up so it's getting dumber
3. Some speculate that it is in-context learning to give you bad results

The goal of some up front planning is to minimize rework to prevent spirals.

## What is our role?

LLMs seem impressive and all-knowing, but they are not replacing us. We must be the decision makers for two reasons.

1. They lack the context of your organization, we provide it
    - They are a new person on the job — they don't know what they don't know
    - Every decision in software development requires organizational context: team conventions, business constraints, historical decisions, dependencies, user needs
    - LLMs cannot hold that context in their heads — it's not in the training data, and it won't fit in a single prompt
2. Humans provide the engineering — LLMs provide pattern matching on what they've been trained on
    - If the solution you need is outside the distribution of what the LLM has seen, its ability to engineer is quite limited
    - Anything truly novel — something that has never been created before — requires human engineering judgment
    - The LLM can help with the parts that look like things it's seen, but the creative leaps and novel architecture are yours

## Tracks

This walkthrough comes in three levels. Pick the one that fits:

- **[Beginner](1-beginner/)** — Simplified prompts, flat file structure, no agent review loops. Good for getting the feel of RPI.
- **[Intermediate](2-intermediate/)** — Adds structured plan folders, [CONTRIBUTING.md](https://gist.github.com/rjcorwin/296885590dc8a4ebc64e70879dc04a0f) conventions, and AI self-review loops. Good for real projects.
- **[Advanced](3-advanced/)** — Automates the agent review cycles using the [cook](https://github.com/rjcorwin/cook) CLI. Good for when you trust the process and want speed.

Learn about the theory behind RPI from Dax: https://www.youtube.com/watch?v=rmvDxxNubIg
