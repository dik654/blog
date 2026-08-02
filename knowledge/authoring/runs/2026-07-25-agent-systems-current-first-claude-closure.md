# Agent Systems current-first reconstruction

Date: 2026-07-25

## Objective

Rebuild the Agent Systems route so a reader starts from the runtime used by
current production agents, then descends only to the minimum foundations needed
to explain it. The route must not read like a framework catalog. It must let the
reader answer operational questions about authority, state, retries, protocols,
computer use, coordination, safety, and evaluation.

## Reader contract

After reading the core route, the reader should be able to explain and diagnose
this hidden challenge without relying on product names:

1. A remote agent reads an invoice PDF, queries a legacy GUI, and calls a payment
   API through an MCP tool.
2. The UI is partially occluded and changes after every action.
3. The payment call times out after the server may already have committed it.
4. A coordinator delegates fraud review to another agent.
5. The process is restarted before the final answer is returned.

The route is deep enough only if the reader can identify:

- which component observes, proposes, authorizes, executes, and verifies;
- why a transcript is not a durable checkpoint;
- why a screenshot revision differs from a session revision;
- why a timeout is an unknown outcome rather than a failed outcome;
- how an idempotency key and receipt lookup prevent duplicate effects;
- where MCP ends and A2A begins;
- which evidence must survive a restart;
- which actions require a policy or human gate.

## Structural decision

The sidebar parent is `에이전트 시스템`, with six aggregate branches:

1. `00 · 현재 Runtime`
2. `01 · 도구 · Computer Use`
3. `02 · 장기 작업 · Coordination`
4. `03 · 안전 · 평가`
5. `04 · 공통 기반`
6. `05 · 제품 사례`

The core learning path is deliberately shorter than the whole category:

1. Current runtime
2. Computer use
3. Coordination
4. Durable harness
5. Safety
6. Evaluation
7. Tool protocol
8. Context
9. Agent loop

Prompting, source-format examples, and product case studies remain available but
do not interrupt the core route. Claw Code stays under implementation and
operations because it is a concrete system build, not a conceptual prerequisite.

## Content reconstruction

### Current runtime

`agent-runtime-current-first.tsx` separates the model from the harness,
workspace, durable state, and effect boundary. It then compares four action
surfaces: API, shell, GUI, and remote agent. The article includes:

- PDF as unstructured observation input whose extracted values require checks;
- host-managed MCP client discovery and invocation;
- A2A task states and artifacts;
- reducer-based durable state;
- timeout receipt lookup and retry with the same idempotency key;
- a failure-route chooser that sends each failure to the owning layer.

### Computer use

`computer-use-agent-runtime.tsx` treats GUI automation as a partially observed
control loop, not as coordinate replay. It defines:

- screenshot revision versus session revision;
- occlusion and hit testing;
- observe, ground, propose, gate, act, verify;
- action approval hashes;
- ambiguous timeout handling;
- evidence-oriented evaluation.

### Coordination

`multi-agent-implementation.tsx` now explains task envelopes, agent cards,
lifecycle states, artifacts, verifiers, leases, and merge ownership before
showing orchestration patterns.

## Source ledger

Only primary or official sources support current product and protocol claims:

- OpenAI Agents SDK and Responses computer environment documentation
- Model Context Protocol specification and security guidance
- Agent2Agent protocol specification
- Anthropic prompt-injection guidance for browser agents

Current claims were checked for role ownership, protocol boundary, task states,
and execution semantics. Product examples are evidence, not the organizing
taxonomy.

## Claude collaboration record

Broad, multi-file audits failed three times with Context Manager 500/timeout.
Those outputs were not accepted as reviews. The work was partitioned by bounded
responsibility and retried in parallel.

Accepted responses:

- `[claude-code:sonnet · L1 · $0.0000 · 102112ms]` for the current runtime
  article, verdict `PASS`
- `[claude-code:sonnet · L1 · $0.0000 · 38537ms]` for the computer-use article,
  verdict `PASS`
- `[claude-code:sonnet · Agent Viz Audit]` for the visual system, verdict
  `PASS WITH FIXES`
