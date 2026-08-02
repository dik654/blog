# Claw Core and Infra reconstruction receipt

Date: 2026-07-29  
Pinned Claw revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`  
Scope: `claw-overview`, `claw-compaction`, `claw-config`, `claw-api-client`,
`claw-cli`, `claw-mcp`

## Why this reconstruction exists

The previous articles often had the right topic name but taught an imagined
architecture. A type name in one file was expanded into a runtime capability,
test doubles were presented as production paths, and a descriptor was treated
as proof that a transport executed. This run changes the authoring unit from
"topic summary" to "source-backed boundary question."

The reader-facing intent is:

1. Start with one failure or prediction question.
2. Define only the terms needed to answer it.
3. Trace the smallest production path that determines the answer.
4. Separate descriptors, validators, mocks, and manifests from executable
   runtime behavior.
5. Stop at the first source boundary that is sufficient for the question.

## Reproducible workflow for a 4B or 9B model

Small models should not receive the whole repository and a request to "write a
deep article." Use the bounded packets below.

### Pass 1: question and source inventory

Input:

- one target question;
- one pinned revision;
- at most three related source snapshots;
- a list of exact functions, enums, and constants to inspect.

Output:

```yaml
question: one behavior the reader must predict
production_entry: exact function or type
supporting_symbols:
  - symbol
non_production_boundaries:
  - mock, manifest, validator, descriptor, or test-only path
unknowns:
  - claims not proved by the supplied packet
```

Reject the pass if it describes a capability without naming the function that
executes it.

### Pass 2: claim ledger

For every reader-facing claim, record:

```yaml
claim: plain-language sentence
source: file and symbol
evidence_kind: production | descriptor | validator | mock | manifest | test
confidence: direct | derived | unknown
counterexample: nearest tempting but false interpretation
```

Only `direct` and mechanically simple `derived` claims may enter the article.
An `unknown` becomes an explicit boundary, not filler prose.

### Pass 3: adversarial questions

Create at least one hard prediction per boundary. The article passes only if a
reader can answer it from the prose without source access.

- What changes if the input arrives through a pipe rather than a TTY?
- Does an HTTP transport descriptor prove that the manager can execute it?
- Does a timeout retry the same side-effecting tool call?
- Does a lifecycle validator drive the subprocess?
- Does a calculated compacted session automatically replace runtime state?
- Does a Python mock prove the Rust production path?

These questions are author tests. They are not copied into the article as a
problem set unless the learning design calls for one.

### Pass 4: causal article order

Use this section order:

1. failure or prediction question;
2. concept primer;
3. executable path;
4. state transition or data transformation;
5. failure and recovery boundary;
6. implementation handoff;
7. stop rule and sources.

Never open with a large architecture scene before the reader knows the
question the scene answers.

### Pass 5: Viz contract

One stateful lab represents the article's hardest boundary. Each control must
change a real derived result, not merely recolor a diagram.

Required states:

- normal path;
- unsupported or invalid input;
- partial failure;
- recovery or next-call behavior.

Required geometry:

- vertical rail at 390 CSS px;
- compact horizontal stages at 1440 CSS px;
- no internal horizontal scroll;
- labels remain at readable browser text sizes;
- motion communicates state transition and respects reduced motion.

### Pass 6: independent closure

The minimum closure packet is:

1. static type and lint checks;
2. Playwright content/state/overflow assertions;
3. 390, 768, and 1440 screenshots;
4. a read-only Claude audit through Context Manager;
5. HTTP 200, exact `ACCEPT` or `REVISE` first line, stable before/after source
   hashes;
6. a narrow re-audit after every `REVISE`.

A timeout, empty body, malformed first line, or source mutation is not a
review. It must never be counted as acceptance.

## Article decisions

### Core overview

Target question: Which files prove the production runtime, and which only prove
a test or packaging surface?

Reasoning:

- the Rust CLI and runtime crates own the production path;
- the Python package is a separate mock-oriented boundary;
- a parity manifest describes intended coverage but does not execute it;
- end-to-end evidence must name the exact binary and server used.

The article was rebuilt around evidence classes instead of a fabricated
layered architecture.

### Compaction

Target question: If the preserved tail starts with `tool_result`, can the
session be cut at the raw message-count boundary?

Reasoning:

- trigger, safe cut, deterministic summary, merge, and state installation are
  separate decisions;
- token estimation uses UTF-8 byte length, not a tokenizer;
- `tool_use` and `tool_result` must remain paired;
- this revision has no `SummaryCompressor`, relevance ranking, or
  `max_summary_tokens`;
- manual compaction returns a value, while the automatic path may install it.

Obsolete unrendered files containing the invented compressor were deleted so
the false contract cannot re-enter a later article.

### Config

Target question: Which file or environment value wins, and at what point does
the merged configuration become runtime state?

Reasoning:

- enumerate the real file precedence and environment overrides;
- distinguish merge semantics from validation and startup;
- remove invented OAuth, remote bootstrap, WebSocket, and timing layers that
  were not present in the pinned source.

### API client

Target question: What does the provider enum actually change on the wire?

Reasoning:

- follow enum selection to endpoint, headers, request conversion, and stream
  event conversion;
- teach the six actual stream events;
- keep prompt-cache behavior scoped to the provider paths that implement it;
- reject a universal provider interface inferred from similar method names.

### CLI

Target question: Why do no positional arguments produce a REPL in one process
and a one-shot prompt in another?

Reasoning:

- `main` is synchronous and launch parsing is manual;
- TTY state participates in input classification;
- rustyline returns typed outcomes for cancel, exit, and submitted text;
- slash commands are an enum handled by a direct match;
- `handle_repl_command()` returns whether to persist the changed session, not
  whether to terminate the REPL;
- only literal `/exit` or `/quit` checks and `ReadOutcome::Exit` terminate it;
- rendering and init have their own state contracts.

The first CLI audit found the persistence/exit confusion. The prose, capability
check, content spec, and Playwright contract were corrected before the narrow
re-audit.

### MCP

Target question: How can Claw be both an MCP client and an MCP server without
mixing the two execution directions?

Reasoning:

- configuration exposes six client transport descriptors, but the current
  manager executes only stdio;
- startup performs initialize and paginated `tools/list`, then builds
  `mcp__server__tool` routes;
- schema fallback and annotation-derived permissions happen at the CLI
  projection boundary;
- framing is `Content-Length` plus JSON-RPC version and id validation;
- initialize, discovery, and resources may retry once after reset;
- `tools/call` resets after a retryable failure but does not replay the same
  invocation;
- the 11-phase lifecycle validator records and validates transitions; it is not
  the manager's subprocess engine;
- `claw mcp serve` reverses the arrow and exposes only initialize, tools/list,
  and tools/call with protocol `2025-03-26`;
- the auxiliary `McpToolRegistry` remains distinct from the CLI's direct
  `RuntimeMcpState` path.

## Claude receipt ledger

All accepted calls used Context Manager
`POST http://127.0.0.1:18002/api/orchestration/delegate` with
`claude-code:sonnet`. The acceptance gate required HTTP 200, a successful first
attempt, strict first-line parsing, and identical source hashes before and
after the read-only audit.

