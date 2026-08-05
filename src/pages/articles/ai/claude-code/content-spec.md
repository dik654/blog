# Claude Code product-runtime case content specification

## Target question

When Claude Code proposes a tool call, which component decides whether an
external effect may happen, which boundary enforces it, and what evidence is
fed back before the agent continues?

## Source boundary

- Public product documentation is the source of truth for observable behavior.
- The public `anthropics/claude-code` checkout is pinned at
  `7ef6eec9d9ba84ea6f233f26c45f1df5c5991843`.
- That repository exposes product documentation, release notes, and official
  plugin examples. It does not expose the proprietary Claude Code runtime.
- Do not present bundled blog examples, leaked prompts, or inferred TypeScript
  files as the product's implementation.

## Required structure

1. Start from one concrete coding turn and separate model proposal, permission
   decision, OS-enforced Bash boundary, side effect, observation, and terminal
   report.
2. Explain why a coding agent is more than a chatbot without inventing loop
   counts, concurrency limits, or a fixed context-window budget.
3. Explain current permission rule precedence and distinguish permission modes
   from the sandbox. Cover the stable conceptual roles of Manual/default,
   acceptEdits, plan, conditional auto, dontAsk, and bypassPermissions without
   presenting them as a single linear safety score.
4. Explain that sandboxing applies to Bash and child processes, while built-in
   file tools are governed by permission rules.
5. Explain extension loading by lifecycle: CLAUDE.md, skill descriptions and
   bodies, MCP tool names and schemas, isolated subagents, and hooks.
6. End with a verification path that checks diff, command exit, test semantics,
   and unexpected side effects rather than trusting the final prose alone.

## Forbidden claims

- Average 21.2 tool calls per request.
- A universal maximum of seven subagents.
- A universal 200K context with 160-170K usable tokens.
- Ask, Auto-Allow, and YOLO as the official three permission modes.
- Sandboxing became default in v1.0.20.
- Sandboxing reduces prompts by exactly 84%.
- Plan + deny + sandbox has a 98% prompt-injection defense rate.
- The public GitHub repository contains the proprietary runtime.
- Permission approval and sandbox enforcement are the same decision.

## Visual contract

Use one DOM-based causal lab with four stable controls:

1. Request: assemble user goal and project context.
2. Proposal: distinguish model output from an executed effect.
3. Decision: show permission policy and Bash sandbox as different layers.
4. Observation: feed tool result back and decide whether to repeat or stop.

At each step show the current owner, handoff payload, what is proved, and what
is not yet proved. Controls are at least 44 CSS pixels high, use a two-column
mobile and four-column desktop grid, and never require horizontal scrolling.

## Hidden transfer checks

1. In plan mode the model emits an Edit proposal. Can the reader predict why
   planning intent is not itself an edit authorization?
2. An allow rule permits Bash, but the command reaches a denied filesystem
   path. Can the reader explain the distinct permission and sandbox outcomes?
3. `npm test` exits zero after an edit. Can the reader state what this proves
   and which product acceptance checks are still missing?
4. A subagent returns a confident summary. Can the reader identify which
   context it inherited, which it did not, and why the lead still verifies?
5. An MCP tool is visible in the session. Can the reader distinguish tool-name
   discovery, deferred schema loading, permission, and actual execution?

## Stop rule

Stop once the learner can assign one owner to proposal, authorization,
enforcement, effect, observation, and verification. Do not reverse-engineer the
closed runtime or descend into the history of every Claude Code release.
