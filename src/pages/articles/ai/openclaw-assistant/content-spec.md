# OpenClaw article content specification

## Target question

Why is a personal assistant harder than wrapping a model in a chat UI?

The article must let a learner reconstruct one current OpenClaw message turn:

1. a channel event enters through an adapter,
2. sender admission happens before private context is loaded,
3. the Gateway resolves an agent and session key,
4. the OpenClaw-owned embedded runtime assembles context and proposes tools,
5. policy and sandbox boundaries constrain effects,
6. outbound delivery produces an explicit outcome,
7. durable state and traces make restart-time verification possible.

## Current-source boundary

- Pin claims to OpenClaw revision `4e5bf66fb18a5f1b7767ad0e159e98d4fbde04b6`.
- Treat `docs/concepts/agent.md`, `session.md`, `architecture.md`,
  `docs/channels/pairing.md`, `docs/tools/skills.md`, and
  `docs/gateway/sandboxing.md` as the public product contract.
- Use current `src/channels/turn/kernel.ts`,
  `src/channels/message/inbound-reply-dispatch.ts`, and message delivery
  sources only to verify the ownership boundary.
- Do not present blog-local teaching stubs as upstream source.
- Do not describe an external Pi Coding Agent SDK as the current primary
  runtime. Current docs define an OpenClaw-owned embedded runtime.
- Do not describe active session state as a JSONL file. Current session rows
  live in per-agent SQLite; transcript files under `sessions/` are archives,
  migration inputs, imports, exports, or support artifacts.

## Required narrative

### 1. Gateway ownership

Explain why the Gateway is the control plane, not merely a WebSocket relay.
Define channel adapter, admission, route, session key, embedded runtime,
effect, delivery outcome, and receipt before deep use.

### 2. Identity and session isolation

Separate these questions:

- Is this sender allowed to reach the agent?
- Which configured agent owns the turn?
- Which conversation state is loaded?

Explain pairing/allowlist before routing, `session.dmScope`, identity links,
group isolation, and why a shared main DM session is unsafe for multi-user
gateways.

### 3. Runtime and effects

Explain OpenClaw-owned model discovery, prompt assembly, tool wiring, session
management, and channel delivery. Distinguish:

- workspace bootstrap instructions,
- skills as instruction bundles with precedence,
- tools as capabilities,
- tool policy as authorization,
- sandbox as runtime enforcement.

### 4. Delivery and restart ambiguity

Explain that model text is not a delivered message. Show normalization,
adapter delivery, explicit outcomes, partial/ambiguous failure, and why blind
retry can duplicate visible effects.

### 5. Durable state and verification

Explain the per-agent SQLite store, transcript archives, incognito exception,
and the fact that incognito does not disable normal tools. End with a
verification checklist and a stop rule.

## Visual contract

Build one DOM-based interactive lab with five stages:

1. admission,
2. route/session,
3. runtime/effect,
4. delivery,
5. evidence.

For each stage show:

- current owner,
- input/handoff,
- what this stage proves,
- what remains unproved,
- a concrete failure symptom.

The lab must:

- use semantic buttons,
- keep every control at least 44px high,
- use two columns on narrow screens and five columns on wide screens,
- wrap long identifiers,
- require no horizontal scrolling at 390, 768, or 1440px,
- use restrained blue, green, and amber only for state meaning,
- contain no decorative metrics, SVG line maze, or nested cards.

## Hidden transfer checks

The body must contain enough causal detail to solve these without printing
them as generic quizzes:

1. An unknown DM sender receives a pairing code. Which stages must not run?
2. The same person contacts the assistant through two channels. When should
   sessions merge, and when should they remain isolated?
3. An incognito session writes a file through a tool. What persists?
4. Two skills share a name. Which source wins, and does that grant a tool?
5. A channel send times out after a visible partial delivery. Why is blind
   retry unsafe and what evidence is needed?

## Stop rule

Stop below the current Gateway/runtime contract. Do not enumerate every
channel plugin, historical package name, or private implementation detail.
The learner is ready to move on when they can assign each failure to
admission, routing/session, runtime/effect, delivery, or evidence.
