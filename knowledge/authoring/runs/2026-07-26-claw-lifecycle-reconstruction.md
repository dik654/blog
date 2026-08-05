# Claw Lifecycle Reconstruction Run

Date: 2026-07-26

## Scope

- Learning path: `ai-claw-lifecycle`
- Articles: `claw-worker-boot`, `claw-hooks`, `claw-plugin`
- Goal: replace speculative architecture prose with an evidence-first path from worker state observation, through hook interception, to plugin aggregation and process execution.

## Reasoning trace

1. Read the rendered article roots, section files, Viz components, learning-path labels, and earlier comparison notes.
2. Read the authoritative Rust implementations before preserving any existing claim.
3. Classify every important statement as one of:
   - observed: directly present in the copied source snapshot;
   - inferred: a consequence of control flow, explicitly labelled as inference;
   - hardening: a stronger production design not implemented by the current code.
4. Construct one transfer question per article. The prose must provide enough evidence to answer it without memorising a table.
5. Put prose before each Viz. Each Viz compresses a flow already explained in words and must remain readable at 390, 768, and 1440 px.
6. Attach exact source snapshots to `CodeSidebar`; line highlights show the evidence used by the prose.
7. Run Claude audits independently. Treat a sandbox-blocked audit as an internal-consistency review, not a source fact-check.
8. Verify rejected fabricated claims, responsive overflow, minimum figure text size, source-panel navigation, TypeScript, lint, build, local browser rendering, and public deployment.

## Source map

### Worker Boot

- `runtime/src/worker_boot.rs`: seven statuses, registry operations, screen-text observation, trust/prompt state changes, completion/timeout observation, state-file emission.
- `runtime/src/trust_resolver.rs`: separate path-and-screen trust resolver. It is not silently merged into `WorkerRegistry`.
- `tools/src/lib.rs`: worker tool specs and adapters. These expose state-control calls; they do not prove terminal delivery.

Transfer question: when `WorkerSendPrompt` returns `Running`, what evidence proves that the intended terminal received the prompt?

### Hooks

- `runtime/src/hooks.rs`: three events, sequential command runner, payload/env/output protocol, exit-code semantics, abort polling.
- `runtime/src/config.rs`: three command arrays; no matcher or per-hook timeout.
- `runtime/src/conversation.rs`: Pre hook, updated input, permission policy, tool execution, Post success/failure order.
- `plugins/src/lib.rs` and CLI `main.rs`: enabled plugin hooks are aggregated and merged into runtime hook config.

Transfer question: after a Pre hook rewrites input, which value reaches permission policy and the tool, and what can a Post hook still undo?

### Plugins

- `plugins/src/lib.rs`: manifest discovery, origin kind, enablement, hook/tool aggregation, lifecycle commands, install/update paths, direct process execution.
- `tools/src/lib.rs`: plugin `requiredPermission` is converted to a runtime permission requirement before dispatch.
- CLI `main.rs`: plugin hooks and tools join runtime state, plugins initialize before policy construction, shutdown runs in reverse registry order.

Transfer question: can a valid manifest with a read-only tool requirement prove that the spawned plugin process cannot write outside the workspace?

## Claude collaboration record

- Worker source audit: `[claude-code:sonnet · L1 · $0.0000 · 76881ms]` — FAIL; identified fabricated states, PTY/process supervision, timings, and path/state-file gaps.
- Hooks source audit: `[claude-code:sonnet · L2 · $0.0000 · 115970ms]` — FAIL; identified wrong event set, order, protocol, timeout, chain, and failure semantics.
- Hooks permission recheck: `[claude-code:sonnet · L1 · $0.0000 · 12439ms]` — corrected an initial overstatement about an `allow` override bypass.
- Plugin fact audit: `[claude-code:sonnet · L3 · $0.0000 · 149331ms]` — FAIL; identified a fabricated capability-based `PluginKind`, manifest, discovery tiers, sandbox, timeout, and health-state lifecycle.
- Plugin mobile-Viz audit: `[claude-code:sonnet · L2 · $0.0000 · 125135ms]` — FAIL; measured 6-8 px effective SVG labels at 390 px and confirmed Viz-before-prose ordering.
- Three additional Context Manager Sonnet calls were run in parallel. Their source access was limited to `/home/heru/code/blog`, so they are retained only as internal-consistency audits, not authoritative fact checks.
- Worker post-fix audit: `[claude-code:sonnet · L2 · $0.0000 · 24782ms]` — found four residual wording issues and one layout issue. All five were corrected.
- Worker focused recheck: `[claude-code:sonnet · L2 · $0.0000 · 17964ms]` — confirmed the earlier findings were closed and found one final overstatement: a send attempt does not always create a receipt. The article, Viz, source annotation, and transfer answer now describe the receipt as caller-provided and optional.
- Hooks post-fix factual audit: `[claude-code:sonnet · L1 · $0.0000 · 37794ms]` — PASS.
- Hooks post-fix transfer audit: `[claude-code:sonnet · L1 · $0.0000 · 33995ms]` — PASS.
- Plugin post-fix factual and mobile-Viz audit: `[claude-code:sonnet · L2 · $0.0000 · 48491ms]` — PASS.

## Final verification

- Targeted ESLint: PASS.
- TypeScript project build: PASS.
- `git diff --check`: PASS.
- Local Playwright learning contract: 13/13 PASS at 390, 768, and 1440 px.
- Worker descendant-level figure measurement: no child overflow or figure-boundary clipping at 390 and 768 px.
- Production Vite build: PASS, 8,872 modules transformed. Large source-snapshot chunks emit size warnings but no build failure.
- Production service restarted at `2026-07-26 23:32:03 KST` with PID `1041607`.
- Local and public HTML both reference `index-NYpf5EdV.js` and `index-at-rOQVJ.css`.
- Public Playwright learning contract: 13/13 PASS.

## Small-model handoff packet

For a 4B/9B model, narrow one article at a time:

1. Provide only the article files and exact source excerpts referenced by `codeRefs.ts`.
2. Ask for an `observed / inferred / hardening` claim ledger before prose.
3. Supply one transfer question and require a source-line answer.
4. Ban new type names, constants, timings, and lifecycle states unless copied from the evidence packet.
5. Render one flow Viz after its prose; test no overflow and no text below 12 px.
6. Reject completion until stale false-claim strings are absent and the source panel opens.

This packet keeps the task inside a small context while preserving the same factual and pedagogical constraints.
