# Agent operations contracts reconstruction

Date: 2026-07-29 KST

## Objective

The Agent branch already had articles named Subagent Orchestration, Telemetry and Recovery.
The problem was not the absence of those nouns. The reader could not reliably answer where a
caller return ended, where background work continued, what evidence a telemetry call actually
created, or whether a recovery result had executed its escalation policy.

This pass keeps three articles because they own three different executable contracts:

1. `claw-subagent-orchestration`: delegation input, worker construction, tool boundary and
   manifest timing.
2. `claw-telemetry`: event construction, sequence ownership, sink call and durability evidence.
3. `claw-recovery`: failure classification, bounded recipe execution, exact result and external
   escalation ownership.

Combining them would make `running`, `recorded`, `recovered` and `effect verified` look like one
generic success state. They are intentionally kept separate and connected in this order:

```text
task ownership
-> subagent execution
-> policy decision
-> telemetry evidence
-> bounded recovery
```

## Source boundary

The Claw source snapshot is pinned to:

```text
ab44985916cb0d53d2f7a55ea90e0d7be97d4626
```

The audit packet copied the exact Rust files and recorded their hashes under:

```text
.codex-tmp/claude-agent-contracts-current-2026-07-29/
```

The articles do not treat a type, enum field or policy value as a guarantee merely because it
exists. A claim is included only when its construction, call site, return timing and downstream
consumer can be followed in the pinned source.

## Hidden transfer problems

These problems were used as private coverage gates. They are not printed as reader quizzes.

### Subagent

A caller requests an unregistered `security-review` type. The broad default allowlist exposes
`edit_file`. Spawn succeeds, so the caller receives a `running` manifest. The background thread
later panics after changing a file.

The article must let a reader distinguish:

- type normalization from dynamic agent ranking;
- model-visible definitions from executor dispatch authorization;
- spawn failure from background runtime failure or panic;
- immediate `running` return from terminal manifest persistence;
- terminal worker completion from parent acceptance and effect verification;
- current source behavior from proposed lease, deadline, budget and late-result merge.

### Telemetry

An HTTP helper records to a JSONL sink. It emits a typed envelope and then a `SessionTrace`. The
trace receives sequence zero. The write succeeds but flush fails. A direct trace is then emitted
through a clone of the tracer.

The article must let a reader derive:

- two sink calls for the helper, but one for direct trace;
- no sequence field on the typed envelope;
- shared sequence one on the next direct trace;
- synchronous function return without proof of durable storage;
- flush uncertainty that is not reported to the producer;
- why token/cost accounting, redaction and exporters cannot be inferred from this enum.

### Recovery

`Provider` maps to `ProviderFailure`. The first attempt fails after one successful step. A second
attempt is requested. The recipe metadata says `Abort`.

The article must let a reader derive:

- which upstream failures can reach the bridge;
- the exact `PartialRecovery { recovered, remaining }` slices;
- the event suffix attached to the first attempt;
- the second call closing at the attempt gate without executing a step;
- attempt count staying at one;
- `Abort` remaining metadata because `attempt_recovery` does not execute the policy effect.

## Correction found by independent review

The first draft said five `WorkerFailureKind` values map to four recovery scenarios. Direct enum
inspection shows six:

```text
TrustGate
ToolPermissionGate
PromptDelivery
Protocol
Provider
StartupNoEvidence
```

Claude returned a malformed first line, so the receipt was invalid under the strict output gate.
The body still contained a concrete source finding. The finding was independently checked against
the pinned enum and match arms, then corrected in article prose, source notes and `content-spec.md`.
This is why transport validity and technical content are stored separately.

## Prose-to-Viz reasoning

The prose was fixed before the diagrams:

- Subagent starts with the caller-visible timing contradiction, then shows selection and lifecycle.
- Telemetry starts with the difference between an event call and durable evidence.
- Recovery starts with the difference between a returned result and an executed external effect.

The Viz components are small state machines rather than static architecture posters:

- controls alter inputs and failure timing;
- the displayed source-derived result changes;
- missing guarantees remain visibly separate from implemented behavior;
- state labels retain the same vocabulary used by the Rust types;
- mobile uses one causal column, while wider layouts compare stages without horizontal panning.

The narrative audit enforces that a heading does not jump directly to an unexplained Viz. One
Subagent section failed that gate, so its explanatory paragraph was moved before the interactive
surface.

## 4B and 9B execution packets

A small model should not receive the whole repository and an open-ended instruction to write the
article. It should receive one bounded packet with a typed output contract.

### Common packet

```yaml
article_owner: one executable question
source_revision: immutable commit
allowed_files: exact paths
source_claims:
  - claim
  - evidence anchor
  - boundary or missing guarantee
state_machine:
  inputs: []
  branches: []
  outputs: []
failure_counterexample: one concrete case
transfer_oracle: expected derivation
viz_contract:
  controls: []
  visible_states: []
  invariant: []
test_contract:
  selectors: []
  transitions: []
  responsive_threshold: scrollWidth <= clientWidth + 1
forbidden_claims: []
```

### 4B model scope

