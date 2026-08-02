# Claw security path reconstruction

Date: 2026-07-26 KST

## Objective

Reconstruct the security learning path in dependency order:

1. Permission decides whether a requested action may proceed.
2. File tools must enforce an open-time workspace boundary.
3. Shell execution needs heuristic signals, OS containment, process lifecycle control and audit.

The reader should be able to distinguish a type or helper that merely exists from a guarantee
that is wired into every production execution path. Every implementation claim must open the
exact Rust snapshot in the article code sidebar.

## Internal hard problem

The hidden assessment used to develop the prose was:

> Given an apparently read-only shell request that contains a pipeline, command substitution,
> path traversal and a timeout, prove which layer authorizes it, which layer actually prevents
> workspace escape, what happens when the sandbox launcher is unavailable, whether descendants
> survive the timeout, and what evidence remains after execution.

A passing article must give the reader enough concepts and source evidence to answer this
without memorizing a list of dangerous commands. The answer requires the separation of:

- authorization decision versus resource containment;
- requested configuration versus supported and enforced behavior;
- warning signal versus blocking result;
- helper existence versus production wiring;
- timeout response versus process-tree termination;
- numeric exit code versus command-specific semantics.

## Source-to-claim method

The implementation was reconstructed from exact snapshots:

- `permissions.rs` and `permission_enforcer.rs`
- `file_ops.rs`
- `bash.rs`, `bash_validation.rs` and `sandbox.rs`
- the tools dispatcher that routes permission checks and `run_bash`

For every important statement the reasoning form was:

```text
observed source
-> narrow inference
-> article claim with an explicit boundary
-> code-sidebar evidence
-> browser and contract test
```

Examples:

- `validate_command()` has tests but no production caller, while `run_bash()` calls
  `execute_bash()` directly -> the validation module is a candidate, not an enforced pipeline.
- filesystem mode and allowed mounts are passed to the `unshare` child as environment variables
  without mount policy construction -> `filesystem_active` is not proof of workspace-only access.
- timeout wraps `command.output()` without visible process-group creation, kill and reap ->
  the response may time out, but descendant termination is not established.
- file workspace helpers are marked `#[allow(dead_code)]` and production read/write/edit do not
  call them -> the article must describe the present wiring gap before teaching TOCTOU hardening.

## Article changes

### Permission

- Replaced a fabricated three-mode ladder with the five source variants.
- Rebuilt the actual decision order: static deny, request context, ask, allow/mode, escalation
  prompt, final deny.
- Explained unregistered-tool and missing-prompter fail-closed behavior.
- Exposed the Prompt-mode handoff risk in the thin runtime enforcer.
- Separated authorization from file and shell containment.

### File tools

- Reconstructed real read, write, edit, glob and grep behavior.
- Marked workspace boundary helpers as currently dead-code and unwired.
- Distinguished lexical/canonical checks from handle-relative open-time enforcement.
- Added atomic replace, durability, optimistic concurrency and partial-search contracts as
  production hardening, not as existing implementation.

### Shell

- Replaced bubblewrap claims with the actual Linux `unshare` launcher.
- Replaced the fictional six-stage wired validator with the actual four-stage unwired candidate.
- Replaced Low/Medium/High/Critical destructive levels with the actual Warn/Allow branches.
- Removed invented network audit, background log and fixed 8KB/4KB claims.
- Explained the production dispatcher, optional enforcer, fail-open `sh -lc` fallback,
  filesystem enforcement gap, background lifecycle gap and exit/signal limitations.

## Viz decisions

All rendered figures use responsive HTML/CSS and Lucide icons instead of SVG text. The diagrams
show execution order, responsibility and current implementation state rather than decorative
boxes. Mobile is allowed to become vertical, but no figure may introduce horizontal scrolling or
text below 12 px.

Initial `whileInView` opacity was removed from File figures after it made automated or
reduced-motion captures blank. Animation can be added later as progressive enhancement; the
default rendered state remains complete.

## Claude reconciliation

Context Manager validation was split into independent bounded packets:

- Permission source claims
- Bash source and production wiring
- all three articles at 390, 768 and 1440 px

Headerless `500`, timeout and exit-143 outputs are invalid and are not accepted as reviews.
The first Permission attempt produced two 180-second timeouts and was superseded by smaller
packets. Accepted headers and final verdicts are appended only after a valid
`[claude-code:sonnet ...]` response.

Earlier File post-fix Claude review found the decisive `#[allow(dead_code)]` and production
wiring gap. The article was corrected before this final batch. Visual preflight found no
horizontal overflow or sub-12 px figure text, then identified flex footer wrapping and
viewport-opacity defects; both were fixed before final acceptance.

Accepted Bash source packets:

- `[claude-code:sonnet · L2 · $0.0000 · 125290ms]`: PASS for current validation/intent claims,
  four-stage order, Warn/Allow semantics, production non-wiring and code-reference ranges.
