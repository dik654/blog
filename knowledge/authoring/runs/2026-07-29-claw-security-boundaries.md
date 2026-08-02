# Claw security boundary reconstruction receipt

Date: 2026-07-29  
Pinned Claw revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`  
Scope: `claw-permissions`, `claw-file-ops`, `claw-bash`

## Why these three articles are one learning unit

A permission decision is not a side-effect boundary. The learner must follow
three different questions in order:

1. May this named tool request proceed?
2. Which file object does the process actually open?
3. Which process, filesystem, and network effects can the shell create?

Mixing these questions produces a common but dangerous inference:
`PermissionOutcome::Allow` means the eventual operation is contained. The
source does not prove that inference. The articles therefore use the same
three-step header and hand off from policy to file I/O to shell containment.

## Ground-truth preparation

The production repository was fixed at the revision above. These embedded
snapshots were checked with `cmp` against the workspace source:

- `claw-permissions/codebase/permissions.rs`
- `claw-permissions/codebase/permission_enforcer.rs`
- `claw-file-ops/codebase/file_ops.rs`
- `claw-bash/codebase/bash.rs`
- `claw-bash/codebase/bash_validation.rs`
- `claw-bash/codebase/sandbox.rs`

The production dispatch files are too large for a bounded reviewer packet, so
exact excerpts were captured separately:

- `permission_wiring.rs`
- `tools_file_wiring.rs`
- `tools_bash_wiring.rs`

The excerpt is evidence only for the named call site. It must not be used to
infer behavior outside its displayed range.

## Article reasoning

### Permission model

Target question:

> If Allow, Ask, and Deny all appear to match, can the reader predict the
> result and name the next enforcement owner?

Required source facts:

- five `PermissionMode` variants;
- an unknown tool requires `DangerFullAccess`;
- static deny precedes hook context;
- ask precedes ordinary allow or mode satisfaction;
- Ask without a prompter fails closed;
- Prompt-mode `PermissionEnforcer::check()` can return `Allowed` as a caller
  handoff, not as proof of user approval;
- the optional registry enforcer is not the same object as the conversation
  policy configuration.

Adversarial cases:

- Deny plus hook Allow still denies.
- Hook Allow plus Ask still reaches Ask.
- Unknown tool under ReadOnly denies.
- Prompt enforcer `Allowed` does not prove a prompt occurred.
- Derived enum ordering is not a coherent least-privilege ladder.

The interactive lab changes the actual rule trace and outcome for these cases.
It is placed after the motivating question, not before the reader knows what
the scene is meant to resolve.

### File boundary

Target question:

> Can a lexical or canonical path check prove that the object opened later is
> still inside the workspace?

Required source facts:

- `read_file` is a bounded text contract, not a binary-safe reader;
- `write_file` performs direct `fs::write`;
- `edit_file` is read, exact match, replace, direct write;
- glob has a result cap, while traversal work may happen before that cap;
- grep uses regex plus `WalkDir`, with context and result limits;
- workspace wrappers exist but current production dispatch calls the plain
  helpers;
- a pre-open check remains vulnerable to object substitution between check and
  use.

Adversarial cases:

- a symlink resolves outside the workspace;
- an ancestor directory changes after validation;
- a checked target is swapped before open;
- atomic rename is confused with durability;
- a target design using descriptor-relative open is described as current code.

The lab explicitly labels current behavior and the stronger open-time target.
This avoids turning a hardening proposal into a false source claim.

### Shell boundary

Target question:

> If `rm`, `sudo`, and `curl` are classified correctly, is the spawned shell
> contained?

Required source facts:

- production dispatch classifies the command, optionally checks an enforcer,
  calls `run_bash`, and reaches `execute_bash`;
- `validate_command()` has four stages but no production call site in the
  pinned revision;
- Warn and Block are different contracts;
- intent classification has eight variants;
- Linux isolation uses an `unshare` launcher;
- requested filesystem mode is carried in environment state but is not proved
  by bind-mount enforcement in this launcher;
- the builder returns `None` only when both namespace and network isolation are
  inactive;
- once a launcher is created it adds user, mount, IPC, PID, and UTS namespace
  flags even if the separately reported `namespace_active` field is false;
- only the `--net` flag is conditional on network isolation;
- launcher absence falls back to host `sh -lc`;
- foreground timeout is not evidence of descendant process-group cleanup;
- background execution redirects standard streams and returns a PID.

Adversarial cases:

- validator source exists but is unwired;
- `unshare` is unavailable;
- workspace-only is requested without a filesystem enforcement backend;
- timeout fires while descendants remain;
- a background PID is returned without lifecycle ownership.

The shell lab exposes each case as a state transition. The article keeps signal
generation, authorization, sandboxing, process control, and audit evidence as
separate layers.

## Bounded workflow for 4B and 9B models

Do not ask a small model to review all three articles and the full repository.
Use one packet per claim family.

```yaml
packet:
  question: one behavior to predict
  article_files: 1-2
  source_snapshot: 1
  production_excerpt: 0-1
  exact_symbols: 2-4
  counterexamples: 2