A 4B model receives one claim cluster or one Viz transition:

- enumerate a single Rust enum and its match consumers;
- trace one input through one branch and return value;
- produce a fact/boundary table;
- compare one rendered state with the expected oracle;
- never decide cross-article ownership or expand a guarantee.

The output is IR, not final prose. Missing evidence must be returned as `unknown`, not completed
from model memory.

### 9B model scope

A 9B model receives one full section packet:

- four to eight source claims;
- the private transfer problem;
- terminology and section handoff;
- one failure path and one unimplemented boundary;
- a concrete Viz state machine;
- exact browser assertions.

It may draft Korean prose and the component spec. The orchestrator still owns source freshness,
conflicting-claim resolution, article split/merge decisions, shared terminology, final code
integration, browser QA and deployment.

## Validation ledger

The first current-state queue ran eight independent Claude Sonnet audits in parallel. Strict
validity required HTTP 200, the forced worker identity, successful first attempt, an exact first
line of `ACCEPT` or `REVISE`, more than 80 output characters and stable before/after hashes.

Accepted current-state packets:

- Subagent source/prose
- Subagent Viz/test
- Telemetry source/prose
- Telemetry Viz/test
- Recovery Viz/test
- Sidebar ownership
- Agent learning flow

The Recovery source/prose packet was transport-invalid but exposed the six-versus-five defect.
After correction, a fresh final-hash queue re-ran every packet whose source or shared test hash
changed, plus the refreshed Tool Runtime tests.

## Verification and deployment

### Claude final-state receipts

The post-fix queue accepted:

- Subagent source/prose
- Subagent Viz/test
- Telemetry Viz/test
- Recovery Viz/test
- Agent learning flow
- refreshed Tool Runtime test

The full Recovery source packet hit the 240-second worker timeout and was not counted. It was split
into three smaller source packets:

- `attempt-gate-results`: `ACCEPT`
- `events-policy-boundary`: `ACCEPT`
- `bridge-six-to-four`: first returned `REVISE` because the audit prompt itself invented
  `PermissionDenied` and `ProtocolViolation`

The article was already correct. The corrected prompt used `TrustPromptUnresolved` and
`McpHandshakeFailure`; the same final article hashes then received `ACCEPT`.

Raw requests, results, HTTP codes and before/after hashes are stored in:

```text
.codex-tmp/claude-agent-contracts-current-2026-07-29/
.codex-tmp/claude-agent-contracts-postfix-2026-07-29/
.codex-tmp/claude-recovery-split-final-2026-07-29/
```

### Browser and build receipts

```text
focused ESLint: PASS
git diff --check: PASS
Vite production build: PASS, 8,831 modules
local agent ownership Playwright: 13/13 PASS
local narrative audit: 3 routes x desktop/mobile, 0 errors, 0 warnings
public agent ownership Playwright: 13/13 PASS
```

The first narrative audit found one `heading-directly-to-viz` warning in Agent Selection at both
desktop and mobile. Moving the explanatory paragraph before the Viz closed the post-fix audit at
zero warnings.

Independent interactive responsive QA exercised all three public routes at 360, 768 and 1440 px:

```text
claw-subagent-orchestration: document 0 overflow, both labs 0 overflow
claw-telemetry: document 0 overflow, lab 0 overflow
claw-recovery: document 0 overflow, lab 0 overflow
console and page errors: 0
```

At tablet and desktop the browser reports `scrollWidth - clientWidth = -15` because the viewport
client width includes the vertical scrollbar while the document layout width excludes it. Every
target surface itself reports exactly zero overflow.

### Deployment receipt

```text
service: cm-blog.service
restart: 2026-07-29 11:17:40 KST
status: active (running)
public URL: https://heru.ragdoll-bigeye.ts.net/lab/blog/
dist/local/public index SHA-256:
1ca4bf365397595fd31bfc67540ffa324220d3530fd0002a6421c539171ce6e0
```

### Agent hub information architecture correction

The first deployment still rendered the six Agent ownership branches after the full current-target
route. That made a navigation decision look like the final lesson in a long curriculum. The
branch selector is now rendered exactly once, immediately after the page header, and the
current-target research route follows it.

The change preserves two different responsibilities:

- the branch selector answers which Agent contract the reader wants to study;
- the current-target route answers how that system family descends from current research to
  minimum foundations and implementation checks.

The full local Claw and Agent contract suite passed `51/51`. A separate Claude IA audit accepted
the final DOM order and confirmed that the six branch owners remain distinct. Public Playwright
then verified the branch-first order, one selector, one route, and zero target-surface overflow at
360 and 1440 px.

```text
service: cm-blog.service
final restart: 2026-07-29 11:29:43 KST
dist/local/public index SHA-256:
9b7d45691a68dab22eb4e217fe47fa8d4639b4b35e8d30e08e30eb910d4adda4
public Agent hub order test: 1/1 PASS
focused ESLint: PASS
git diff --check: PASS
```

Public visual receipts:

```text
.codex-tmp/agent-hub-public-mobile-final.png
.codex-tmp/agent-hub-public-desktop-final.png
```
