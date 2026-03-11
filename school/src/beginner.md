# RPI Guide: Beginner

The simplest version of RPI. No special file structure, no agent review loops. Just you, an AI agent, and three phases.

All three tracks use the same example: generate a simple todo app, then add a dark mode/light mode switcher using the RPI methodology. This will be a bit contrived since we want to focus on the prompting required to keep us in the loop and not get too in the weeds on the architecture of a system you're unfamiliar with. The goal is that you'll then be able to take these prompts and dig in on a task related to your domain.

## Step 0: Generate the todo app

Before we can research a change, we need something to change.

**Prompt:**
```
Create a simple todo app using HTML, CSS, and vanilla JavaScript in a single index.html file. It should support adding, completing, and deleting todos. Keep it simple — no frameworks, no build tools.
```

Open `index.html` in a browser and click around. This is the codebase we'll be working with.

## Research

We ask the AI to explore the codebase and surface what we need to know — not to implement anything yet.

**Prompt:**
```
I want to add a dark mode / light mode toggle to this todo app.

Requirements:
- User can switch between dark and light themes
- The toggle should be visible and accessible
- Theme preference should persist across page reloads

Read the existing codebase first, then write a research.md file covering:
- What are the requirements?
- How is the current code structured? What parts would this feature touch?
- What decisions do we need to make before building this? List them as open questions, and for each question list the options with pros and cons.
```

**What to look for in the output:**

The AI should produce a `research.md` that:
- Describes the current architecture (how the CSS is structured, where styles live)
- Identifies the components the change touches
- Raises open questions like:
    - Where do we store the preference? (`localStorage`? cookie? server-side?)
    - Do we use CSS custom properties (variables) or swap entire stylesheets?
    - Where does the toggle go in the UI?
    - Should the default theme match the OS preference via `prefers-color-scheme`?

These open questions are the whole point. The AI is surfacing decisions *for you*. You haven't written a line of code, but you're already building a picture of what this feature involves.

### Making decisions

Now it's time to decide. The research doc already has the options and tradeoffs laid out — read through them and pick one for each open question. Then tell the agent your decisions and have it record them:

**Prompt:**
```
Go with localStorage. Update research.md to record this decision under the open questions section.
```

Repeat for each open question: ask for options, review them, decide, and have the agent update the doc. By the end, every open question in `research.md` should have a decision recorded next to it.

**Clear the context before moving on.** Run `/clear` in Claude Code. This keeps the next phase focused and prevents the agent from carrying forward assumptions from the research conversation.

## Plan

Now that we have research with decisions made, we ask the AI to write a concrete plan.

**Prompt:**
```
Read research.md. Based on the decisions documented there, write a plan.md that describes the specific code changes needed to implement dark mode. Include:
- What files change
- What gets added, modified, or removed
- The order of operations
```

**Review the plan.** Does it match your decisions? Does anything look wrong or overcomplicated? Edit it if needed. This is your last checkpoint before code gets written.

**Clear the context before moving on.** Run `/clear` in Claude Code.

## Implement

**Prompt:**
```
Read plan.md. Implement the changes described in the plan.
```

Once it's done, ask it to debrief:

**Prompt:**
```
What work did you do, what were the tricky parts, and what decisions did you have to make along the way?
```

This is how you catch surprises. If the agent had to make a judgment call or hit something unexpected, you want to know before it's worth your time testing and reading the code — and in the worst case, before you ship a decision you didn't realize was made. Review the debrief, then test the app: toggle the theme, reload the page, check that preference persists. Lastly, review the code.

If decisions surfaced during implementation that weren't in the research, the right move is to reset the implementation and go back to research with what you now know. The [advanced track](../3-advanced/) covers how to handle that loop.

## What did we just do?

We produced the ultimate ticket before writing any code:
1. **The request** — clearly scoped: add dark/light mode toggle
2. **Documentation** — the AI mapped the existing architecture and how the change touches it
3. **Decisions** — the AI identified the choices, we made them

Each phase built on the last, and we stayed in control of the decisions that matter.

Ready for more structure? Move on to the [Intermediate Guide](../2-intermediate/).