output:
  verdict: supported | contradicted | unknown
  evidence:
    - file
    - symbol
  current_behavior: one sentence
  target_behavior: one sentence
```

Recommended passes:

Security lane:

1. policy core;
2. enforcer wiring;
3. permission learning contract;
4. read/write/edit/search;
5. file boundary wiring;
6. file learning contract;
7. Bash runtime;
8. sandbox;
9. validator and intent;
10. Bash navigation and learning contract.

Information-architecture lane:

1. primary ownership and dependency edges;
2. rendered sidebar stages and overflow;
3. current-first research route and navigation handoff.

The model must return `unknown` when its packet cannot prove a production call
site. A second model or deterministic script then checks route ids, source
hashes, selector coverage, and responsive geometry.

## Context Manager recovery record

The original three broad audits timed out with an empty result. A six-way split
also reached the 240-second Claude harness limit. One earlier permission call
returned `REVISE` only because the delegated sandbox could not read the source
outside the blog workdir. These are rejected receipts, not article findings.

Recovery rules:

- keep every failed raw response;
- never treat HTTP 200 alone as success;
- require `.ok == true`, the requested Claude worker, a non-empty exact
  `ACCEPT` or `REVISE` first line, and stable external source hashes;
- retry strict-invalid, empty, timeout, and HTTP failures instead of treating
  the transport response as a review;
- move pinned source copies inside the delegated workdir;
- remove internal hash recomputation from the model prompt;
- split the audit to named symbols and at most two to four relevant files;
- fix every valid `REVISE`, then run a new narrow audit.

Preserved queues:

- rejected broad audit:
  `.codex-tmp/claude-claw-security-preaudit-2026-07-29`
- rejected six-way audit and preserved initial attempt:
  `.codex-tmp/claude-claw-security-micro-2026-07-29`
- ten-way symbol audit:
  `.codex-tmp/claude-claw-security-nano-2026-07-29`
- older-timeout recovery:
  `.codex-tmp/claude-outstanding-recovery-2026-07-29`
- current eleven-way retry audit:
  `.codex-tmp/claude-final-current-recheck-2026-07-29`

The current retry audit completed all eleven tasks with stable before/after
source hashes. One Bash sandbox response had an invalid first line on its first
attempt; the runner preserved it, rejected it, and obtained a strict-valid
second response. Five strict-valid tasks returned `REVISE`:

1. `file-core-semantics` found incorrect file-source ranges;
2. `permission-mode-viz` found an off-by-one policy-helper range and a
   rule-matcher range/annotation mismatch;
3. `bash-runtime-core` found the missing preflight source excerpt and source
   references;
4. `sidebar-ownership-current` found that the route/directory ownership
   contract was not explicit;
5. `sidebar-render-current` found that the four-stage reading legend was not
   rendered in the sidebar.

All five were resolved. The permission policy range now ends at line 324, and
the rule-matcher reference explicitly includes `find_matching_rule` at
326-332, starts the Any/Exact/Prefix declarations at 335, and ends
`parse_rule_matcher` at 402. The file ranges, Bash preflight evidence,
presentation-owner attributes, and four-stage sidebar legend were corrected as
described in their respective implementation and browser evidence. The rejected
sandbox response also contained two source-checkable observations about
launcher state; these were independently verified against `sandbox.rs` and
fixed, but are not counted as a valid Claude verdict.

The post-fix closure queue is preserved at
`.codex-tmp/claude-postfix-closure-2026-07-29`. It found one additional P1
evidence gap: the file article asserted the production adapter path without
showing the pinned `tools/src/lib.rs` call site. The article now embeds
`tools_file_wiring.rs`, the exact concatenation of upstream lines 1213-1232 and
2069-2100, and exposes it from the first source-button group. The closure queue
also demonstrated the retry rule twice: a sidebar response contained a
substantive acceptance-style paragraph but no `ACCEPT` or `REVISE` verdict
token at all, while a reasoning response began `ACCEPT은 아니고 REVISE.`
instead of an exact verdict line. Both were rejected and reissued.

The strict-valid second reasoning response was itself `REVISE`. It identified
two receipt defects:

1. the receipt attributed the sandbox-state observations to valid reviews even
   though they came from a rejected first response;
2. the reproducible 4B/9B workflow omitted the three information-architecture
   packets that had found real sidebar ownership and rendering defects.

Both are resolved above: the sandbox observations are explicitly classified as
independently verified evidence from a rejected response, and the bounded
workflow now contains separate security and information-architecture lanes.

The evidence-closure queue at
`.codex-tmp/claude-evidence-closure-2026-07-29` then returned another
strict-valid `REVISE` for this receipt because the previous paragraph had not
yet recorded that reasoning verdict. This paragraph is the correction. The
first final-record queue at
`.codex-tmp/claude-final-record-closure-2026-07-29` then found one more omitted
audit record: `permission-mode-viz` was a fifth strict-valid `REVISE` in the
eleven-task queue. The five-item list above and its range-resolution paragraph
are the correction. The receipt remains open until a new post-edit reasoning
closure returns a strict-valid verdict with stable source hashes.

## Mechanical evidence so far

- focused TypeScript and ESLint checks: pass;
- `claw-security-boundaries-contract.spec.ts`: 3/3 pass;
- 390, 768, and 1440 CSS px:
  - no document horizontal overflow;
  - no lab horizontal overflow;
  - no overflowing block inside the article;
- full-page desktop and mobile captures:
  `.codex-tmp/claw-security-postfix-visual-qa-2026-07-29`;
- sidebar mobile capture:
  `.codex-tmp/claude-recheck-ia-sidebar-2026-07-29/sidebar-mobile-390.png`;
- all six full source snapshots and three bounded production-wiring excerpts
  match the pinned workspace source;
- the permission call-graph excerpt has SHA-256
  `f6206859be72214591ace4191f7956a3c3b040a08a09b71aafd28cce8ecafd7a`;
- the file production-wiring excerpt has SHA-256
  `75435da35509cee6a04f9349486a896db360858b136370b24e88d949d259b59b`;
- the expanded Bash wiring excerpt, including `PreflightDecision`, has SHA-256
  `1a6ec1aa62818a144cae7cd29bdebabeaeea1edaae9a0705c2481cb3a9b25dd7`;
- focused TypeScript, ESLint, and `git diff --check`: pass;
- security, research-track ownership, and sidebar browser contracts: 39/39
  pass across their configured viewports;
- current graph evidence:
  `.codex-tmp/claude-recheck-ia-sidebar-2026-07-29/ai-learning-graph-current.json`;
- current ownership evidence:
  `.codex-tmp/claude-recheck-ia-sidebar-2026-07-29/ownership-current-evidence.json`.
- `npm run build:tsc`: pass, 8,778 modules transformed;
- `cm-blog.service`: restarted and active at 2026-07-29 14:05:44 KST;
- public article routes and the AI foundation query: HTTP 200;
- deployed bundle `/lab/assets/index-7csGbymN.js`: HTTP 200, 1,740,864 bytes;
- the same security, research-route, and sidebar browser contracts against
  `https://heru.ragdoll-bigeye.ts.net`: 39/39 pass.

Final closure: the exact post-edit receipt audit is preserved at
`.codex-tmp/claude-receipt-exact-final-v2-2026-07-29`. It returned `ACCEPT` on
its first attempt with a strict-valid response and stable before/after source
hashes at 2026-07-29 14:21:51 KST.

Current status: implementation, build, deployment, local/public browser
contracts, and the exact post-edit Claude closure are complete for this batch.