- `[claude-code:sonnet · L1 · $0.0000 · 110841ms]` for the bounded information
  architecture audit, verdict `PASS`

Required fixes from these reviews were applied:

- make PDF extraction and validation explicit;
- state receipt lookup and same-key retry after ambiguous timeouts;
- name the host-managed MCP client as the discovery actor;
- define occlusion and hit testing at first use;
- distinguish screenshot and session revisions;
- align formula notes with actual symbols;
- remove false completion checks when a reader jumps between steps;
- use Korean-first visual labels;
- reduce mobile density and repeated borders;
- keep visual surfaces and minimum font sizes consistent;
- remove duplicated numeric prefixes from learning-path labels.

## Formula and visual contract

Formulas use rendered math, Korean semantic annotations, and explicit symbol
notes. Mobile formulas may scale, but may not create horizontal scrolling or
escape their containing surface.

All new labs were measured at 390, 768, and 1440 px:

- document overflow: 0
- lab overflow: 0
- minimum visible font: 12 px
- current-runtime formula scale at 390 px: 0.81
- computer-use formula scales at 390 px: 1.00 and 0.88
- all formula scales at 768 and 1440 px: 1.00
- Korean annotations present: yes

Existing Agentic Patterns and Context Engineering formulas were split into
aligned lines, improving their 390 px scale from 0.65/0.67 to 1.00.

## Verification

- targeted ESLint: passed
- Agent Systems route and prompt-injection Playwright coverage: passed
- relevant combined route suite: 31 passed
- stale promptable-vision path expectations found during the broader run:
  corrected and passed in isolation
- production build: 8,866 modules transformed, built in 18.31 seconds
- only the existing large-chunk advisory remains

Production closure:

- `cm-blog.service` restarted at 2026-07-25 16:23:25 KST
- category, current runtime, computer use, and coordination routes: HTTP 200
- production Playwright run: 24 passed in 27.9 seconds
- covered mobile, tablet, desktop, lab state changes, MCP keyboard operation,
  ordered handoffs, and prompt-injection containment

Screenshots inspected:

- `/tmp/agent-runtime-mobile.png`
- `/tmp/agent-runtime-lab-mobile.png`
- `/tmp/computer-loop-mobile.png`
- `/tmp/retry-lab-mobile.png`
- `/tmp/computer-use-desktop.png`

## Small-model reconstruction plan

### 4B worker scope

Give a 4B model one bounded artifact and one falsifiable contract:

- verify one source claim and version;
- explain one action surface;
- derive one annotated formula;
- build one responsive Viz;
- map one failure to its owning layer.

Do not ask it to redesign the full route. Require structured output with source,
claim, intent, prerequisite, failure case, and verification fields.

### 9B reviewer scope

Use a 9B model to challenge local coherence:

- proposal versus authorization;
- API versus GUI versus MCP versus A2A;
- timeout failure versus ambiguous completion;
- transcript versus checkpoint;
- protocol concept versus product implementation;
- whether the article alone solves the hidden challenge.

The 9B reviewer should return missing definitions, contradictions, unsupported
claims, and the smallest repair. It should not rewrite the article wholesale.

### Orchestrator responsibilities

The larger orchestrator retains:

- route ownership and prerequisite decisions;
- source ledger and temporal checks;
- accepted Claude response headers;
- cross-article terminology;
- browser metrics and screenshots;
- build, test, and deployment evidence.

This separation lets smaller models produce narrow artifacts while the
orchestrator preserves the top-down learning contract and prevents locally
plausible sections from breaking the overall route.

## Decision provenance

The final structure came from the hidden challenge, not from counting existing
articles. Each failure in the challenge was assigned to an owner:

- wrong perception -> Computer Use
- wrong authority -> policy gate
- duplicate side effect -> effect contract
- lost progress -> durable harness
- delegation ambiguity -> A2A task lifecycle
- unsafe external content -> prompt-injection containment
- unmeasured reliability -> evaluation

Those owners became the route branches and article handoffs. This is why the
result starts from the current runtime and descends to ReAct, context, and
prompting only after the reader has a concrete system to explain.