| Scope | Final receipt | Verdict |
| --- | --- | --- |
| Config | `.codex-tmp/claude-claw-core-infra-reaudit-2026-07-29` / `infra-config-final` | ACCEPT |
| Compaction | `.codex-tmp/claude-claw-api-compaction-final-2026-07-29` / `compaction-corrected` | ACCEPT |
| API client | `.codex-tmp/claude-claw-api-overview-final-2026-07-29` / `api-final-retry` | ACCEPT |
| Core overview, Rust and manifest | `.codex-tmp/claude-claw-overview-cli-final-2026-07-29` / `overview-rust-manifest` | ACCEPT |
| Core overview, Python and mock | same queue / `overview-python-mock` | ACCEPT |
| CLI render and init | same queue / `cli-render-init` | ACCEPT |
| CLI corrected input and slash path | `.codex-tmp/claude-claw-mcp-cli-reaudit-2026-07-29` / `cli-corrected` | ACCEPT |
| MCP transport and runtime | same queue / `mcp-transport-runtime` | ACCEPT |
| MCP wire and lifecycle | same queue / `mcp-wire-lifecycle` | ACCEPT |
| MCP server and registry split | same queue / `mcp-server-registry` | ACCEPT |

The final four CLI/MCP packets were run concurrently. All returned HTTP 200,
`strict_valid=true`, `source_hash_stable=true`, and exact first-line
`ACCEPT`. Historical empty, timeout, malformed, or pre-fix `REVISE` receipts
remain in the audit directories as rejected evidence and are not counted.

## Mechanical validation

- Focused ESLint: pass.
- `git diff --check`: pass.
- Six Claw contract suites: 12/12 pass.
- MCP viewport checks: 390, 768, and 1440 CSS px, no document or lab horizontal
  overflow.
- MCP element screenshots:
  - `.codex-tmp/claw-mcp-runtime-mobile.png`
  - `.codex-tmp/claw-mcp-runtime-desktop.png`
- Full TypeScript/Vite production build: pass, 8,772 modules transformed.
- Integrated Claw, sidebar, and current-first route Playwright suite: 50/50
  pass.
- Public Claw contract suite after deployment: 12/12 pass.
- `cm-blog.service`: active after restart.
- Public HTML, generated JS, and generated CSS: HTTP 200.
- Legacy `/blog/`: HTTP 308 to `/lab/blog/`.
- Local and public `index-4uuf4pte.js` SHA-256:
  `067eaa7e7f7816819523d6f0d5e28c31db2443a8ec28bc7a7659f1c5d41331e9`.

## Maintenance rule

When the Claw revision changes:

1. diff only the pinned source anchors;
2. mark affected claims stale;
3. rerun the adversarial prediction for each changed boundary;
4. update prose and Viz from the claim ledger;
5. rerun static, browser, and Claude closure;
6. never carry an old `ACCEPT` receipt across a changed source hash.