- `[claude-code:sonnet · L2 · $0.0000 · 114791ms]`: PASS for current runtime/sandbox claims,
  `unshare`, missing filesystem bind enforcement, host fallback, timeout/process-tree gap,
  post-hoc truncation and missing signal interpretation.
- `[claude-code:sonnet · L1 · $0.0000 · 73316ms]`: residual all-Viz FAIL. It found two
  unimported legacy figures that invented `check_working_dir()`, canonicalization and immediate
  destructive blocking. Both files were deleted rather than left as future regression sources.

File source closure:

- `[claude-code:sonnet · L2 · $0.0000 · 162326ms]` and
  `[claude-code:sonnet · L1 · $0.0000 · 47024ms]`: reproduced one ownership defect in a figure:
  silent UTF-8 skipping belonged to grep, not read.
- `[claude-code:sonnet · L1 · $0.0000 · 10258ms]`: post-fix PASS after attributing read's
  explicit UTF-8 error correctly and separating grep count whole-string matching from the
  content/files line loop.

Permission source and transfer closure:

- `[claude-code:sonnet · L1 · $0.0000 · 114269ms]`: source factuality PASS.
- `[claude-code:sonnet · L1 · $0.0000 · 127791ms]`: transfer FAIL. It found that Ask was drawn
  as a terminal result, the full policy path was conflated with direct file/bash helpers,
  override precedence was not scoped to `authorize_with_context`, and the synchronous prompter
  lacked an explicit production failure contract.
- `[claude-code:sonnet · L1 · $0.0000 · 122030ms]`: all prior blockers resolved, then found one
  stale heuristic example. The spaced redirect was already detected, so it was replaced with
  the actually missed no-space `echo ok>file` form.
- `[claude-code:sonnet · L1 · $0.0000 · 25319ms]`: final bounded Permission post-fix PASS.

Visual QA packets:

- `[claude-code:sonnet · L2 · $0.0000 · 115482ms]`: Permission visual PASS.
- `[claude-code:sonnet · L2 · $0.0000 · 109922ms]`: File visual FAIL for the empty sixth
  half-cell created by five tools in a two-column mobile grid. The last tool now spans both
  mobile columns and resets to one column at the next breakpoint.
- `[claude-code:sonnet · L2 · $0.0000 · 166629ms]`: Bash visual FAIL for a missing rendered
  whitespace between prose and inline code. Explicit JSX whitespace was added, and validation
  results were also promoted to semantic badges.
- `[claude-code:sonnet · L2 · $0.0000 · 42439ms]`: bounded visual post-fix PASS. The mobile
  File tool grid has no empty tile, Bash inline code spacing is correct, and validation badges
  have no clipping or exaggerated sizing.

## Verification ledger

- Production build: passed, 8,871 modules transformed.
- Focused Playwright: 13/13 passed at 390, 768 and 1440 px.
- Each route has question -> concept primer -> first figure order.
- Figure horizontal overflow: none in the three target articles.
- Rendered SVG text: zero.
- Minimum rendered figure text: at least 12 px.
- Permission, File and Bash code-panel evidence tests: passed.
- ESLint for the target articles/tests: passed.
- TypeScript `--noEmit`: passed.
- `git diff --check`: passed.
- `cm-blog.service`: restarted and active.
- Local/public asset identity: `assets/index-DZZbcKV3.js`.
- Public focused Playwright: 13/13 passed at 390, 768 and 1440 px.


## Reproducible 4B packet

A 4B worker gets one claim boundary:

```yaml
article: claw-bash
claim_id: validation_wiring
question: Is validate_command called before every production execute_bash?
evidence:
  definitions:
    - rust/crates/runtime/src/bash_validation.rs:590-615
  callers:
    - exact rg result for validate_command
  production_route:
    - rust/crates/tools/src/lib.rs:1200-1212
    - rust/crates/tools/src/lib.rs:1915-1920
allowed_output:
  observed: exact facts only
  inference: one bounded sentence
  status: pass | fail | unknown
forbidden:
  - infer safety from a module name
  - treat tests as production wiring
  - propose a global curriculum
```

Other 4B packets independently inspect permission order, workspace-helper wiring, unshare
arguments, timeout lifecycle and DOM geometry.

## Reproducible 9B review

A 9B reviewer receives the completed 4B packets and checks:

1. every article claim is owned by a source packet;
2. “current implementation” and “production hardening” are visibly separated;
3. contradictions between definition, caller and browser packets are surfaced;
4. the reader can solve the internal hard problem using only the article;
5. prose introduces each figure before it appears;
6. figures expose state and responsibility, not just a list of nouns;
7. 390/768/1440 evidence has no overflow, clipped text, blank initial state or sub-12 px labels;
8. code-panel links open the source slice that actually supports the nearby claim.

The orchestrator retains ownership of cross-article ordering, conflicting evidence, edits,
build, deployment and public acceptance.
